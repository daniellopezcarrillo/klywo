import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

// Get Supabase URL and Anon Key from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Get Stripe public key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); // Use constants

  const [userId, setUserId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  useEffect(() => {
    const getUser = async () => {
      // Ensure supabase is initialized before proceeding
      if (!supabase) {
        console.error("Supabase client is not initialized.");
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        console.log("User ID:", user.id);
      } else {
        console.log("User not logged in.");
      }
    };
    getUser();
  }, [supabase]);

  // Log stripe status for debugging
  useEffect(() => {
    console.log("Stripe instance:", stripe);
    if (!stripe) {
      console.error("Stripe instance is not available.");
    }
  }, [stripe]);

  const plans = [
    {
      name: "Starter", description: "Perfecto para equipos pequeños", monthlyPrice: 29, annualPrice: 25,
      priceIdMonthly: "price_1S5dE7KVlNZMOTjrVmGIKMNs", priceIdAnnual: "price_1S5dE7KVlNZMOTjrVmGIKMNs",
      features: ["Hasta 3 agentes", "2 canales (Web chat + Email)", "Automatizaciones básicas", "Reportes estándar", "Soporte por email"],
      limitations: ["Sin IA avanzada", "Sin integraciones premium"], popular: false,
    },
    {
      name: "Growth", description: "Para equipos en crecimiento", monthlyPrice: 79, annualPrice: 65,
      priceIdMonthly: "price_1S5dW7KVlNZMOTjrbO5ATqlQ", priceIdAnnual: "price_1S5dW7KVlNZMOTjrbO5ATqlQ",
      features: ["Hasta 10 agentes", "Todos los canales", "IA y automatizaciones avanzadas", "Analytics completo", "Integraciones ilimitadas", "Soporte prioritario"],
      limitations: [], popular: true,
    },
    {
      name: "Scale", description: "Para empresas grandes", monthlyPrice: 149, annualPrice: 125,
      priceIdMonthly: "price_1S5deiKVlNZMOTjrNAP1Owf3", priceIdAnnual: "price_1S5diCKVlNZMOTjryznY2gAf",
      features: ["Agentes ilimitados", "Todos los canales + custom", "IA personalizada", "Reportes avanzados", "White-label disponible", "Soporte dedicado", "SLA garantizado"],
      limitations: [], popular: false,
    },
  ];

  const formatPrice = (monthlyPrice: number, annualPrice: number) => {
    const price = isAnnual ? annualPrice : monthlyPrice;
    return { price, period: isAnnual ? "/año" : "/mes" };
  };

  const handleGetStarted = async (planName: string, priceId: string) => {
    // Ensure user is logged in
    if (!userId) {
      console.error("User not logged in. Cannot proceed with checkout.");
      // Consider using a more user-friendly way to inform the user, e.g., a toast notification
      alert("Por favor, inicia sesión para continuar.");
      return;
    }

    // Ensure Stripe is initialized
    if (!stripe) {
      console.error("Stripe instance is not available.");
      alert("Stripe no está inicializado correctamente. Por favor, intenta de nuevo más tarde.");
      return;
    }

    setLoading(true);

    try {
      // Create Stripe customer if not already exists (assuming backend handles this)
      const customerResponse = await fetch('https://gvxljxkmlckefbbjenwq.supabase.co/functions/createStripeCustomer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const customerData = await customerResponse.json();

      if (!customerData.stripeCustomerId) {
        throw new Error('No se pudo obtener el ID de cliente de Stripe.');
      }

      // Create subscription
      const subscriptionResponse = await fetch('https://gvxljxkmlckefbbjenwq.supabase.co/functions/createSubscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, priceId: priceId }),
      });
      const subscriptionData = await subscriptionResponse.json();

      if (!subscriptionData.clientSecret) {
        throw new Error('No se pudo crear la suscripción.');
      }

      setClientSecret(subscriptionData.clientSecret);

    } catch (error) {
      console.error('Error during checkout initiation:', error);
      // Replace alert with a more integrated UI feedback mechanism if possible
      alert('Error durante el proceso de pago: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      alert("Stripe no está inicializado o falta el client secret.");
      return;
    }

    setLoading(true);

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (error) {
      console.error('Payment confirmation error:', error);
      setPaymentStatus('failed');
      alert(error.message); // Keep alert for now, but ideally update UI
    } else {
      setPaymentStatus('success');
      // Optionally, redirect user or update UI
    }

    setLoading(false);
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-surface">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Precios{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              transparentes
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Comienza gratis. Escala cuando necesites. Sin sorpresas.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Mensual
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Anual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2">
                20% off
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const { price, period } = formatPrice(plan.monthlyPrice, plan.annualPrice);
            const priceId = isAnnual ? plan.priceIdAnnual : plan.priceIdMonthly;
            
            return (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-primary shadow-brand scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-brand text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">${price}</span>
                    <span className="text-muted-foreground">{period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button 
                    variant={plan.popular ? "default" : "outline"} 
                    className="w-full"
                    size="lg"
                    onClick={() => handleGetStarted(plan.name, priceId)} // Call handleGetStarted
                    disabled={loading || !userId || !stripe || ['success', 'processing'].includes(paymentStatus)} // Disable button if loading, no user, stripe not ready, or payment is processing/successful
                  >
                    {loading ? "Processing..." : (plan.name === "Starter" ? "Start Free Trial" : "Get Started")}
                  </Button>
                  
                  {/* Conditionally render Stripe Elements form if clientSecret is available */}
                  {clientSecret && userId && paymentStatus === 'idle' && ( // Only show form if clientSecret is available and payment status is idle
                    <form onSubmit={handlePaymentSubmit}>
                      <CardElement />
                      <Button type="submit" className="w-full mt-4" disabled={!stripe || loading}>
                        {loading ? "Confirming Payment..." : "Confirm Payment"}
                      </Button>
                    </form>
                  )}

                  {/* Display payment status message */}
                  {paymentStatus === 'success' && (
                    <div className="text-center text-green-500">Suscripción exitosa!</div>
                  )}
                  {paymentStatus === 'failed' && (
                    <div className="text-center text-red-500">Fallo en el pago. Intenta de nuevo.</div>
                  )}
                  
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="text-lg font-semibold text-foreground mb-3">Limitaciones</h4>
                      <ul className="space-y-3 text-sm">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <X className="h-5 w-5 text-destructive" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;