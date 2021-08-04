import { Auth } from 'aws-amplify';
import React, { useState } from 'react'
import { Button, Form, Header, Message, Modal } from 'semantic-ui-react'
import APIFuncs from './APIFunctions.js'

export function LoginModal(props) {
    const [open, setOpen] = React.useState(false)

    const [loginError, updateLoginError] = useState(false)

    const [formState, updateFormState] = useState({
        email: '',
        password: ''
    })

    function onchange(e) {
        e.persist()
        updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
    }

    async function handleLogin() {
        const { email, password } = formState
        try {
            const user = await Auth.signIn(email, password);
            updateLoginError(() => false)
            console.log(user);
            setOpen(false);
        } catch (error) {
            updateLoginError(() => true)
            console.log('error signing in', error);
        }
    }

    let errorMessage;
    if (loginError) {
        errorMessage = <Message
            error
            header='Action Forbidden'
            content='Incorrect email address or password'
        />
    } else {
        errorMessage = null;
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button inverted={props.inverted}>Log In</Button>}
        >
            <Modal.Header>Log In</Modal.Header>
            <Modal.Content>

                <Form error style={{ maxWidth: "20em", margin: '25px auto 25px', }}>
                    {errorMessage}
                    <Form.Field>
                        <label>Email Address</label>
                        <input name='email' placeholder='Email Address' type="email" onChange={onchange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input name='password' placeholder='Password' type='password' onChange={onchange} />
                    </Form.Field>
                    <ForgotPasswordModal />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button basic onClick={() => setOpen(false)}>Don't have an account? Click Here</Button>
                <Button color='black' onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button
                    content="Log In"
                    type='submit'
                    labelPosition='right'
                    icon='checkmark'
                    onClick={handleLogin}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

export function SignUpModal(props) {
    const [open, setOpen] = React.useState(false)
    const [showConfirmation, setShowConfirmation] = React.useState(false)

    const [formState, updateFormState] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        gender: 'other',
        birthdate: '',
        confirmationCode: ''
    })

    function onchange(e) {
        e.persist()
        updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
    }

    async function handleSignUp() {
        const { email, password, firstname, lastname, gender, birthdate } = formState
        const username = email
        const family_name = lastname
        const name = firstname
        try {
            const { user } = await Auth.signUp({
                username,
                password,
                attributes: {
                    birthdate,
                    email,
                    name,
                    family_name,
                    gender
                }
            });
            console.log(user);
            setShowConfirmation(true);
        } catch (error) {
            console.log('error signing up:', error);
        }
    }

    async function handleConfirmation() {
        const { email, password, confirmationCode } = formState
        try {
            await Auth.confirmSignUp(email, confirmationCode);
            setOpen(false);
            setShowConfirmation(false);
            const user = await Auth.signIn(email, password);
            createUserInDatabase(user.username, `${user.attributes.name} ${user.attributes.family_name}`, user.attributes.email);
        } catch (error) {
            console.log('error confirming sign up', error);
        }
    }

    async function createUserInDatabase(username, name, email) {
        let res = await APIFuncs.create("users", {
            "id": username,
            "name": name,
            "email": email,
            "upcomingEvents": [],
            "pastEvents" : [],
            "bio" : ""
        })
    }

    const signUpForm = (
        <>
            <Modal.Content>
                <Form style={{ maxWidth: "20em", margin: '25px auto 25px' }}>
                    <Form.Input fluid label='First name' placeholder='First name' onChange={onchange} name='firstname' />
                    <Form.Input fluid label='Last name' placeholder='Last name' onChange={onchange} name='lastname' />
                    <Form.Input fluid label='Email address' placeholder='Email address' type="email" onChange={onchange} name='email' />
                    <Form.Input fluid label='Birthday' placeholder='MM/DD/YYYY' onChange={onchange} type="date" name='birthdate' />
                    {/* <Form.Select
                    fluid
                    label='Gender'
                    options={[
                        { key: 'm', text: 'Male', value: 'male' },
                        { key: 'f', text: 'Female', value: 'female' },
                        { key: 'o', text: 'Other', value: 'other' },
                    ]}
                    placeholder='Gender'
                    name='gender'
                    /> */}
                    <Form.Input label='Create Password' placeholder='Password' type='password' onChange={onchange} name='password' />
                    <Form.Checkbox label='I agree to the Terms and Conditions' />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button basic onClick={() => setOpen(false)}>Already have an account? Log In</Button>
                
                
                <Button color='black' onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button
                    content="Submit"
                    type='submit'
                    labelPosition='right'
                    icon='checkmark'
                    onClick={handleSignUp}
                    positive
                />
            </Modal.Actions>
        </>
    )

    const confirmation = (
        <>
            <Form style={{ maxWidth: "20em", margin: '25px auto 25px' }}>
                <Form.Input fluid label='Enter Confirmation Code' placeholder='####' onChange={onchange} name='confirmationCode' />
            </Form>
            <Modal.Actions>
                <Button
                    content="Confirm Account"
                    type='submit'
                    labelPosition='right'
                    icon='checkmark'
                    onClick={handleConfirmation}
                    positive
                />
            </Modal.Actions>
        </>
    )

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button inverted={props.inverted} style={props.style}>Sign Up</Button>}
        >
            <Modal.Header>Create Account</Modal.Header>
            {showConfirmation ? confirmation : signUpForm}
        </Modal>
    )
}

