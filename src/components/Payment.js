import React from 'react';
import PayPalBtn from './Button'
import  NameForm  from './RasingGoal';
export default function PaymentExample(props) {
    console.log(props)
    console.log(props.amountRaisedSofar)
      return ( 
          <div>
              <div>Donate Here for {props.eventName}</div>
              
              <div>How much would you like to donate?</div>
            
            <NameForm amountRaisedSoFar={props.amountRaisedSoFar} name={props.eventName}></NameForm>
              
          </div>
      )
}