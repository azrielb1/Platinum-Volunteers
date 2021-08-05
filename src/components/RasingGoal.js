import React from "react";
import { useForm } from "react-hook-form";
import PaymentButtonAndDatabase from './PaymentButtonAndDatabase'


export default function AmountForm(props) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [donation, setDonation] = React.useState(0)
  function onSubmit(data) {
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
      <PaymentButtonAndDatabase amountDonatedSoFar={props.amountRaisedSoFar} currentdonation={donation} name={props.name}></PaymentButtonAndDatabase>
    </form>

  );
}