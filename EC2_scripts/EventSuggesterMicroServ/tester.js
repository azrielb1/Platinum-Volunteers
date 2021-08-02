// const sender = require('./notifications')

// sender.sendEmail('Eliyahu.Levy21@gmail.com', 'Test subject', 'This is the body')
const APIFuncs = require('./APIHelperFunctions')

let test = async function () {
    const allPastEvents = [5790,
        5885,
        6810,
        7565,
        9730,
        9995,
        10290,
        10535,
        18190
        ]

    // let ue =  "REMOVE upcomingEvents[1]"
    // // let eav = { ":i": [103] }
    // let res = await APIFuncs.update('users', '1d691753-189e-417d-93af-f5da5695e344', ue)
    // console.log(res)

    //Load all users
    //If the user doesnt have past events give him some random past events
    let users = await APIFuncs.list('users');
    users["Items"].forEach(async function (user) {
        if (user.pastEvents == undefined) {
            let events = []
            for(let i = 0; i < allPastEvents.length; i++) {
                if(Math.random() < 0.7) {
                    events.push(allPastEvents[i])
                }
            }


            let ue = "set pastEvents = :i"
            let eav = { ":i": events }
            let res = await APIFuncs.update('users', user.id , ue, eav)
            console.log(res)
        }
    })
}


test()