import pic from './image.png'
import React, { useEffect, useState } from 'react'
import { Button, Container, Dimmer, Radio, Icon, Form, Loader, Modal, Segment, Search, Menu } from 'semantic-ui-react'
import EventCard from './components/EventCard'
import _ from 'lodash'
import APIFuncs from './APIFunctions'
import Geocode from './components/Geocode'


export default function Events(props) {

    const [showPastEvents, setShowPastEvents] = useState(false);
    const [eventsState, setEventsState] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tagOptions, setTagOptions] = useState([]);
    const [userLocation, setUserLocation] = useState({});

    async function getEvents() {
        let location = await getUserCoordinates().catch(x => x)
        setUserLocation(location.coords)

        let events = await APIFuncs.getApprovedAndPublicEvents();
        setEventsState(events.sort((a, b) => a.date.localeCompare(b.date)));
        setAllEvents(events);

        let pastEvents = await APIFuncs.getPastEvents();
        setPastEvents(pastEvents.sort((a, b) => a.date.localeCompare(b.date)).reverse());

        const tagSet = new Set();

        for (const event of events) {
            event.tags.map(tag => tagSet.add(tag))
            if (location.coords) {
                event.distance = await calculateDistance(location.coords, event)
            }
        }

        setTagOptions(Array.from(tagSet))
        setLoading(false);
    }

    async function getUserCoordinates() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    useEffect(() => {
        getEvents();
    }, [])

    function handleSearch(e, data) {
        const re = new RegExp(_.escapeRegExp(data.value), 'i')

        const matchedEvents = allEvents.filter(result => {
            return re.test(result.title) || re.test(result.description) || re.test(result.tags) || re.test(result.creator) || re.test(result.date)
        })

        setEventsState(matchedEvents);
    }

    return (
        <Container style={{ padding: '3em 0em 5em' }}>

            <Menu pointing>
                <Menu.Item
                    name='upcoming events'
                    active={!showPastEvents}
                    onClick={() => setShowPastEvents(false)}
                />
                <Menu.Item
                    name='past events'
                    active={showPastEvents}
                    onClick={() => setShowPastEvents(true)}
                />
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <FilterModal tagOptions={tagOptions} allEvents={allEvents} setEventsState={setEventsState} disabled={showPastEvents} active={allEvents.length !== eventsState.length} userLocation={userLocation} />
                    </Menu.Item>
                    <Menu.Item>
                        <Search
                            onSearchChange={handleSearch}
                            results={eventsState}
                            placeholder='Search...'
                        />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>

            <Segment placeholder style={loading ? { border: 'none', marginLeft: '7%', marginRight: '7%' } : { display: 'none' }}>
                <Dimmer active={loading} inverted>
                    <Loader content='Loading' />
                </Dimmer>
            </Segment>


            <div className="ui four doubling cards" id="event-container" style={{ marginLeft: '7%', marginRight: '7%', paddingTop: '1.5em' }}>
                {showPastEvents ? pastEvents.map((e) => <EventCard key={e.id} user={props.user} userData={props.userData} getUserData={props.getUserData} header={e.title} pic={pic} description={e.description} organizer={e.creator} organizerEmail={e.creatorEmail} date={e.date} information={e.information} participants={e.participants} location={e.location} tags={e.tags} />) : eventsState.map((e) => <EventCard user={props.user} userData={props.userData} getUserData={props.getUserData} header={e.title} pic={pic} description={e.description} organizer={e.creator} organizerEmail={e.creatorEmail} date={e.date} information={e.information} participants={e.participants} location={e.location} tags={e.tags} suggestedDonation ={e.suggestedDonation} moneyRaisingGoal ={e.moneyRaisingGoal} amountRaisedSoFar ={e.amountRaisedSoFar}/>)}
            </div>
        </Container>
    )
}


