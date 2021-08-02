/*
This service with generate suggestions to users based on their past events

1)create a dictionary that maps tags to number of appearances in the user's past events
    a)Load all users from the database and iterate through them
    b)Load all past and upcoming events events from the database (create a dictionary that maps id to event data)
    c)for each user:
        i) create a empty frequencies dictionary
        ii) for each event in their past events:
            A) either add the entry for this tag or increase the count by one
        iii) go through upcming events and do step 2
2)create a dictionary that maps each upcoming event to a score = sum(each tag frequency)
3)return the four top scoring events
*/

const APIFuncs = require('./APIHelperFunctions')
const sendMail = require('./notifications')

async function main() {
  let outputStr = ""

  //Load necessary data
  const users = await APIFuncs.list('users')
  const oldEvents = await APIFuncs.list('OldEvents')
  const upcomingEvents = await APIFuncs.list('events')
  let eventIDLookup = {}
  // console.log(oldEvents)
  oldEvents["Items"].map(e => {
    eventIDLookup[e.id] = e
    return e
  })
  upcomingEvents["Items"].map(e => {
    eventIDLookup[e.id] = e
    return e
  })



  users["Items"].forEach(async function (user) {
    outputStr += "Beginning analysis for " + user.id + "\n"
    outputStr += "this person used to like: \n"
    outputStr += user.recommendedEvents.map(function (obj) {
      return "Event:" + obj.key + " becuase " + obj.value + '\n';
    });

    let tagFreq = {}
    const pastEvents = user.pastEvents;
    if (pastEvents != undefined && pastEvents.length > 0) {
      // console.log(pastEvents)
      pastEvents.forEach(id => {
        // console.log(id)
        if (eventIDLookup[String(id)] != undefined) {
          const tags = eventIDLookup[String(id)].tags
          if (tags != undefined && tags.length > 0) {
            tags.forEach(tag => {
              if (tagFreq.hasOwnProperty(tag)) {
                tagFreq[tag]++;
              } else {
                tagFreq[tag] = 1;
              }
            })
          }
        } else {
          console.log("Couldnt find " + id)
        }
      })
      let eventScores = {}
      let eventReasons = {}
      upcomingEvents["Items"].forEach(event => {
        const tags = event.tags;
        eventScores[event.id] = 0;
        if (tags != undefined && tags.length > 0) {
          tags.forEach(tag => {
            if (tagFreq.hasOwnProperty(tag)) {
              eventScores[event.id] += tagFreq[tag]
              if (eventReasons.hasOwnProperty(event.id)) {
                eventReasons[event.id].push(tag)
              } else {
                eventReasons[event.id] = []
                eventReasons[event.id].push(tag)
              }
            }
          })
        }
      })

      var temp = Object.keys(eventScores).map(function (key) {
        return { key: key, value: this[key] };
      }, eventScores);
      temp.sort(function (p1, p2) { return p2.value - p1.value; });
      const top4Scores = temp.slice(0, 4);

      // outputStr += `User: ${user.name} id: ${user.id} \n`
      // outputStr += 'Tag frequencies: \n' + JSON.stringify(tagFreq) + '\n'
      // outputStr += 'event scores: \n' + JSON.stringify(eventScores) + '\n'
      // outputStr += 'Top scores: \n' + JSON.stringify(top4Scores) + '\n'
      // outputStr += 'Reasons: \n' + JSON.stringify(eventReasons) + '\n\n\n'

      //Store the recommended events in the table
      outputStr += "now this person is going to like \n"
      let result = top4Scores.map(obj => {
        // top4Scores[id] = eventReasons[id]
        outputStr += "Event:" + obj.key + " becuase " + eventReasons[obj.key] + '\n';
        return { "key": obj.key, "value": eventReasons[obj.key] }
      })
      // const temp2 = Object.values(top4Scores)
      // console.log(temp2)
      const UpdateExpression = "set recommendedEvents = :i"
      const ExpressionAttributeValues = { ":i": result }
      await APIFuncs.update('users', user.id, UpdateExpression, ExpressionAttributeValues)
    }
  })

  console.log(outputStr)
  sendMail.sendEmail("PlatinumVolunteers@gmail.com", "Suggest Events Logs", outputStr)

}

main()
