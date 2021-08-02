/*
The goal of this script is to go through all the events in the database and take actions depending on their date
If the event already happened then 4 things need to be done:
    1)Remove event from eventsTable
    2)Insert event in oldEventsTable
    3)Remove event from upcoming events in all participants
    4)Insert event to past events of all participants
If the event is in the next two days send out an email to all participants reminding them of their commitment
If the event is in one week then send out an email to all participants with the event info and contact info of the orginizer
*/



const APIFuncs = require('./APIHelperFunctions')
// const sender = require('./notifications')
const moment = require('moment')
const fs = require('fs')
const sendMail = require('./notifications')


async function main() {

    await addToLogs(`[${getTimeStamp()}] Beginning database scan...\n\n`)

    //Get all events
    const data = await APIFuncs.list("events")
    const allEvents = data["Items"]
    for (let i = 0; i < allEvents.length; i++) {
        let event = allEvents[i]
        //Find the date
        const eventDate = event.date;
        const todayDate = getTodayDate();
        //Find the time difference
        var startDate = moment(todayDate, 'YYYY-M-DD HH:mm:ss')
        var endDate = moment(eventDate, 'YYYY-M-DD HH:mm:ss')
        var daysDiff = endDate.diff(startDate, 'days')

        //If the event is old then remove it from event db and insert into oldEvents db and remove from upcoming events of participants and place in oldEvents for participants
        if (daysDiff < 1) {
            //Record action in logs
            await addToLogs(`[${getTimeStamp()}] !!!!!! ${event.title} was ${daysDiff} days old`)
            await addToLogs(`[${getTimeStamp()}] !!!!!! ${event.title} participants: ${event.participants}`)

            //Remove event from eventsTable
            await APIFuncs.delete("events", event.id)
            //Insert event in oldEventsTable
            await APIFuncs.create("old-events", event)
            //Remove event from upcoming events in all participants
            const allParticipants = event.participants
            await allParticipants.forEach(async function (id) {
                //Get their data (to find the index of the event in their upcoming events)
                const userData = await APIFuncs.read("users", id)
                if (userData["Item"]) { //If the db returned a user from that id (its possible the user doesnt exist)
                    await addToLogs(`[${getTimeStamp()}] ${event.title} was removed from ${userData["Item"].name}'s (${id}) upcoming events `)
                    const upcomingEvents = userData["Item"].upcomingEvents
                    let eventIndex = -1;
                    try {
                        eventIndex = upcomingEvents.findIndex((e) => e.includes(event.id))
                    } catch (err) {
                        eventIndex = upcomingEvents.findIndex((e) => Object.values(e).indexOf(event.id))
                    }
                    if (eventIndex !== -1) {
                        if (userData["Item"].pastEvents !== undefined) {

                            //Update their data
                            let UpdateExpression = "REMOVE upcomingEvents[" + eventIndex + "]"
                            await APIFuncs.update("users", id, UpdateExpression, undefined)

                            //Insert event to past event of all participants
                            UpdateExpression = "set pastEvents = list_append(pastEvents, :i)"
                            let ExpressionAttributeValues = { ":i": [event.id] }
                            await APIFuncs.update("users", id, UpdateExpression, ExpressionAttributeValues)

                        } else { //The user must not have a pastEvents list so add one

                            //Insert event to past events
                            let UpdateExpression = "set pastEvents = :i"
                            let ExpressionAttributeValues = { ":i": [event.id] }
                            let res = await APIFuncs.update("users", id, UpdateExpression, ExpressionAttributeValues)
                            // console.log(res)
                        }

                    }
                }
            })

        } else if (daysDiff < 3) {
            //Send out reminder that the event is coming up soon
            const allParticipants = event.participants
            await addToLogs(`[${getTimeStamp()}] sent imminent email reminder for ${event.title} to ${allParticipants}`)
            await allParticipants.forEach(async function (id) {
                const userData = await APIFuncs.read("users", id)
                // await sender.sendEmail('PlatinumVolunteers@gmail.com', 'Your event is coming up soon!', 'Here is some event info: ' + event)
                if(userData.email !== undefined) {
                    let body = `<h1>${event.header} is coming up soon!</h1> \n 
                        <p>Here is the info:<p>\n 
                        <ul>
                            <li><b>Time</b> : ${event.date}</li> \n 
                            <li><b>Location</b> : ${event.location}</li> \n 
                            <li><b>Organizer</b>: ${event.organizer}</li> 
                        </ul>
                        <br>
                        <p>Feel free to reach out to ${event.organizer} (${event.organizerEmail}) with any questions or concerns.</p>`
                    await APIFuncs.sendEmail(userData.email, event.title, body)
                }
            })
        } else if (daysDiff === 7) {
            //Send reminder than event is in one week
            const allParticipants = event.participants
            await addToLogs(`[${getTimeStamp()}] sent one week email reminder for ${event.title}  to ${allParticipants} `)
            await allParticipants.forEach(async function (id) {
                const userData = await APIFuncs.read("users", id)
                if(userData.email !== undefined) {
                    // sender.sendEmail('PlatinumVolunteers@gmail.com', 'Your event is one week away!', 'Here is some event info: ' + event)
                    let body = `<h1>${event.header} is in one week!</h1> \n 
                        <p>Here is the info:<p>\n 
                        <ul>
                            <li><b>Time</b> : ${event.date}</li> \n 
                            <li><b>Location</b> : ${event.location}</li> \n 
                            <li><b>Organizer</b>: ${event.organizer}</li> 
                        </ul>
                        <br>
                        <p>Feel free to reach out to ${event.organizer} (${event.organizerEmail}) with any questions or concerns.</p>`
                    await APIFuncs.sendEmail(userData.email, event.title, body)
                }

            })

        } else {
            // await addToLogs(`[${getTimeStamp()}] no acition taken for ${event.title}. It is in ${daysDiff} days `)
        }
    }

    sendOutLogs()


}

main()


function getTimeStamp() {
    let date_ob = new Date();


    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let stamp = `${month}/${date} ${hours}:${minutes}`;

    return stamp

}


function getTodayDate() {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;


}

async function addToLogs(textToAppend) {
    var data = fs.readFileSync('./logs.txt'); //read existing contents into data
    var fd = fs.openSync('./logs.txt', 'w+');
    // var buffer = new Buffer(textToAppend + '\n');
    var buffer = Buffer.from(textToAppend + '\n', "utf-8")

    fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
    fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
    // or fs.appendFile(fd, data);
    fs.close(fd, (err, data) => {
        if (err) {
            console.log(err)
        }
    });
}


async function sendOutLogs() {
  var data = fs.readFileSync('./logs.txt', 'utf-8'); //read existing contents into data
  console.log(data)
  sendMail.sendEmail("PlatinumVolunteers@gmail.com", "Process Events Logs", data)
}