function ForgotPasswordModal(props) {

    const [open, setOpen] = React.useState(false)
    const [showStep2, setShowStep2] = React.useState(false)

    const [formState, updateFormState] = useState({
        email: '',
        password: '',
        confirmationCode: ''
    })

    function onchange(e) {
        e.persist()
        updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
    }

    async function handleEmailSubmit() {
        const { email } = formState

        // Send confirmation code to user's email
        Auth.forgotPassword(email)
            .then(data => console.log(data))
            .catch(err => console.log(err));

        setShowStep2(true);
    }

    async function handleSubmit() {
        const { email, password, confirmationCode } = formState

        Auth.forgotPasswordSubmit(email, confirmationCode, password)
            .then(data => console.log(data))
            .catch(err => console.log(err));

        setOpen(false)
        alert("Your password has been changed");
    }

    const step1 = (
        <>
            <Form style={{ maxWidth: "20em", margin: '25px auto 25px' }}>
                <Form.Input fluid label='Enter Email Address' placeholder='example@example.com' onChange={onchange} name='email' />
            </Form>

            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button
                    content="Next"
                    type='submit'
                    labelPosition='right'
                    icon='arrow right'
                    onClick={handleEmailSubmit}
                    positive
                />
            </Modal.Actions>
        </>
    )

    const step2 = (
        <>
            <Header as='h2'>A Confirmation Code Has Been Sent to Your Email</Header>

            <Form style={{ maxWidth: "20em", margin: '25px auto 25px' }}>
                <Form.Input fluid label='Enter Confirmation Code' placeholder='####' onChange={onchange} name='confirmationCode' />
                <Form.Input fluid label='Enter A New Password' placeholder='Password' type='password' onChange={onchange} name='password' />
            </Form>

            <Modal.Actions>
                <Button
                    content="Back"
                    labelPosition='left'
                    icon='arrow left'
                    color='black'
                    onClick={() => setShowStep2(false)}
                />
                <Button
                    content="Submit"
                    type='submit'
                    labelPosition='right'
                    icon='checkmark'
                    onClick={handleSubmit}
                    positive
                />
            </Modal.Actions>
        </>
    )

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button style={{ background: 'none', marginLeft: '40%' }}>Forgot Password?</Button>}
        >
            <Modal.Header>Forgot Password</Modal.Header>
            {showStep2 ? step2 : step1}
        </Modal>
    )
}
