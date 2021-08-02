import React from 'react'
import { Modal, Button, Image, Label } from 'semantic-ui-react'
import { Storage } from 'aws-amplify';
import DisplayCard from './DisplayCard'
import GoogleMap from './GoogleMap'
import APIFuncs from '../APIFunctions'

export function AdminEventCard(props) {

    const [open, setOpen] = React.useState(false)
    const [loadingState, setLoadingState] = React.useState(0)

    async function handleRemove() {
        let eventid = 0;
        for (let i = 0; i < props.header.length; i++) { eventid += (5 * props.header.charCodeAt(i)) }
        let res = await APIFuncs.delete("events", eventid)

        setLoadingState(2);
    }

    async function handleSetFeatured() {
        let eventid = 0;
        for (let i = 0; i < props.header.length; i++) { eventid += (5 * props.header.charCodeAt(i)) }
        let res = await APIFuncs.setFeatured(eventid)

        setLoadingState(3);
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
        console.log(participantPics)
    }

    let modalActions;

    if (loadingState === 2) {
        modalActions = <Button color='red' content='You have removed this event' disabled />

    } else if (loadingState === 3) {
        modalActions =
            <div class="two ui buttons">
                <Button color='blue' content='This Event is featured' disabled />
                <Button color='red' onClick={handleRemove} loading={loadingState === 1} >Remove Event</Button>
            </div>

    } else {
        modalActions =
            <div class="two ui buttons">
                <Button color='blue' onClick={handleSetFeatured} loading={loadingState === 1} >Set as Featured Event</Button>
                <Button color='red' onClick={handleRemove} loading={loadingState === 1} >Remove Event</Button>
            </div>

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


                <h3 style={{ marginBottom: '1px' }}>Location:</h3>
                <p>{props.location}</p>

                <GoogleMap address={props.location}></GoogleMap>


                <h3 style={{ marginBottom: '1px' }}>Date and time:</h3>
                <p>{props.date}</p>

                <h3 style={{ marginBottom: '3px' }}>Organizer:</h3>
                <div class="ui large labels">
                    <div class="ui large image label">
                        <Image src={props.pic} />
                        {props.organizer}
                    </div>
                </div>

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

            </Modal.Content>
            <Modal.Actions>
                {modalActions}
            </Modal.Actions>
        </Modal>
    )
}

export default AdminEventCard;
