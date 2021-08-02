import React from "react";
import { useForm } from "react-hook-form";
import PaymentExample2 from './PaymentExample2'


export default function NameForm(props) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [donation, setDonation] = React.useState(0)

  //const onSubmit = data => console.log(data);
  function onSubmit(data) {
    console.log(data.donation)
    setDonation(parseInt(data.donation))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="donation">donation</label>
      <input
        id="donation"
        aria-invalid={errors.donation ? "true" : "false"}
        {...register('donation', { required: true })}
      />
      {errors.donation && (
        <span role="alert">
          This field is required
        </span>
      )}

      <input type="submit" />
      <PaymentExample2 amountDonatedSoFar={props} currentdonation={donation}></PaymentExample2>
    </form>

  );
}

/*import React from 'react'
import PaymentExample2 from './PaymentExample2'

export class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({value: event.target.value});
      console.log(this.state.value)
    }

    handleSubmit(event) {
      event.preventDefault();
      console.log(this.state.value)
    }
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Amount:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />

        </form>
        <PaymentExample2 moneyValue ={this.state.value}></PaymentExample2>
      );
    }
  }*/