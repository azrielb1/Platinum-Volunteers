import React, { useState } from 'react'
import PayPalBtn from './Button'
import { Container, Form, Button, Checkbox } from 'semantic-ui-react'
import APIFuncs from '../APIFunctions'
export default function PaymentButtonAndDatabase (props) {
    //const [donationState, updateDonationState] = useState(props.amountDonatedSoFar)
    function PaymentHandler (details, data) {
        let eventId = 0;
        for (let i = 0; i < (props.name).length; i++) { eventId += (5 * (props.name).charCodeAt(i)) }
        var x = (parseInt(props.amountDonatedSoFar) + props.currentdonation);
        updateBackEnd(eventId, x)
    }
    async function updateBackEnd(eventId, donationState){
        let res = await APIFuncs.update('events', eventId, "set amountRaisedSoFar = :I", { ":I": donationState });
    }
      return ( 
          <div>
              <PayPalBtn
                  amount = {props.currentdonation}
                  currency = {'USD'}
                  onSuccess={PaymentHandler}
                  />
          </div>
      )
}
