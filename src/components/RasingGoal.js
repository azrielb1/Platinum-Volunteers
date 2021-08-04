import React from "react";
import { useForm } from "react-hook-form";
import PaymentExample2 from './PaymentExample2'


export default function NameForm(props) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [donation, setDonation] = React.useState(0)
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
      <PaymentExample2 amountDonatedSoFar={props.amountRaisedSoFar} currentdonation={donation} name={props.name}></PaymentExample2>
    </form>

  );
}