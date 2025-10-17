import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StartCheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('Redirigiendo a la página de pago segura...');
  const priceId = searchParams.get('priceId');
  const navigate = useNavigate();

  useEffect(() => {
    const initiateCheckout = async () => {
      if (!priceId) {
        setError('No se ha especificado un plan. Redirigiendo al inicio.');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // The user should be logged in here after email confirmation
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          // If for some reason the session is not available, redirect to auth
          setError('No se pudo verificar tu sesión. Por favor, inicia sesión para continuar.');
          setTimeout(() => navigate(`/auth?priceId=${priceId}`), 3000);
          return;
        }

        // Call the new Supabase function to create a checkout session
        const { data, error: invokeError } = await supabase.functions.invoke('create-checkout-session', {
          body: JSON.stringify({ priceId }),
        });

        if (invokeError) {
          throw new Error(invokeError.message);
        }

        const { sessionId } = data;
        if (!sessionId) {
          throw new Error('No se pudo crear la sesión de pago.');
        }

        // Redirect to Stripe Checkout
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        } else {
          throw new Error('Stripe.js no se ha cargado.');
        }

      } catch (err: any) {
        setError(`Error: ${err.message}`);
        setMessage('Ocurrió un error. Por favor, intenta de nuevo desde la página de precios.');
      }
    };

    initiateCheckout();
  }, [priceId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{message}</h1>
        {error && <p className="text-red-500">{error}</p>}
        {!error && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartCheckoutPage;
