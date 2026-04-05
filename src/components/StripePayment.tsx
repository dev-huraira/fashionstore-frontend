'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_BASE } from '@/lib/api';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_placeholder';
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: 'Inter, sans-serif',
            '::placeholder': { color: '#aab7c4' },
        },
        invalid: { color: '#d00', iconColor: '#d00' },
    },
    hidePostalCode: false,
};

interface StripeFormProps {
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onError: (msg: string) => void;
    disabled: boolean;
}

function StripeForm({ amount, onSuccess, onError, disabled }: StripeFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState('');

    const handlePay = async () => {
        if (!stripe || !elements) return;
        setProcessing(true);
        setCardError('');
        try {
            // 1. Create payment intent on backend
            const intentRes = await fetch(`${API_BASE}/api/payment/create-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ amount }),
            });
            const intentData = await intentRes.json();
            if (!intentRes.ok) throw new Error(intentData.message || 'Failed to initialize payment');

            // 2. Confirm the payment with the card element
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error('Card element not found');

            const { error, paymentIntent } = await stripe.confirmCardPayment(intentData.clientSecret, {
                payment_method: { card: cardElement },
            });

            if (error) throw new Error(error.message || 'Payment failed');
            if (paymentIntent?.status === 'succeeded') {
                onSuccess(paymentIntent.id);
            }
        } catch (e: any) {
            setCardError(e.message);
            onError(e.message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <div style={{
                padding: '0.75rem 1rem',
                border: '1px solid #ddd',
                borderRadius: 6,
                background: '#fff',
                marginBottom: '0.75rem',
            }}>
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            {cardError && <p style={{ color: '#d00', fontSize: '0.85rem', marginBottom: '0.5rem' }}>⚠️ {cardError}</p>}
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.75rem' }}>
                🔒 Test card: <strong>4242 4242 4242 4242</strong> | Exp: any future date | CVV: any 3 digits
            </p>
            <button
                type="button"
                onClick={handlePay}
                disabled={disabled || processing || !stripe}
                className="btn-primary"
                style={{ width: '100%', padding: '0.7rem', borderRadius: 4, fontSize: '1rem' }}
            >
                {processing ? 'Processing...' : `Pay $${amount.toFixed(2)} with Card`}
            </button>
        </div>
    );
}

export default function StripePayment(props: StripeFormProps) {
    return (
        <Elements stripe={stripePromise}>
            <StripeForm {...props} />
        </Elements>
    );
}
