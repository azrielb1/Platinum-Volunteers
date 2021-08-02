import React, { useEffect, useState, } from 'react'
import HomepageLayout from './Homepage'
import Profile from './Profile';
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar, Footer } from './Navigation'
import About from './About'
import Events from './Events'
import Admin from './Admin'
import { PostEvent } from './PostEvent'
import { Hub, Auth } from 'aws-amplify';
import APIFuncs from './APIFunctions'
import ProfileSettings from './ProfileSettings';


export default function App() {

    const [currentUser, setCurrentUser] = useState();
    const [currentUserData, setCurrentUserData] = useState();

    useEffect(() => {
        Hub.listen('auth', (data) => {
            const { payload } = data;
            if (payload.event === "signIn") {
                setCurrentUser(payload.data);
                getUserData(payload.data.username);
            }
        })
    })

    async function getUserData(userID) {
        console.log("getting User data")
        let data = await APIFuncs.read("users", userID)
        setCurrentUserData(data["Item"]);
    }

    async function handleSignOut() {
        try {
            await Auth.signOut();
            setCurrentUser(() => null)
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    return (
        <Router>
            <NavigationBar user={currentUser} userData={currentUserData} handleSignOut={handleSignOut} />
            <Switch>
                <Route path="/" exact component={HomepageLayout} />
                <Route path="/profile" exact render={() => <Profile user={currentUser} userData={currentUserData} getUserData={getUserData} />} />
                <Route path="/profile/settings" exact render={() => <ProfileSettings user={currentUser} userData={currentUserData} getUserData={getUserData} />} />
                <Route path="/events" exact render={() => <Events user={currentUser} userData={currentUserData}  getUserData={getUserData} />} />
                <Route path="/about" exact component={About} />
                <Route path="/postevent" exact render={() => <PostEvent user={currentUser} />} />
                <Route path="/admin" exact render={() => <Admin user={currentUser} userData={currentUserData} />} />
                <Route render={() => <h1 style={{ margin: '1em 1em 15em' }}>404: page not found</h1>} />
            </Switch>
            <Footer />
        </Router>
    )
}
