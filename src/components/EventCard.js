import React, { useEffect, useState } from 'react'
import { Modal, Button, Image, Label } from 'semantic-ui-react'
import { Storage } from 'aws-amplify';
import DisplayCard from './DisplayCard'
import GoogleMap from './GoogleMap'
import APIFuncs from '../APIFunctions'
import Weather from './Weather'
import PaymentExample from './Payment';
import QRCode from 'qrcode.react'
import QrReader from 'react-qr-scanner'

export function EventCard(props) {

  const [open, setOpen] = React.useState(false)
  const [loadingState, setLoadingState] = React.useState(0)
  const [modalActionsState, setModalActionsState] = React.useState(0)
  const [modalContentState, setModalContentState] = React.useState(0)
  const [QRState, setQRState] = React.useState([])
  const [QR, setQR] = useState([]);
  const [scanResult, setScanResult] = useState('');
  const [checkInMap, setCheckInMap] = React.useState([]);
  const [IDMap, setIDMap] = React.useState([]);
  const [nameMap, setNameMap] = React.useState([]);


  async function handleJoinEvent() {
    console.log("handling join");
    setLoadingState(1);
    let eventId = 0;
    for (let i = 0; i < props.header.length; i++) { eventId += (5 * props.header.charCodeAt(i)) }
    await APIFuncs.joinEvent(String(props.user.username), eventId)
    await APIFuncs.checkIn(eventId, props.userData.id, "checkInJoinEvent")
    let body = `<h1>Thank you for joining ${props.header}.</h1> \n
                    <p>Here is the info:<p>\n
                    <ul>
                        <li><b>Time</b> : ${props.date}</li> \n
                        <li><b>Location</b> : ${props.location}</li> \n
                        <li><b>Organizer</b>: ${props.organizer}</li>
                    </ul>
                    <br>
                    <p>Feel free to reach out to ${props.organizer} (${props.organizerEmail}) with any questions or concerns.</p>`
    APIFuncs.sendEmail(props.userData.email, props.header, body)
    setLoadingState(2);
  }

  async function handleLeaveEvent() {
    console.log("handling leave");
    // setLoadingState(1);
    let eventId = 0;
    for (let i = 0; i < props.header.length; i++) { eventId += (5 * props.header.charCodeAt(i)) }
    await APIFuncs.leaveEvent(String(props.user.username), eventId)
    await APIFuncs.checkIn(eventId, props.userData.id, "checkInLeaveEvent")
    // setLoadingState(2);
    setOpen(false)
    console.log(props.participants)
    props.getUserData(props.userData.id)
    const indexOfParticipant = props.participants.indexOf(props.user.username);
    if (indexOfParticipant > -1) {
      props.participants.splice(indexOfParticipant, 1);
    }
    console.log(props.participants)

  }


  const [participantNames, setParticipantNames] = React.useState({});

  async function getParticipantsNames() {
    let data = await APIFuncs.getNamesFromIDs(props.participants)
    setParticipantNames(data);
  }

  const [participantPics, setParticipantPics] = React.useState({});

  async function getProfilePics() {
    for (const key in props.participants) {
      const id = (props.participants[key]);
      setParticipantPics({ ...participantPics, [id]: await Storage.get(`${id}.jpeg`) })
    }
  }

  let modalActions;
  if (!props.user) {
    modalActions = <Button color='green' disabled>You must be signed in to register for event</Button>
  } else if (props.participants.includes(props.user.username) && modalActionsState === 0) {
    modalActions = [<Button color='orange' onClick={handleQRButtonClick} content="Click for QR Ticket" />,
    <Button color='green' disabled>You are already registered for this event</Button>,
    <Button color='red' onClick={handleLeaveEvent} >Leave event</Button>]
  } else if (props.userData && props.organizer === props.userData.name && modalActionsState === 0) {
    modalActions = [<Button color='green' disabled>You are the organizer for this event</Button>,
    <Button color='orange' onClick={handleScannerButton} content="Click to scan QR codes" />]
  } else if (modalActionsState === 1) {
    modalActions = [<Button color='grey' onClick={handleBackButtonClick} content="Back" />]
  } else {
    modalActions = <Button color='green' loading={loadingState === 1} onClick={handleJoinEvent}>Volunteer for this event</Button>
  }

  function handleScannerButton() {
    setModalContentState(1)
    setModalActionsState(1)
  }

  const date = new Date(props.date);
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    // Force 12-hour
    hour12: true
  }
  const shortDateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    // Force 12-hour or 24-hour
    hour12: true
  }
  const longDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
  const shortDate = new Intl.DateTimeFormat('en-US', shortDateOptions).format(date);

  const moneyGoal = (
    <>
      <h3 style={{ marginBottom: '1px' }}>Money Raising Goal:</h3>
      <p>{props.moneyRaisingGoal}</p>

      <h3 style={{ marginBottom: '1px' }}>Suggested Donation:</h3>
      <p>{props.suggestedDonation}</p>

      <h3 style={{ marginBottom: '1px' }}>Amount Raised So far:</h3>
      <p>{props.amountRaisedSoFar}</p>

      <PaymentExample amountRaisedSoFar={props.amountRaisedSoFar} amount={props.moneyRaisingGoal} eventName={props.header} ></PaymentExample>
    </>
  )

  let modalContent;
  if (modalContentState === 0) {
    modalContent = <div> <h3 style={{ marginBottom: '1px' }}>Description:</h3>
      <p>{props.description}</p>

      <h3 style={{ marginBottom: '1px' }}>Additional Information:</h3>
      <p>{props.information}</p>

      {props.moneyRaisingGoal ? moneyGoal : <></>}

      <h3 style={{ marginBottom: '1px' }}>Location:</h3>
      <p>{props.location}</p>

      <GoogleMap address={props.location}></GoogleMap>

      <h3 style={{ marginBottom: '1px' }}>Date and time:</h3>
      <p>{longDate}</p>

      <h3 style={{ marginBottom: '3px' }}>Organizer:</h3>
      <div class="ui large labels">
        <div class="ui large image label">
          <Image src={props.pic} />
          {props.organizer}
        </div>
      </div>
      <p>Contact the orginizer at: {props.organizerEmail}</p>

      <h3 style={{ marginBottom: '3px' }}>Volunteers:</h3>
      <div class="ui large labels">
        {Object.entries(participantNames).map(e => {
          const name = e[1];
          const id = e[0];
          return (
            <div class="ui image label" style={{ marginBottom: '6px' }}>
              <Image src={participantPics[id]} />
              {name}
            </div>
          )
        })
        }
      </div>


      <h3 style={{ marginBottom: '3px' }}>Tags:</h3>
      <div>
        {props.tags ? props.tags.map(e => <Label as='a' tag content={e} style={{ marginRight: '8px' }} />) : "No tags"}
      </div>
      <h3 style={{ marginBottom: '1px' }}>Weather:</h3>
      <Weather address={props.location}></Weather>

    </div>

  } else if (props.userData && props.organizer === props.userData.name) {

    console.log("ooo")

    modalContent = <div>

      <div style={{ textAlign: 'center' }}><h1>Scan QR Codes to check volunteers in</h1>  <QrReader onScan={handleScan} legacyMode='true' /> </div>

      <div class="ui list" style={{ textAlign: 'center' }}>

        {Object.entries(participantNames).map(e => {
          const name = e[1];
          const id = e[0];
          const checkedIn = checkInMap[id]
          return (
            <div class="item">
              <div class={checkedIn ? "ui big green label" : "ui big red label"} style={{ marginBottom: '6px' }}>
                {name}
                {checkedIn}
              </div>
            </div>
          )
        })}
      </div>




    </div>

  } else if (checkInMap[props.userData.id] === true) {

    modalContent = <div>

      <div style={{ textAlign: 'center' }}><h1>You are already checked in</h1> </div>

    </div>

  } else {

    modalContent = <div style={{ textAlign: 'center' }}>
      <h1> Please check in with the Event Organizer </h1>
      <div style={{ marginTop: '20px', marginBottom: '10px' }}>
        <QRCode size='350' value={QR.toString()} />
      </div>
      <div style={{ fontSize: '20px' }}>{QR}</div>

    </div>
  }

  function handleScan(data) {
    if (data != null) {
      checkInUser(data)
      setModalContentState(0)
    }
  }

  async function checkInUser(id) {
    let eventId = 0;
    for (let i = 0; i < props.header.length; i++) { eventId += (5 * props.header.charCodeAt(i)) }
    for (var key in IDMap) {
      console.log(IDMap[key] + " : " + id.text)
      if (IDMap[key].toString() === id.text) {
        await APIFuncs.checkIn(eventId, key, "checkIn")
        console.log("checked in")
        break;
      } else {
        console.log("did not check in")
      }
    }
  }

  async function getUsersQRCode() {
    if (props.userData != null) {
      let eventId = 0;
      for (let i = 0; i < props.header.length; i++) { eventId += (5 * props.header.charCodeAt(i)) }
      let x = await APIFuncs.checkIn(eventId, props.userData.id, "getCheckIn")
      setQR(x.eventUserID);
    }
  }

  async function getAllUserEventData() {
    let eventId = 0;
    for (let i = 0; i < props.header.length; i++) { eventId += (5 * props.header.charCodeAt(i)) }
    let x = await APIFuncs.getAllCheckIn(eventId)
    setCheckInMap(x.checkInMap)
    setIDMap(x.IDMap)
  }

  useEffect(() => {
    getAllUserEventData()
  }, [])


  async function handleQRButtonClick() {
    if (props.userData != null && IDMap[props.userData.id] !== undefined) {
      setQR(IDMap[props.userData.id])
    }
    setModalContentState(1)
    setModalActionsState(1)
  }

  async function handleBackButtonClick() {
    setModalContentState(0)
    setModalActionsState(0)
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => {
        setOpen(true)
        getParticipantsNames()
        getProfilePics()
      }}
      open={open}
      trigger={
        <div class="card" as={Button}>
          <DisplayCard header={props.header} date={shortDate} pic={props.pic} description={props.description} name={props.organizer} icon={props.icon} />
        </div>
      }>
      <Modal.Header>
        <h1 style={{ textAlign: 'center', margin: '0px 0px 0px 0px' }}>{props.header}</h1>
        <h3 style={{ textAlign: 'center', margin: '0px 0px 0px 0px', color: 'grey' }}>{longDate}</h3>
      </Modal.Header>
      <Modal.Content>
        {modalContent}
      </Modal.Content>
      <Modal.Actions>
        {modalActions}
      </Modal.Actions>
    </Modal>
  )
}

export default EventCard;
