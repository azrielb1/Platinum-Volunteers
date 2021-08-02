import React, { useState } from 'react'
import PayPalBtn from './Button'
import { Container, Form, Button, Checkbox } from 'semantic-ui-react'
import APIFuncs from '../APIFunctions'
export default function PaymentExample2 (props) {
    console.log(props)
    console.log(props.amountDonatedSoFar.amountRaisedSoFar)
    console.log(props.currentdonation)
    console.log(props.amountDonatedSoFar.amountRaisedSoFar + props.currentdonation)
    
  function PaymentHandler (details, data) {
    /*console.log(details, data);
    var x = parseInt(details.purchase_units[0].amount.value)
    console.log(props)
    console.log(details.purchase_units[0].amount.value);*/
    const [donationState, updateDonationState] = useState(props.userData.bio)
    function onDonationChange(e) {
        e.persist();
        updateDonationState(props.amountDonatedSoFar.amountRaisedSoFar + props.currentdonation);
    }
    async function handleDonationSubmit() {
        await  APIFuncs.update('Events_api-lambda-db', props.userData.id, "set currentdonation = :I", { ":I": donationState });
        props.getDonationData(props.userData.id);
    }
  }
    /*const [formState, updateFormState] = useState({
        moneyRaisedSoFar: '',
    })
    function onchange(e) {
        e.persist()
        updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
    }
    async function handleSubmit() {
        const { amountRaisedSoFar } = formState
        console.log(formState)
    }
 
    <Form.Field>
        <label>suggestedDonation</label>
        <textarea onChange={onchange} rows='1' name="suggestedDonation" placeholder="suggestedDonation" />
    </Form.Field>}*/
      return ( 
          <div>
              <PayPalBtn
                  amount = {props.currentdonation}
                  currency = {'USD'}
                  onSuccess={PaymentHandler}/>
          </div>
      )
}
