import React from 'react'
import { Container } from 'semantic-ui-react'

const About = () => (
  <Container>
    <div style={{ padding: '3em 0em 0em'}} >
      <div class="ui text container">
        <h1 class="ui dividing header">About Us</h1>
      </div>
    </div>
    <div style={{margin: '1em 16em 3em',}}>
    <h3> We are a team of undergraduate students at Yeshiva University studying Computer Science.
    In the summer of 2021, we all signed up to spend our summer working
    on a Customer Relationship Management Website. After a lot of research, we
    decided that a website where volunteers can sign up for events was the most
    useful app we could build, and includes many of the features needed to experience what it takes to build a real application.</h3>

    <h3>Our Team:</h3>

    <h3>Arieh Chaikin - (Insert personal description here)<h5>chaikin@mail.yu.edu</h5></h3>
    <h3> Azriel Bachrach - <h5>abachrach@mail.yu.edu</h5></h3>
    <h3> Eliyahu Levy -  <h5>elevy@mail.yu.edu</h5></h3>
    <h3> Isaac Gutt - <h5>igutt@mail.yu.edu</h5></h3>
    <h3> Lawrence Snow - <h5>lsnow@mail.yu.edu</h5></h3>
    </div>

  </Container>
)

export default About
