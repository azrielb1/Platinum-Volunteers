/*

Helper functions for the API


*/

// var request = require('request');
var axios = require('axios');

let lib = {}


/*
table is either "events" for the events table or "users" for users table
the dataObj is a mapping of key value pairs corrosponding to the columns of the requested table
*/
lib.create = async function (table, dataObj) {
    let TableName = table === "events" ? "Events_api-lambda-db" : "User_tablev2"
    TableName = table === "old-events" ? "OldEvents" : TableName;
    var data = JSON.stringify({
        "operation": "create",
        "payload": {
            "TableName": TableName,
            "Item": dataObj
        }
    });

    var config = {
        method: 'post',
        url: 'https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events',
        headers: {
            'Authorization': 'Bearer vOTmyqFA9uAH8qshUe7vzt1SEtf3',
            'Content-Type': 'application/json'
        },
        data: data
    };

    let res = await axios(config)
        .then(function (response) {
            // console.log(JSON.stringify(response.data));
            return response.data
        })
        .catch(function (error) {
            console.log(error);
        });

    return res

}


lib.read = async function (table, id) {
    let TableName = table === "events" ? "Events_api-lambda-db" : "User_tablev2"
    TableName = table === "old-events" ? "OldEvents" : TableName;
    var data = JSON.stringify({
        "operation": "read",
        "payload": {
            "TableName": TableName,
            "Key": {
                "id": id
            }
        }
    });

    var config = {
        method: 'post',
        url: 'https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events',
        headers: {
            'Authorization': 'Bearer vOTmyqFA9uAH8qshUe7vzt1SEtf3',
            'Content-Type': 'application/json'
        },
        data: data
    };

    let res = await axios(config)
        .then(function (response) {
            // console.log(JSON.stringify(response.data));
            return response.data
        })
        .catch(function (error) {
            console.log(error);
        });

    return res
}

lib.update = async function (table, id, UpdateExpression, ExpressionAttributeValues) {
    let TableName;
    if (table === "events") {
        TableName = "Events_api-lambda-db"
    } else if (table === 'users') {
        TableName = "User_tablev2"
    } else if (table === 'OldEvents') {
        TableName = "OldEvents"
    } else {
        return "no such table"
    }
    let obj = {
        "operation": "update",
        "payload": {
            "TableName": TableName,
            "Key": {
                "id": id
            },
            "UpdateExpression": UpdateExpression,
            "return-values": "ALL_NEW"
        }
    }
    if (ExpressionAttributeValues != undefined) {
        obj.payload["ExpressionAttributeValues"] =  ExpressionAttributeValues
    }
    var data = JSON.stringify(obj);
    var config = {
        method: 'post',
        url: 'https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events',
        headers: {
            'Authorization': 'Bearer vOTmyqFA9uAH8qshUe7vzt1SEtf3',
            'Content-Type': 'application/json'
        },
        data: data
    };
    let res = await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            return JSON.stringify(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });

    return res
}

lib.delete = async function (table, id) {
    let TableName = table === "events" ? "Events_api-lambda-db" : "User_tablev2"
    TableName = table === "old-events" ? "OldEvents" : TableName;
    var data = JSON.stringify({
        "operation": "delete",
        "payload": {
            "TableName": TableName,
            "Key": {
                "id": id
            }
        }
    });

    var config = {
        method: 'post',
        url: 'https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events',
        headers: {
            'Authorization': 'Bearer vOTmyqFA9uAH8qshUe7vzt1SEtf3',
            'Content-Type': 'application/json'
        },
        data: data
    };

    let res = await axios(config)
        .then(function (response) {
            // console.log(JSON.stringify(response.data));
            return response.data
        })
        .catch(function (error) {
            console.log(error);
        });

    return res





}

lib.list = async function (table) {
    let TableName;
    if (table === "events") {
        TableName = "Events_api-lambda-db"
    } else if (table === 'users') {
        TableName = "User_tablev2"
    } else if (table === 'OldEvents') {
        TableName = "OldEvents"
    } else {
        return "no such table"
    }
    // let TableName = table === "events" ? "Events_api-lambda-db" : "User_tablev2"
    // TableName = table === "User_tablev2" ? "User_tablev2" : "OldEvents"

    var data = JSON.stringify({ "operation": "list", "payload": { "TableName": TableName } });

    var config = {
        method: 'post',
        url: 'https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events',
        headers: {
            'Authorization': 'Bearer vOTmyqFA9uAH8qshUe7vzt1SEtf3',
            'Content-Type': 'application/json'
        },
        data: data
    };

    let res = await axios(config)
        .then(function (response) {
            // console.log(JSON.stringify(response.data));
            return JSON.parse(JSON.stringify(response.data))
        })
        .catch(function (error) {
            console.log(error);
        });

    return res


}



