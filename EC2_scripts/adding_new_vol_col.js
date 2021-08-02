const APIFuncs = require('./APIHelperFunctions')


async function main() {
  const events = await APIFuncs.list("events")
  events["Items"].forEach(async function (event) {

    var map1 = { }
    var map2 = { }

    event.participants.forEach(function (participant) {
      map1[participant] = false
      map2[participant] = getNumber(participant) * event.id - 613
    })

    let ue = "set checkIn = :i"
    let eav = { ":i": map1 }
    let res = await APIFuncs.update('events', event.id , ue, eav)

    let ue2 = "set participantIDs = :i"
    let eav2 = { ":i": map2 }
    let res2 = await APIFuncs.update('events', event.id , ue2, eav2)


  })
  console.log(getNumber(1))
  console.log(getNumber(3))
}

main()

function getNumber(string) {
  if (isNaN(Number(string))) {
    var hash = 0, i, chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
      chr   = string.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  } else {
    return Number(string)
  }
}
