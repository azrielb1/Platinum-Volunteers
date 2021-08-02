import React from 'react'
import { Modal, Button, Image, Label } from 'semantic-ui-react'
import DisplayCard from './DisplayCard'
import pic from '../image.png'
import GoogleMap from './GoogleMap'
import APIFuncs from '../APIFunctions'
import PaymentExample from './Payment';

export default function PendingEventCard(props) {
    console.log(props)
    console.log(props.amountRaisedSoFar)
    const [open, setOpen] = React.useState(false)
    const [loadingState, setLoadingState] = React.useState(0)

    async function handleApproveClick() {
        let eventid = 0;
        for (let i = 0; i < props.header.length; i++) { eventid += (5 * props.header.charCodeAt(i)) }
        let res = await APIFuncs.approveEvent(eventid)

        setLoadingState(3);

    }

    async function handleDenyClick() {
        let eventid = 0;
        for (let i = 0; i < props.header.length; i++) { eventid += (5 * props.header.charCodeAt(i)) }
        let res = await APIFuncs.delete("events", eventid)

        setLoadingState(2);
    }

    let modalActions;
    if (loadingState === 2) {
        modalActions = <Button color='red' content='You have denied this event' disabled />
    } else if (loadingState === 3) {
        modalActions = <Button color='green' icon='check' content='You have approved this event' disabled />
    } else {
        modalActions = <div class="two ui buttons">
            <Button color='green' onClick={handleApproveClick}>Approve</Button>
            <div class="or"></div>
            <Button color='red' onClick={handleDenyClick}>Deny</Button>
        </div>
    }
    
    return (
      <Modal
          onClose={() => setOpen(false)}
          onOpen={() => {
              setOpen(true)

          }}
          open={open}
          trigger={
              <div class="card" as={Button}>
                  <DisplayCard header={props.header} date={props.date} pic={props.pic} description={props.description} name={props.organizer} icon={props.icon} />
              </div>
          }>
          <Modal.Header>
              <h1 style={{ textAlign: 'center', margin: '0px 0px 0px 0px' }}>{props.header}</h1>
              <h3 style={{ textAlign: 'center', margin: '0px 0px 0px 0px', color: 'grey' }}>{props.date}</h3>
          </Modal.Header>
          <Modal.Content>

              <h3 style={{ marginBottom: '1px' }}>Description:</h3>
              <p>{props.description}</p>

              <h3 style={{ marginBottom: '1px' }}>Additional Information:</h3>
              <p>{props.information}</p>

              <h3 style={{ marginBottom: '1px' }}>Money Raising Goal:</h3>
              <p>{props.moneyRaisingGoal}</p>

              <h3 style={{ marginBottom: '1px' }}>Suggested Donation:</h3>
              <p>{props.suggestedDonation}</p>

              <h3 style={{ marginBottom: '1px' }}>Amount Raised So far:</h3>
                <p>{props.amountRaisedSoFar}</p>

                
              <PaymentExample amountRaisedSoFar={props.amountRaisedSoFar} amount={props.moneyRaisingGoal} eventName={props.header} ></PaymentExample>
              

              <h3 style={{ marginBottom: '1px' }}>Location:</h3>
              <p>{props.location}</p>

              <GoogleMap address={props.location}></GoogleMap>

              <h3 style={{ marginBottom: '1px' }}>Date and time:</h3>
              <p>{props.date}</p>

              <h3 style={{ marginBottom: '3px' }}>Organizer:</h3>
              <div class="ui large labels">
                  <div class="ui large image label">
                      <Image src={pic} />
                      {props.organizer}
                  </div>
              </div>


              <h3 style={{ marginBottom: '3px' }}>Tags:</h3>
              <div>
                  {props.tags ? props.tags.map(e => <Label as='a' tag content={e} style={{ marginRight: '8px' }} />) : "No tags"}
              </div>

          </Modal.Content>
          <Modal.Actions>
              {modalActions}
          </Modal.Actions>
      </Modal>
    )
}