lib.getEventsAndUser = async function (userID) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "operation": "eventsuser",
        "payload": {
            "TableName": "User_tablev2",
            "Key": {
                "id": userID
            }
        },
        "userpayload": {
            "TableName": "User_tablev2",
            "Key": {
                "id": userID
            }
        },
        "eventpayload": {
            "TableName": "Events_api-lambda-db"
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/users", requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        return error;
    }
}

lib.joinEvent = async function (userID, eventID) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "operation": "joinEvent",
        "payload": {
            "TableName": "User_tablev2",
            "Key": {
                "id": userID
            }
        },
        "userpayload": {
            "TableName": "User_tablev2",
            "Key": {
                "id": userID
            },
            "UpdateExpression": "set upcomingEvents = list_append(upcomingEvents, :i)",
            "ExpressionAttributeValues": {
                ":i": [
                    eventID
                ]
            }
        },
        "eventpayload": {
            "TableName": "Events_api-lambda-db",
            "Key": {
                "id": eventID
            },
            "UpdateExpression": "set participants = list_append(participants, :i)",
            "ExpressionAttributeValues": {
                ":i": [
                    userID
                ]
            }
        }
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/users", requestOptions);
        const result = await response.text();
        return result;
    } catch (error) {
        return error;
    }
}

lib.leaveEvent = async function (userID, eventID) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "operation": "leaveEvent",
        "payload": {
            "TableName": "Events_api-lambda-db"
        },
        "userID": userID,
        "eventID": eventID,
        "eventpayload": {
            "Key": {
                "id": eventID
            }
        },
        "userpayload": {
            "Key": {
                "id": userID
            }
        }
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/users", requestOptions);
        const result = await response.text();
        return result;
    } catch (error) {
        return error;
    }
}

lib.getApprovedAndPublicEvents = async function () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "operation": "getApprovedEvents",
        "payload": {
            "TableName": "Events_api-lambda-db",
        }
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events", requestOptions);
        const result = await response.json();
        return result.events;
    } catch (error) {
        return error;
    }
}

lib.getNotApprovedEvents = async function () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "operation": "getNotApprovedEvents",
        "payload": {
            "TableName": "Events_api-lambda-db",
        }
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events", requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        return error;
    }
}

lib.approveEvent = async function (eventID) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "operation": "approveEvent",
        "payload": {
            "TableName": "Events_api-lambda-db",
            "Key": {
                "id": eventID
            }
        }
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events", requestOptions);
        const result = await response.text();
        return result;
    } catch (error) {
        return error;
    }
}


lib.getNamesFromIDs = async function (ids) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "operation": "getNames",
        "payload": {
            "TableName": "User_tablev2",
            "ids": ids
        }
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/users", requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        return error;
    }

}

lib.setFeatured = async function (eventID) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "operation": "setFeatured",
        "payload": {
            "TableName": "Events_api-lambda-db",
            "Key": {
                "id": eventID
            }
        }
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events", requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        return error;
    }
}

lib.setNotFeatured = async function (eventID) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "operation": "setNotFeatured",
        "payload": {
            "TableName": "Events_api-lambda-db",
            "Key": {
                "id": eventID
            }
        }
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events", requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        return error;
    }
}

lib.getAllFeatured = async function () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "operation": "getAllFeatured",
        "payload": {

        }
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events", requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        return error;
    }
}

lib.sendEmail = async function (toEmail, subject, body) {
    console.log(toEmail)
    var data = JSON.stringify({ 
        "operation": "sendEmail", 
        "payload": { 
            "toAddress": toEmail.toLowerCase(),
            "subject": subject, 
            "body":body 
        } 
    });

    var config = {
        method: 'post',
        url: 'https://540mdzfzne.execute-api.us-east-1.amazonaws.com/dev/events',
        headers: {
            'Authorization': 'Bearer vOTmyqFA9uAH8qshUe7vzt1SEtf3',
            'Content-Type': 'application/json'
        },
        data: data
    };

    let res = await axios(config)
        .then(function (response) {
            // console.log(JSON.stringify(response.data));
            return JSON.parse(JSON.stringify(response.data))
        })
        .catch(function (error) {
            console.log(error);
        });

    return res


}

// export lib

// export default lib
module.exports = lib

