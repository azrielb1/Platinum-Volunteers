import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom';
import {
    Container,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
    Visibility,
} from 'semantic-ui-react'
import { LoginModal, SignUpModal } from './login';
import { Storage } from 'aws-amplify';
import { useLocation } from 'react-router-dom';


export function NavigationBar(props) {

    let location = useLocation();

    const [fixed, setFixed] = useState();
    const showFixedMenu = () => setFixed(() => true)
    const hideFixedMenu = () => setFixed(() => false)

    const [avatar, setAvatar] = useState();
    async function getAvatar() {
        setAvatar(await Storage.get(`${props.user.username}.jpeg`));
    }
    const trigger = (
        <Image avatar src={avatar} style={location.pathname === '/profile' ? { objectFit: 'cover', padding: '2px', border: `2px solid ${fixed ? 'grey' : 'white'}` } : { objectFit: 'cover' }} />
    )

    let rightMenu;
    if (props.user) {
        getAvatar();
        let name = props.user.attributes.name + ' ' + props.user.attributes.family_name;

        rightMenu = <Menu.Item position='right'>
            <Dropdown trigger={trigger} pointing='top right' icon={null}>
                <Dropdown.Menu>
                    <Dropdown.Header content={name} />
                    <Dropdown.Divider />
                    <Dropdown.Item icon='user' text='Profile' as={Link} to='/profile' />
                    <Dropdown.Item icon='settings' text='Settings' as={Link} to='/profile/settings' />
                    <Dropdown.Item icon='sign out' text='Sign Out' as={Link} to='/' onClick={props.handleSignOut} />
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Item>

    } else {
        rightMenu = <Menu.Item position='right'>
            <LoginModal inverted={!fixed} />
            <SignUpModal user={props.user} inverted={!fixed} style={{ marginLeft: '0.5em' }} />
        </Menu.Item>
    }

    return (
        <Visibility
            once={false}
            onBottomPassed={showFixedMenu}
            onBottomPassedReverse={hideFixedMenu}
        >
            <Segment
                inverted
                textAlign='center'
                style={{ minHeight: 0, padding: '1em 0em' }}
                vertical
            >
                <Menu
                    fixed={fixed ? 'top' : null}
                    inverted={!fixed}
                    pointing={!fixed}
                    secondary={!fixed}
                    size='large'
                >
                    <Container>
                        <Menu.Item as={Link} to='/' active={location.pathname === '/'}>
                            Home
                        </Menu.Item>
                        <Menu.Item as={Link} to='/events' active={location.pathname === '/events'}>View Events</Menu.Item>
                        <Menu.Item as={Link} to='/postevent' active={location.pathname === '/postevent'}>Post an Event</Menu.Item>
                        <Menu.Item as={Link} to='/about' active={location.pathname === '/about'}>About Us</Menu.Item>
                        {rightMenu}
                    </Container>
                </Menu>
            </Segment>
        </Visibility>
    )
}


export class Footer extends Component {
    render() {
        return (
            <Segment inverted vertical style={{ padding: '5em 0em' }}>
                <Container>
                    <Grid divided inverted stackable>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='About' />
                                <List link inverted>
                                    <List.Item as={Link} to='/about'>Contact Us</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                <Header as='h4' inverted>
                                    Footer
                                </Header>
                                <p>
                                    © 2021, Platinum Volunteers Inc. No Rights Reserved.
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        )
    }
}
