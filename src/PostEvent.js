import React, { useState } from 'react'
import { Container, Form, Button, Checkbox } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import APIFuncs from './APIFunctions'

export function PostEvent(props) {
    const [formState, updateFormState] = useState({
        name: '',
        description: '',
        information: '',
        moneyRaisingGoal: '',
        amountRaisedSoFar: '0',
        suggestedDonation: '',
        Date: '',
        location: '',
        tags : []
    })
    console.log(props)
    function onchange(e) {
        e.persist()
        updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
    }
    function addTag(tag) {
        updateFormState(() => ({ ...formState, tags : [...formState.tags, tag] }))                         
    }
    let allTags = ["Enviromental",
    "Social justice",
    "Jewish",
    "Poverty",
    "Education",
    "Public health",
    "Charity",
    "Children with special needs",
    "Elderly with special needs",
    "Imigrants",
    "Community outreach",
    "Holiday event",
    "Long term commitment",
    "Short term commitment",
    "High-Need",
    "New volunteer friendly",
    "Animals"]
    const [tagState, setTagState] = useState(new Set())
    function handleTag(event, data){
        var newTagState = (new Set());
        if (data.checked){
            newTagState = tagState.add(data.label)
            setTagState(newTagState)
        }else{
            tagState.delete(data.label)
            setTagState(tagState)
        }
        
        
    } 

    async function handleSubmit() {
        const { name, description, information, moneyRaisingGoal, suggestedDonation, date, location, tags, amountRaisedSoFar } = formState
        console.log(formState, props.user.name)
        try {
            let eventid = 0;
            for (let i = 0; i < name.length; i++) { eventid += (5 * name.charCodeAt(i)) }

            let cleanedTags;
            if(tags.length > 1) {
                cleanedTags = tags.split(",").concat(Array.from(tagState))
            } else {
                cleanedTags = Array.from(tagState)
            }

            let res = await APIFuncs.create("events", {
                id: eventid,
                title: name,
                description: description,
                date: date,
                location: location,
                tags: cleanedTags,
                information: information,
                moneyRaisingGoal: moneyRaisingGoal,
                suggestedDonation: suggestedDonation,
                amountRaisedSoFar: amountRaisedSoFar,
                creator: `${props.user.attributes.name} ${props.user.attributes.family_name}`,
                participants: [],
                approved: false,
                public: true,
                creatorEmail: props.user.attributes.email
            })

        } catch (error) {
            console.log('error submitting event: ', error);
        }
    }

    
      
    let page;
    if (props.user) {
        return (
            page = <Container>
                <div style={{ padding: '3em 0em 1em' }} >
                    <div class="ui text container">
                        <h1 class="ui dividing header">Post an Event</h1>
                        <h3 style={{ margin: '0 0 0', textAlign: 'center' }}>All events are subject to approval by the site administrator</h3>
                    </div>

                    <Form style={{ maxWidth: "30em", margin: '20px auto 25px' }}>

                        <Form.Field>
                            <label>Event Name</label>
                            <input onChange={onchange} type="text" name="name" placeholder="Event Name" />
                        </Form.Field>
                        <Form.Field>
                            <label>Description</label>
                            <textarea onChange={onchange} rows='5' name="description" placeholder="Description" />
                        </Form.Field>
                        
                        <Form.Field>
                            <label>Information</label>
                            <textarea onChange={onchange} rows='10' name="information" placeholder="Information" />
                        </Form.Field>

                        <Form.Field>
                            <label>moneyRaisingGoal</label>
                            <textarea onChange={onchange} rows='1' name="moneyRaisingGoal" placeholder="moneyRaisingGoal" />
                        </Form.Field>

                        <Form.Field>
                            <label>suggestedDonation</label>
                            <textarea onChange={onchange} rows='1' name="suggestedDonation" placeholder="suggestedDonation" />
                        </Form.Field>


                        <Form.Field>
                            <Form.Input onChange={onchange} fluid label='Date' placeholder='MM/DD/YYYY' type="date" name='date' />
                        </Form.Field>
                        <Form.Field>
                            <label>Location</label>
                            <input onChange={onchange} type="text" name="location" placeholder="Location" />
                        </Form.Field>
                        <Form.Field> 
            
                            {allTags.map(e => <Checkbox onChange={handleTag} label = {e} style={{margin:'5px'}}/>)}
                            
        
              
                            <Form.Input onChange={onchange} fluid label='miscellaneous tags' placeholder='tags' type="tags" name='tags' />
                        </Form.Field>
                    </Form>
                
                    <Button as={Link} to='/events' color='green' style={{ marginLeft: '46%' }} onClick={handleSubmit} type='submit'>Submit</Button>

                </div>
                <div id="tester">

                </div>
                
            </Container>
        )
    } else {
        page = <div> <h1 style={{ textAlign: 'center', margin: '2em 0 2em' }}>You must be logged in to post an event.</h1> </div>
        return (
            <div>
                {page}
            </div>
        )
    }

}