function FilterModal(props) {

    const [open, setOpen] = React.useState(false)
    const [tagsState, setTagsState] = React.useState({})
    const [distanceRadio, setDistanceRadio] = React.useState({ value: 'any' })
    const [sortRadio, setSortRadio] = React.useState({ value: 'date' })


    function handleFilter() {
        const selectedTags = (Object.keys(tagsState).filter(el => tagsState[el]));

        const matchedTagsEvents = props.allEvents.filter(event => {
            return selectedTags.every(e => event.tags.includes(e))
        })

        const matchedLocationEvents = matchedTagsEvents.filter(event => {
            if (distanceRadio.value === 'any') {
                return true
            }
            return event.distance <= parseInt(distanceRadio.value)
        })

        let sortedEvents;
        switch (sortRadio.value) {
            case 'alphabetical':
                sortedEvents = matchedLocationEvents.sort((a, b) => a.title.localeCompare(b.title))
                break;

            case 'date':
                sortedEvents = matchedLocationEvents.sort((a, b) => a.date.localeCompare(b.date))
                break;

            case 'distance':
                sortedEvents = matchedLocationEvents.sort((a, b) => a.distance - b.distance)
                break;
        
            default:
                break;
        }

        props.setEventsState(sortedEvents);
    }


    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button disabled={props.disabled} basic={props.active} color={props.active ? 'green' : null} icon='filter' content='Filter & Sort' style={{ background: 'none' }} />}
        >
            <Modal.Header>Filter Posts</Modal.Header>
            <Modal.Content scrolling>
                <Form>

                    <Icon name='sort amount down' />
                    <label>Sort by:</label>
                    <Segment style={{ overflow: 'auto', maxHeight: 200 }}>
                        <Form.Group grouped>
                            <Form.Field>
                                <Radio label='Date' name='sortRadioGroup' value='date' checked={sortRadio.value === 'date'} onChange={(e, { value }) => setSortRadio({ value })} />
                            </Form.Field>
                            <Form.Field>
                                <Radio label='Alphabetical' name='sortRadioGroup' value='alphabetical' checked={sortRadio.value === 'alphabetical'} onChange={(e, { value }) => setSortRadio({ value })} />
                            </Form.Field>
                            <Form.Field>
                                <Radio label='Distance  (You must allow the site to access your location for this option)' name='sortRadioGroup' value='distance' checked={sortRadio.value === 'distance'} onChange={(e, { value }) => setSortRadio({ value })} />
                            </Form.Field>
                        </Form.Group>
                    </Segment>

                    <Icon name='tags' />
                    <label>Tags</label>
                    <Segment style={{ overflow: 'auto', maxHeight: 200 }}>
                        <Form.Group grouped>
                            {props.tagOptions.map((option) => (
                                <Form.Checkbox checked={tagsState[option]} key={option} text={option} value={option} label={option} onChange={(e, { value, checked }) => setTagsState({ ...tagsState, [value]: checked })} />
                            ))}
                        </Form.Group>
                    </Segment>

                    <Icon name='map marker alternate' />
                    <label>Distance</label>
                    <p style={{fontSize: '12px', color:"grey"}}>(You must allow the site to access your location for this option)</p>
                    <Segment style={{ overflow: 'auto', maxHeight: 200 }} disabled={!props.userLocation}>
                        <Form.Group grouped>
                            <Form.Field>
                                <Radio label='Any Distance' name='radioGroup' value='any' checked={distanceRadio.value === 'any'} onChange={(e, { value }) => setDistanceRadio({ value })} />
                            </Form.Field>
                            <Form.Field>
                                <Radio label='10 Miles' name='radioGroup' value='10' checked={distanceRadio.value === '10'} onChange={(e, { value }) => setDistanceRadio({ value })} />
                            </Form.Field>
                            <Form.Field>
                                <Radio label='25 Miles' name='radioGroup' value='25' checked={distanceRadio.value === '25'} onChange={(e, { value }) => setDistanceRadio({ value })} />
                            </Form.Field>
                            <Form.Field>
                                <Radio label='50 Miles' name='radioGroup' value='50' checked={distanceRadio.value === '50'} onChange={(e, { value }) => setDistanceRadio({ value })} />
                            </Form.Field>
                            <Form.Field>
                                <Radio label='100 Miles' name='radioGroup' value='100' checked={distanceRadio.value === '100'} onChange={(e, { value }) => setDistanceRadio({ value })} />
                            </Form.Field>
                            <Form.Field>
                                <Radio label='250 Miles' name='radioGroup' value='250' checked={distanceRadio.value === '250'} onChange={(e, { value }) => setDistanceRadio({ value })} />
                            </Form.Field>
                        </Form.Group>
                    </Segment>

                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setTagsState(_.mapValues(tagsState, () => false));
                    setDistanceRadio({ value: 'any' });
                    handleFilter();
                    // setOpen(false);
                }}>
                    Clear
                </Button>
                <Button
                    content="Filter"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        handleFilter()
                        setOpen(false)
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

async function calculateDistance(userLocation, event) {
    const { latitude, longitude } = userLocation;
    const { lat, lng } = await Geocode.getGeoCode(event.location)

    const lat1 = latitude;
    const lon1 = longitude;
    const lat2 = lat;
    const lon2 = lng;

    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    return dist
}