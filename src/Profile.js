/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import pic from './image.png'
import React, { useEffect, useState } from 'react'
import {
    Button,
    Container,
    Dimmer,
    Grid,
    Image,
    List,
    Segment,
    Table
} from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { Storage } from 'aws-amplify';
import EventCard from './components/EventCard'
import APIFuncs from './APIFunctions'

export default function Profile(props) {

    const [eventsState, setEventsState] = useState([]);
    const [suggestedEventsState, setSuggestedEventsState] = useState([]);
    const [recommendationReasonsState, setSrecommendationReasonsState] = useState([]);
    const [pastEventsState, setPastEventsState] = useState([]);
    async function getEvents() {

        let data = await APIFuncs.getEventsAndUser(String(props.user.username))
        let allPastEvents = await APIFuncs.list('OldEvents')
        let usersEventIDs = data.user.Item.upcomingEvents
        let allEvents = data.event.Items
        let recommendedEventsId = props.userData.recommendedEvents.map(obj => {
            return obj.key
        })
        let recommendationReasons = new Set()
         props.userData.recommendedEvents.map(obj => {
             recommendationReasons.add(...obj.value)
            return obj
        })
        // console.log(recommendationReasons)
        let recommendedEvents = []

        let events = []
        // console.log(recommendedEventsId)
        allEvents.forEach(e => {
            if (usersEventIDs.includes(e.id)) {
                events.push(e)
            }
            // console.log(e.id)
            if (props.userData.recommendedEvents !== undefined && recommendedEventsId.includes(String(e.id))) {
                recommendedEvents.push(e)
            }

        })
        let pastEvents = []
        allPastEvents["Items"].forEach(e => {
            if (props.userData.pastEvents !== undefined && props.userData.pastEvents.includes(e.id)) {
                // console.log(e)
                pastEvents.push(e)
            }
        })

        setEventsState(events)
        setPastEventsState(pastEvents)
        setSrecommendationReasonsState(Array.from(recommendationReasons))
        setSuggestedEventsState(recommendedEvents)

    }

    useEffect(() => {
        getEvents();
    }, [])

    if (props.user) {
        return (
            <Container>
                <div style={{ padding: '3em 0em 1em' }} >

                    <div class="ui text container">
                        <h1 class="ui dividing header">Profile</h1>
                        <Button as={Link} to='/profile/settings' floated='right' circular icon='setting' />
                    </div>

                    <Grid columns={3} style={{ padding: '2em' }}>
                        <Grid.Row>

                            <Grid.Column width={'6'}>

                                <div style={{ float: 'right' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <h2 style={{ margin: '0 0 1em' }}>{props.user.attributes.name + ' ' + props.user.attributes.family_name}</h2>
                                    </div>
                                    <Avatar user={props.user} />
                                </div>

                            </Grid.Column>

                            <Grid.Column width={'7'}>

                                <Table definition>
                                    <Table.Row>
                                        <Table.Cell width={2}>Email</Table.Cell>
                                        <Table.Cell>{props.user.attributes.email}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell width={2}>Phone Number</Table.Cell>
                                        <Table.Cell>{props.userData.phone}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell width={2}>Birthday</Table.Cell>
                                        <Table.Cell>{props.user.attributes.birthdate}</Table.Cell>
                                    </Table.Row>
                                </Table>
                                <p style={{ margin: '2em 0em 0em' }}> Tell us about yourself! </p>
                                <Segment style={{ margin: '0em 0em 0em' }}> {props.userData.bio} </Segment>
                            </Grid.Column>

                        </Grid.Row>
                    </Grid>
                </div>

                <div style={{ padding: '2em 0em 1em' }}>
                    <div class="ui text container">
                        <h1 class="ui dividing header">Upcoming Events</h1>
                    </div>
                </div>

                <Container style={{ padding: '2em' }}>

                    <div class="ui four doubling cards" id="event-container" style={{ marginLeft: '7%', marginRight: '7%' }}>
                        {eventsState.map((e) => <EventCard user={props.user} userData={props.userData} getUserData={props.getUserData} header={e.title} pic={pic} description={e.description} organizer={e.creator} date={e.date} information={e.information} participants={e.participants} location={e.location} tags={e.tags} />)}
                    </div>

                </Container>

                <div class="ui text container">
                    <h1 class="ui dividing header">Suggested Events:</h1>
                    <p >Since you liked {recommendationReasonsState.map(reason =>"\"" + reason + "\" ")}</p>
                </div>

                <Container style={{ padding: '2em' }}>

                    <div class="ui four doubling cards" id="event-container" style={{ marginLeft: '7%', marginRight: '7%' }}>
                        {suggestedEventsState.map((e) => <EventCard user={props.user} userData={props.userData} getUserData={props.getUserData} header={e.title} pic={pic} description={e.description} organizer={e.creator} date={e.date} information={e.information} participants={e.participants} location={e.location} tags={e.tags} />)}
                    </div>

                </Container>


                <div class="ui text container">
                    <h1 class="ui dividing header">History</h1>
                </div>

                <Grid columns={3} style={{ padding: '0em 0em 3em' }}>
                    <Grid.Row>
                        <Grid.Column width={'4'} />
                        <List divided relaxed>
                            {
                                // console.log(pastEventsState)
                                pastEventsState.map(e => {
                                    return (
                                        <List.Item >
                                            <List.Icon name='book' size='large' verticalAlign='middle' />
                                            <List.Content >
                                                <List.Header as='a'>{e.title}  {e.date}</List.Header>
                                                <List.Description as='a'>{e.description}</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    )
                                })
                            }
                        </List>
                    </Grid.Row>
                </Grid>

            </Container>
        )
    } else {
        return (
            <div> <h1 style={{ textAlign: 'center', margin: '2em 0 2em' }}>Login to view your profile.</h1> </div>
        )
    }
}

function Avatar(props) {

    const [avatar, setAvatar] = useState();
    const [active, setActive] = useState(false);

    async function getAvatar() {
        try {
            setAvatar(await Storage.get(`${props.user.username}.jpeg`));
        } catch (error) {
            console.log('error getting avatar:', error);
        }
    }

    getAvatar()

    async function handleChooseAvatar(e) {
        try {
            await Storage.put(`${props.user.username}.jpeg`, e.target.files[0]);
            getAvatar()
        } catch (error) {
            console.log('error uploading:', error);
        }
    }

    const handleShow = () => setActive(() => true)
    const handleHide = () => setActive(() => false)

    const hiddenFileInput = React.useRef(null);

    return (
        <Dimmer.Dimmable
            dimmed={active}
            onMouseEnter={handleShow}
            onMouseLeave={handleHide}
            style={{ width: 200, height: 200, minWidth: 200, minHeight: 200 }}
            circular
        >
            <Dimmer active={active} inverted>
                <div>
                    <Button circular size='massive' style={{ backgroundColor: 'Transparent' }} icon='camera' onClick={event => hiddenFileInput.current.click()} />
                    <input type='file' accept="image/jpeg" ref={hiddenFileInput} style={{ display: 'none' }} onChange={handleChooseAvatar} />
                </div>
            </Dimmer>
            <Image src={avatar} style={{ objectFit: 'cover', width: 200, height: 200, minWidth: 200, minHeight: 200 }} avatar />
        </Dimmer.Dimmable>
    )
}
