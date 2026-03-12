import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { motion } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { 
  CreditCardIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import CardPaymentForm from '../../components/Payments/CardPaymentForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Donate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    isAnonymous: false
  });

  const { data: campaign, isLoading } = useQuery(
    ['campaign', id],
    () => api.get(`/campaigns/${id}`).then(res => res.data.campaign)
  );

  const donationMutation = useMutation(
    (data) => {
      if (paymentMethod === 'card') {
        return api.post('/payments/card', data);
      } else if (paymentMethod === 'mtn') {
        return api.post('/payments/mtn', data);
      } else {
        return api.post('/payments/airtel', data);
      }
    },
    {
      onSuccess: (response) => {
        toast.success(response.data.message);
        if (paymentMethod !== 'card') {
          navigate(`/payment-status/${response.data.reference}`);
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Payment failed');
      }
    }
  );

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const donationData = {
      campaignId: id,
      amount: amount === 'custom' ? customAmount : amount,
      ...donorInfo
    };

    if (paymentMethod === 'card') {
      return;
    }

    donationMutation.mutate(donationData);
  };

  if (isLoading) return <LoadingSpinner />;

  const presetAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-4">
              <img
                src={campaign.cover_image || 'https://via.placeholder.com/100'}
                alt={campaign.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold mb-2">Support: {campaign.title}</h1>
                <p className="text-gray-600">by {campaign.users.full_name}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-6">Make a Donation</h2>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Amount (UGX)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAmountSelect(preset)}
                    className={`py-3 px-2 rounded-lg border-2 transition ${
                      amount === preset
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {preset.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setAmount('custom');
                    setCustomAmount('');
                  }}
                  className={`py-3 px-2 rounded-lg border-2 transition ${
                    amount === 'custom'
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  Custom
                </button>
              </div>
              {amount === 'custom' && (
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="input-field"
                  min="1000"
                />
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mtn')}
                  className={`p-4 rounded-lg border-2 flex items-center justify-center space-x-2 transition ${
                    paymentMethod === 'mtn'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <DevicePhoneMobileIcon className="h-5 w-5" />
                  <span className="font-medium">MTN MoMo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('airtel')}
                  className={`p-4 rounded-lg border-2 flex items-center justify-center space-x-2 transition ${
                    paymentMethod === 'airtel'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <DevicePhoneMobileIcon className="h-5 w-5" />
                  <span className="font-medium">Airtel Money</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-lg border-2 flex items-center justify-center space-x-2 transition ${
                    paymentMethod === 'card'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <CreditCardIcon className="h-5 w-5" />
                  <span className="font-medium">Card</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    className="input-field"
                    required={!donorInfo.isAnonymous}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                {paymentMethod !== 'card' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <PhoneInput
                      country={'ug'}
                      value={donorInfo.phone}
                      onChange={(phone) => setDonorInfo({ ...donorInfo, phone })}
                      inputClass="!w-full !pl-12 !py-3 !border-gray-300 !rounded-lg"
                      containerClass="!w-full"
                      specialLabel=""
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={donorInfo.message}
                    onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                    rows="3"
                    className="input-field"
                    placeholder="Leave a message of support..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={donorInfo.isAnonymous}
                    onChange={(e) => setDonorInfo({ ...donorInfo, isAnonymous: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 text-sm text-gray-600">
                    Donate anonymously
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
                <LockClosedIcon className="h-4 w-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              {paymentMethod === 'card' ? (
                <Elements stripe={stripePromise}>
                  <CardPaymentForm
                    amount={amount === 'custom' ? customAmount : amount}
                    campaignId={id}
                    donorInfo={donorInfo}
                    onSuccess={() => navigate(`/campaign/${id}`)}
                  />
                </Elements>
              ) : (
                <button
                  type="submit"
                  disabled={donationMutation.isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {donationMutation.isLoading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    `Donate ${(amount === 'custom' ? customAmount : amount)?.toLocaleString()} UGX`
                  )}
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
