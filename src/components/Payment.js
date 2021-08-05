import React from 'react';
import  AmountForm  from './RasingGoal';
export default function Payment(props) {
      return ( 
          <div>
              <div>Donate Here for {props.eventName}</div>
              
              <div>How much would you like to donate?</div>
            
            <AmountForm amountRaisedSoFar={props.amountRaisedSoFar} name={props.eventName}></AmountForm>
              
          </div>
      )
}
