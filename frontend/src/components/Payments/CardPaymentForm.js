import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../UI/LoadingSpinner';

const CardPaymentForm = ({ amount, campaignId, donorInfo, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { data } = await api.post('/payments/create-intent', {
        amount,
        campaignId,
        donorInfo
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: donorInfo.name,
            email: donorInfo.email,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          toast.success('Payment successful!');
          onSuccess();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 p-4 border border-gray-300 rounded-lg">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <LoadingSpinner size="small" />
        ) : (
          `Pay ${parseInt(amount).toLocaleString()} UGX`
        )}
      </button>
    </form>
  );
};

export default CardPaymentForm;
