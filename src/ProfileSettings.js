import React, { useState } from 'react'
import {
    Button,
    Form,
    Message,
    Modal
} from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import APIFuncs from './APIFunctions'


export function ChangePasswordModal() {
    const [open, setOpen] = React.useState(false)

    const [passwordError, updatePasswordError] = useState({
        error:false,
        message:""
    })

    const [formState, updateFormState] = useState({
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: ''
    })

    function onchange(e) {
        e.persist()
        updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
    }

    function handlePasswordChange() {
        const { oldPassword, newPassword, repeatNewPassword } = formState

        if (newPassword === repeatNewPassword) {
            Auth.currentAuthenticatedUser()
                .then(user => {
                    return Auth.changePassword(user, oldPassword, newPassword);
                })
                .then(data => {
                    console.log(data)
                    setOpen(false)
                })
                .catch(err => {
                    console.log(err)
                    updatePasswordError({
                        error:true,
                        message:err.message
                    })
                });
        } else {
            updatePasswordError({
                error:true,
                message:"new passwords dont match"
            })
        }
    }

    let errorMessage;
    if (passwordError.error) {
        errorMessage = <Message
            error
            header='Action Forbidden'
            content={passwordError.message}
        />
    } else {
        errorMessage = null;
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Form.Button basic color='red' content='change password' style={{ marginLeft: '1em' }} />}
        >
            <Modal.Header>Change Password</Modal.Header>
            <Modal.Content>
                <Form error style={{ maxWidth: "20em", margin: '25px auto 25px', }}>
                    {errorMessage}
                    <Form.Field>
                        <label>Old Password</label>
                        <input name='oldPassword' placeholder='Enter Old Password' type="password" onChange={onchange} />
                    </Form.Field>
                    <Form.Field>
                        <label>New Password</label>
                        <input name='newPassword' placeholder='Enter New Password' type='password' onChange={onchange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Confirm New Password</label>
                        <input name='repeatNewPassword' placeholder='Enter New Password Again' type='password' onChange={onchange} />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button
                    content="Change Password"
                    type='submit'
                    labelPosition='right'
                    icon='checkmark'
                    onClick={handlePasswordChange}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}


export default function ProfileSettings(props) {

    const [bioState, updateBioState] = useState(props.userData.bio)
    function onBioChange(e) {
        e.persist();
        updateBioState(e.target.value);
    }
    async function handleBioSubmit() {
        await APIFuncs.update('users', props.userData.id, "set bio = :I", { ":I": bioState });
        props.getUserData(props.userData.id);
    }

    const [telState, updateTelState] = useState(props.userData.phone)
    function onTelChange(e) {
        e.persist();
        updateTelState(e.target.value);
    }
    async function handleTelSubmit() {
        
        await APIFuncs.update('users', props.userData.id, "set phone = :I", { ":I": telState });
        props.getUserData(props.userData.id);
    }



    return (
        <Form style={{ maxWidth: "20em", margin: '25px auto 25px' }}>
            <Form.Field>
                <label>Edit Bio</label>
                <Form.TextArea name='bio' onChange={onBioChange} defaultValue={props.userData.bio} />
                <Form.Button primary as={Link} to='/profile' floated='right' style={{ margin: '1em' }} onClick={handleBioSubmit}>SUBMIT</Form.Button>
            </Form.Field>
            <Form.Field style={{ margin: '25px auto 25px' }}>
                <label>Change Phone Number</label>
                <Form.Input name='tel' type='tel' icon='phone' iconPosition='left' placeholder={props.userData.phone} onChange={onTelChange} />
                <Form.Button primary as={Link} to='/profile' floated='right' style={{ margin: '1em' }} onClick={handleTelSubmit}>SUBMIT</Form.Button>
            </Form.Field>
            <Form.Field style={{ marginTop: '2em' }}>
                <ChangePasswordModal />
                {/* <Form.Button basic color='red' content='change password' style={{ marginLeft: '1em' }} /> */}
            </Form.Field>
        </Form>
    )
}
