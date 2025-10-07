import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, CreditCard, Loader2, AlertCircle } from "lucide-react";
import SandglassTransition from './SandglassTransition';
import '../styles/auth-flow.css';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

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
  const stripe = useStripe();
  const elements = useElements();

  const urlParams = new URLSearchParams(window.location.search);
  const urlPriceId = urlParams.get('priceId');
  const urlPlanName = urlParams.get('plan');

  const finalPriceId = priceId || urlPriceId;
  const finalPlanName = planName || urlPlanName;

  const [showSuccessTransition, setShowSuccessTransition] = useState(false);

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
          priceId: finalPriceId
        }),
      });

      const { clientSecret, error: functionError } = await response.json();

      if (functionError) {
        throw new Error(functionError);
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
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
        // You can call your webhook here if needed
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
        return '¡Pago exitoso!';
      case 'failed':
        return 'Pago rechazado';
      case 'error':
        return 'Error en el procesamiento';
      default:
        return 'Completa tus datos de pago';
    }
  };

  const getStatusSubMessage = () => {
    switch (status) {
      case 'processing':
        return 'Validando tus datos con el banco...';
      case 'success':
        return 'Preparando tu cuenta...';
      case 'failed':
        return 'Por favor intenta con otro método de pago';
      case 'error':
        return 'Ha ocurrido un error, por favor intenta de nuevo';
      default:
        return 'Ingresa los datos de tu tarjeta para continuar';
    }
  };

  const handleTransitionComplete = () => {
    window.location.href = 'https://app.klywo.com/app/login';
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
            <div className="p-4 border rounded-lg">
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
          {status === 'success' && !showSuccessTransition && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  ¡Pago exitoso!
                </h3>
                <p className="text-sm text-green-700">
                  Tu cuenta está siendo preparada. Serás redirigido a la aplicación en unos segundos.
                </p>
              </div>
              <Button
                onClick={() => {
                  window.location.href = 'https://app.klywo.com/app/login';
                }}
                className="w-full bg-gradient-brand hover:shadow-brand hover:scale-105 transition-all duration-200 btn-hover-effect"
              >
                Iniciar Sesión
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <SandglassTransition
        isVisible={showSuccessTransition}
        message="Estamos creando tu cuenta..."
        subMessage="Serás redirigido en unos segundos..."
        onComplete={handleTransitionComplete}
      />
    </div>
  );
};

export default PaymentForm;