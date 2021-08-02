/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Segment,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import picture1 from './homepageimage.jpg'
import EventCard from './components/EventCard'
import APIFuncs from './APIFunctions'


/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      content='Welcome to Platinum Volunteers'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        //fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='The easy way to find volunteers.'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Button as={Link} to='/login' primary size='huge'>
      Get Started
      <Icon name='right arrow' />
    </Button>
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

const HomepageLayout = function(props) {

  const [featuredEventsState, setFeaturedEventsState] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getFeaturedEvents() {
      let data = await APIFuncs.getAllFeatured();
      setFeaturedEventsState(data["events"]);
      setLoading(false);
      return data;
  }

  useEffect(() => {
    getFeaturedEvents();
  }, [])


  return (
  <Container style={{ margin: '0' }}>
    <Segment
      textAlign='center'
      style={{ minHeight: 700, padding: '1em 0em', width: '100%',  backgroundImage: `url("https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/129325364/original/afaddcb9d7dfaaf5bff7ef04101935814665ac16/design-an-attractive-background-for-your-website.png")`}}
      vertical
    >
      <HomepageHeading />
    </Segment>
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              We Help Connect Event Organizers With Volunteers
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              We can help you find volunteers for any event you or your organization are running.
              Let us make your next event possible.
            </p>
            <Header as='h3' style={{ fontSize: '2em' }}>
              We Provide a Place to Find Upcoming Events
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              If you are looking to make a impact but aren’t sure how you can help, look no further than this website where you can find upcoming volunteer opportunities and easily sign up.
            </p>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <Image bordered rounded size='large' src={picture1} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center' >
            <Button size='huge' as={Link} to='/events'>View Events</Button>
            <Button size='huge' as={Link} to='/postevent'>Post an Event</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment vertical style={{ padding: '5em 3em' }}>
      <Header as='h3' style={{ fontSize: '2em' }}>
        Featured Events
      </Header>

      <div>

      <Segment placeholder style={loading ? { border:'none', marginLeft: '7%', marginRight: '7%' }: {display: 'none'}}>
        <Dimmer active={loading} inverted>
          <Loader content='Loading' />
        </Dimmer>
      </Segment>

      <div className="ui four doubling cards" id="event-container" style={{marginRight: '7%' }}>
          {featuredEventsState.map((e) => <EventCard key={e.id} user={props.user} userData={props.userData} header={e.title} description={e.description} organizer={e.creator} date={e.date} information={e.information} participants={e.participants} location={e.location} tags={e.tags} />)}
      </div>

      </div>

    </Segment>
  </Container>
)
}

export default HomepageLayout
