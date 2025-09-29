import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Get Stripe public key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const priceIdFromUrl = searchParams.get('priceId');

  const [userId, setUserId] = useState<string | null>(null);
  const [clientSecretInfo, setClientSecretInfo] = useState<{ plan: string; secret: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        console.log("User not logged in.");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (priceIdFromUrl && userId) {
      const plan = plans.find(p => p.priceIdMonthly === priceIdFromUrl || p.priceIdAnnual === priceIdFromUrl);
      if (plan) {
        handleGetStarted(plan.name, priceIdFromUrl);
      }
    }
  }, [priceIdFromUrl, userId]);

  const plans = [
    {
      name: "Starter", description: "Perfecto para equipos pequeños", monthlyPrice: 19, annualPrice: 19,
      priceIdMonthly: "price_1SCFZS48rdWD5n1ODDiKPiY8", priceIdAnnual: "price_1SCFZS48rdWD5n1ODDiKPiY8",
      features: ["Hasta 3 agentes", "2 canales (Web chat + Email)", "Automatizaciones básicas", "Reportes estándar", "Soporte por email"],
      limitations: ["Sin IA avanzada", "Sin integraciones premium"], popular: false,
    },
    {
      name: "Growth", description: "Para equipos en crecimiento", monthlyPrice: 39, annualPrice: 39,
      priceIdMonthly: "price_1SCFTa48rdWD5n1O0y8NHoUL", priceIdAnnual: "price_1SCFTa48rdWD5n1O0y8NHoUL",
      features: ["Hasta 10 agentes", "Todos los canales", "IA y automatizaciones avanzadas", "Analytics completo", "Integraciones ilimitadas", "Soporte prioritario"],
      limitations: [], popular: true,
    },
    {
      name: "Scale", description: "Para empresas grandes", monthlyPrice: 99, annualPrice: 99,
      priceIdMonthly: "price_1SCFa048rdWD5n1OMUWPd514", priceIdAnnual: "price_1SCFa048rdWD5n1OMUWPd514",
      features: ["Agentes ilimitados", "Todos los canales + custom", "IA personalizada", "Reportes avanzados", "White-label disponible", "Soporte dedicado", "SLA garantizado"],
      limitations: [], popular: false,
    },
  ];

  const formatPrice = (monthlyPrice: number, annualPrice: number) => {
    const price = isAnnual ? annualPrice : monthlyPrice;
    return { price, period: isAnnual ? "/año" : "/mes" };
  };

  const handleGetStarted = async (planName: string, priceId: string) => {
    if (!userId) {
      console.error("User not logged in. Redirecting to auth page.");
      navigate(`/auth?priceId=${priceId}`);
      return;
    }

    if (!stripe) {
      console.error("Stripe instance is not available.");
      alert("Stripe no está inicializado. Por favor, intenta de nuevo.");
      return;
    }

    setLoading(true);
    setPaymentStatus('idle');
    setClientSecretInfo(null);

    try {
      const { data: customerData, error: customerError } = await supabase.functions.invoke('createStripeCustomer', {
        body: { userId },
      });

      if (customerError || !customerData.stripeCustomerId) {
        throw new Error('No se pudo crear o verificar el cliente de Stripe. Revisa los logs de la función `createStripeCustomer`.');
      }

      const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke('createSubscription', {
        body: { userId: userId, priceId: priceId },
      });

      if (subscriptionError || !subscriptionData.clientSecret) {
        throw new Error('No se pudo crear la suscripción. Revisa los logs de la función `createSubscription`.');
      }

      setClientSecretInfo({ plan: planName, secret: subscriptionData.clientSecret });

    } catch (error) {
      console.error('Error during checkout initiation:', error);
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecretInfo) {
      alert("Stripe no está inicializado o falta el client secret.");
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    const { error } = await stripe.confirmCardPayment(clientSecretInfo.secret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (error) {
      console.error('Payment confirmation error:', error);
      setPaymentStatus('failed');
      alert(error.message ?? "Ocurrió un error desconocido durante el pago.");
    } else {
      setPaymentStatus('success');
      setClientSecretInfo(null); // Clear secret after success
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
                    onClick={() => handleGetStarted(plan.name, priceId)}
                    disabled={loading || !stripe}
                  >
                    {loading && clientSecretInfo?.plan !== plan.name ? "Cargando..." : "Get Started"}
                  </Button>
                  
                  {clientSecretInfo?.plan === plan.name && paymentStatus !== 'success' && (
                    <form onSubmit={handlePaymentSubmit}>
                      <CardElement className="p-3 border rounded-md bg-background" />
                      <Button type="submit" className="w-full mt-4" disabled={!stripe || loading || paymentStatus === 'processing'}>
                        {paymentStatus === 'processing' ? "Confirmando Pago..." : "Pagar Ahora"}
                      </Button>
                    </form>
                  )}

                  {paymentStatus === 'success' && clientSecretInfo?.plan === plan.name && (
                    <div className="text-center text-green-500 font-medium">¡Suscripción exitosa!</div>
                  )}
                  {paymentStatus === 'failed' && clientSecretInfo?.plan === plan.name && (
                    <div className="text-center text-red-500 font-medium">Fallo en el pago. Por favor, intenta de nuevo.</div>
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