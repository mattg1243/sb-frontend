import { useStripe, useElements, PaymentElement, Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import { StripeElementsOptions } from '@stripe/stripe-js';
import Layout, { Content } from 'antd/es/layout/layout';

export default function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>();

  const clientSecret = new URLSearchParams(window.location.search).get('stripe-secret');

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    // const { error } = await stripe.confirmPayment({
    //   confirmParams: {
    //     return_url: 'http://localhost:3000/app/dash',
    //   },
    //   clientSecret: clientSecret as string,
    // });

    // if (error.type === 'card_error' || error.type === 'validation_error') {
    //   setMessage(error.message);
    // } else {
    //   setMessage('An unexpected error occurred.');
    // }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret as string, {
      payment_method: { card: cardElement as StripeCardElement },
    });
    if (error) {
      // show error and collect new card details.
      setMessage(error.message);
      return;
    }

    setIsLoading(false);
  };

  return (
    <Layout style={{ height: '100vh', justifyContent: 'center', alignContent: 'center', margin: '0 10vw' }}>
      <Content style={{ height: '100vh', justifyContent: 'center', alignContent: 'center', marginTop: '35%' }}>
        <form id="payment-form" onSubmit={handleSubmit}>
          <CardElement />
          <button disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}</span>
          </button>
          {/* Show any error or success messages */}
          {message && <div id="payment-message">{message}</div>}
        </form>
      </Content>
    </Layout>
  );
}
