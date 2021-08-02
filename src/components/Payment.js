import React from 'react';
import PayPalBtn from './Button'
/*import { useState } from 'react'
import { Container, Form, Button, Checkbox } from 'semantic-ui-react'
import { Link } from 'react-router-dom';*/
import  NameForm  from './RasingGoal';
export default function PaymentExample(props) {
    console.log(props)
    console.log(props.amountRaisedSofar)
      return ( 
          <div>
              <div>Donate Here for {props.eventName}</div>
              <div>The goal is to reach {props.amount}.</div>
              <div>We have {props.amount} so far.</div>
              <div>The reccomended donation is {props.amount}.</div>
              <div>How much would you like to donate?</div>
            
            <NameForm amountRaisedSoFar={props.amountRaisedSoFar}></NameForm>
              
          </div>
      )
}
/*


<Container>
                <div style={{ padding: '3em 0em 1em' }} >
                    

                    <Form style={{ maxWidth: "30em", margin: '20px auto 25px' }}>

                        <Form.Field>
                            <label>Amount in US dollars</label>
                            <input onChange={onchange} type="text" name="name" placeholder="donation" />
                        </Form.Field>
                    </Form>

                </div>
                <div id="tester">
                </div>
                
            </Container>





class PaymentExample extends Component {
    paymentHandler = (details, data) => {
      /** Here you can call your backend API
        endpoint and update the database 
      console.log(details, data);
    }
    render() {
        return ( 
            <div>
                <div>Donate Here for event name</div>
                <PayPalBtn
                    amount = {200}
                    currency = {'USD'}
                    onSuccess={this.paymentHandler}/>
            </div>
        )
    }
}
export default React.memo(PaymentExample)
*/