import React, { useEffect, useState } from 'react'
import { Container, Dimmer, Loader, Segment, Tab } from 'semantic-ui-react'

import PendingEventCard from './components/PendingEventCard'
import AdminEventCard from './components/AdminEventCard'
import FeaturedEventCard from './components/FeaturedEventCard'
import APIFuncs from './APIFunctions'

const Admin = function (props) {

    const [pendingEventsState, setPendingEventsState] = useState([]);
    const [loadingOne, setLoadingOne] = useState(true);

    async function getPendingEvents() {
        let data = await APIFuncs.getNotApprovedEvents();
        setPendingEventsState(data["events"]);
        setLoadingOne(false);
        return data;
    }

    const [approvedEventsState, setApprovedEventsState] = useState([]);
    const [loadingTwo, setLoadingTwo] = useState(true);

    async function getApprovedEvents() {
        let data = await APIFuncs.getApprovedAndPublicEvents();
        setApprovedEventsState(data);
        setLoadingTwo(false);

        return data;
    }

    const [featuredEventsState, setFeaturedEventsState] = useState([]);
    const [loadingThree, setLoadingThree] = useState(true);

    async function getFeaturedEvents() {
        let data = await APIFuncs.getAllFeatured();
        console.log(data["events"]);
        setFeaturedEventsState(data["events"]);
        setLoadingThree(false);
        return data;
    }

    useEffect(() => {
        getPendingEvents();
        getApprovedEvents();
        getFeaturedEvents();
    }, [])


    const pendingEvents =
    <div>
      <h3 style={{textAlign: 'center'}}>Pending Events:</h3>
      <Segment placeholder style={loadingOne ? { border:'none', marginLeft: '7%', marginRight: '7%' }: {display: 'none'}}>
        <Dimmer active={loadingOne} inverted>
          <Loader content='Loading' />
        </Dimmer>
      </Segment>

      <div class="ui four doubling cards" id="event-container" style={{ marginLeft: '7%', marginRight: '7%' }}>
          {pendingEventsState.map((e) => <PendingEventCard class="ui attached segment" user={props.user} userData={props.userData} header={e.title} description={e.description} organizer={e.creator} date={e.date} information={e.information} suggestedDonation ={e.suggestedDonation} moneyRaisingGoal ={e.moneyRaisingGoal} amountRaisedSoFar ={e.amountRaisedSoFar} participants={e.participants} location={e.location} tags={e.tags} />)}
      </div>
    </div>

    const approvedEvents =
    <div>
      <h3 style={{textAlign: 'center'}}>Approved Events:</h3>
      <Segment placeholder style={loadingTwo ? { border:'none', marginLeft: '7%', marginRight: '7%' }: {display: 'none'}}>
        <Dimmer active={loadingTwo} inverted>
          <Loader content='Loading' />
        </Dimmer>
      </Segment>

      <div class="ui four doubling cards" id="event-container" style={{ marginLeft: '7%', marginRight: '7%' }}>
          {approvedEventsState.map((e) => <AdminEventCard user={props.user} userData={props.userData} header={e.title} description={e.description} organizer={e.creator} date={e.date} information={e.information} suggestedDonation ={e.suggestedDonation} moneyRaisingGoal ={e.moneyRaisingGoal} amountRaisedSoFar ={e.amountRaisedSoFar} participants={e.participants} location={e.location} tags={e.tags} />)}
      </div>
    </div>

    const featuredEvents =
    <div>
      <h3 style={{textAlign: 'center'}}>Featured Events:</h3>
      <Segment placeholder style={loadingThree ? { border:'none', marginLeft: '7%', marginRight: '7%' }: {display: 'none'}}>
        <Dimmer active={loadingThree} inverted>
          <Loader content='Loading' />
        </Dimmer>
      </Segment>

      <div class="ui four doubling cards" id="event-container" style={{ marginLeft: '7%', marginRight: '7%' }}>
          {featuredEventsState.map((e) => <FeaturedEventCard user={props.user} userData={props.userData} header={e.title} description={e.description} organizer={e.creator} date={e.date} information={e.information} suggestedDonation ={e.suggestedDonation} moneyRaisingGoal ={e.moneyRaisingGoal} amountRaisedSoFar ={e.amountRaisedSoFar} participants={e.participants} location={e.location} tags={e.tags} />)}
      </div>
    </div>

    const panes = [
      { menuItem: 'Pending Events', render: () => <Tab.Pane>{pendingEvents}</Tab.Pane> },
      { menuItem: 'Approved Events', render: () => <Tab.Pane>{approvedEvents}</Tab.Pane> },
      { menuItem: 'Featured Events', render: () => <Tab.Pane>{featuredEvents}</Tab.Pane> },
    ]

    const Tabs = () => <Tab panes={panes} />

    return (

        <Container style={{ padding: '0em 0em 7em' }}>
            <div style={{ padding: '3em 0em 1em' }}>
                <div class="ui text container">
                    <h1 class="ui dividing header">Admin Panel</h1>
                </div>
            </div>

            <Tabs />



        </Container>
    )

}
export default Admin
