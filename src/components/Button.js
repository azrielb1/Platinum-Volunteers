import React from 'react';
import { PayPalButton } from "react-paypal-button-v2";
class PayPalBtn extends React.Component {
    render() {
      const { amount, onSuccess, currency } = this.props;
        return (
            <PayPalButton
              amount={amount}
              currency={currency}
              onSuccess={(details, data) => onSuccess(details, data)}
              options={{
                clientId: "ARODkNmuzMmwkWEwHwyRP6SXdPq6RQvpTg6In5sAwTk5ugL7sX__NtTX-Ass7ass0f2O4N9da1MXZfPp"
              }}
          />
        );
    }
}
export default PayPalBtn;