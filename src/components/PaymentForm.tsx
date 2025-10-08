import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";
import SandglassTransition from './SandglassTransition';
import '../styles/auth-flow.css';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

interface PaymentProcessorProps {
  userData?: any;
  priceId?: string;
  planName?: string;
  onSuccess?: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const PaymentForm = ({ 
  userData, 
  priceId, 
  planName,
  onSuccess 
}: PaymentProcessorProps) => {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const urlPriceId = urlParams.get('priceId');
  const urlPlanName = urlParams.get('plan');

  const finalPriceId = priceId || urlPriceId;
  const finalPlanName = planName || urlPlanName;

  const [showSuccessTransition, setShowSuccessTransition] = useState(false);

  const handleTransitionComplete = () => {
    navigate('/post-payment-info', { 
      state: { 
        email: userEmail,
        planName: finalPlanName,
        priceId: finalPriceId
      }
    });
  };

  const processPayment = async () => {
    if (!stripe || !elements) {
      setError('Stripe.js has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found");
      return;
    }

    if (!finalPriceId || !finalPlanName) {
      setError('No se ha especificado un plan para procesar el pago');
      setStatus('error');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to make a payment.');
        setStatus('error');
        setProcessing(false);
        return;
      }
      setUserEmail(session.user.email || '');
      const jwt = session.access_token;

      const response = await fetch('https://gvxljxkmlckefbbjenwq.supabase.co/functions/v1/createSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
          'apiKey': import.meta.env.VITE_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          userId: session.user.id,
          priceId: finalPriceId,
          name,
          email: email || session.user.email,
          phone,
          address
        }),
      });

      const { clientSecret, error: functionError } = await response.json();

      if (functionError) {
        throw new Error(functionError);
      }

      const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
            email: email || session.user.email,
            phone: phone,
            address: address,
          },
        },
      });

      if (paymentError) {
        setError(paymentError.message || 'An unexpected error occurred.');
        setStatus('failed');
      } else {
        setStatus('success');
        setShowSuccessTransition(true);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error('Error en procesamiento de pago:', err);
      setError(err.message || 'Error al procesar el pago');
      setStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return 'Procesando tu pago...';
      case 'success':
        return '¡Pago exitoso! Redirigiendo...';
      case 'failed':
        return 'Pago rechazado';
      case 'error':
        return 'Error en el procesamiento';
      default:
        return 'Completa tus datos de pago';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-background to-surface flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-border relative z-10 card-enter">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Completa tu Pago
          </CardTitle>
          <div className="bg-gradient-to-r from-brand/10 to-primary/10 rounded-lg p-3 border border-brand/20">
            <div className="flex items-center justify-center gap-2 text-brand">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium text-sm">
                Plan: {finalPlanName}
              </span>
            </div>
          </div>
          <CardDescription>
            {getStatusMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="p-4 border rounded-lg space-y-4">
              <input
                type="text"
                placeholder="Nombre Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <Button
              onClick={processPayment}
              disabled={processing || !stripe || !elements}
              className="w-full bg-gradient-brand hover:shadow-brand hover:scale-105 transition-all duration-200 btn-hover-effect"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left fade-in">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <SandglassTransition
        isVisible={showSuccessTransition}
        message="Estamos procesando tu pago..."
        subMessage="Serás redirigido en unos segundos..."
        onComplete={handleTransitionComplete}
      />
    </div>
  );
};

export default PaymentForm;