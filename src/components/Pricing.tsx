import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/auth-flow.css';

interface PricingProps {
  onStartFreeTrial: () => void;
}

const Pricing = ({ onStartFreeTrial }: PricingProps) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const priceIdFromUrl = searchParams.get('priceId');

  const plans = [
    {
      name: "Starter",
      description: "Ideal para equipos pequeños y startups que necesitan una solución de comunicación profesional para empezar.",
      monthlyPrice: 19,
      annualPrice: 182.40,
      priceIdMonthly: "price_1SFvAXKaCjM8mKvqEAiySg2p",
      priceIdAnnual: "price_1SFvEZKaCjM8mKvqZnWRlv8V",
      features: [
        "Hasta 3 agentes (Plan Mensual)",
        "Hasta 6 agentes (Plan Anual)",
        "Captain AI: 250 respuestas/mes",
        "Agent Bots (Flujos)",
        "Canales: Web, Email, Facebook",
        "WhatsApp: 1 Línea (Limitado)",
        "Plataforma Completa klywo v4",
        "Reportes Estándar y Soporte por Email",
      ],
      limitations: [],
      popular: false,
    },
    {
      name: "Growth",
      description: "Perfecto para empresas en crecimiento que buscan expandir su comunicación y automatizar procesos.",
      monthlyPrice: 39,
      annualPrice: 374.40,
      priceIdMonthly: "price_1SFvHgKaCjM8mKvq7l5yy7cB",
      priceIdAnnual: "price_1SFvJsKaCjM8mKvqQKupwJE6",
      features: [
        "Hasta 6 agentes (Plan Mensual)",
        "Hasta 10 agentes (Plan Anual)",
        "Captain AI: 600 respuestas/mes",
        "Todos los canales disponibles",
        "WhatsApp: 3 Líneas (Completo)",
        "Kanban de Clientes (Beta)",
        "Automatizaciones Avanzadas",
        "Reportes Avanzados y Analytics",
        "Help Center (Base de Conocimiento)",
        "Soporte Prioritario",
      ],
      limitations: [],
      popular: true,
    },
    {
      name: "Scale",
      description: "Solución integral para grandes equipos que buscan un socio tecnológico para maximizar su eficiencia.",
      monthlyPrice: 99,
      annualPrice: 950.40,
      priceIdMonthly: "price_1SFvLjKaCjM8mKvqHaRPtpkT",
      priceIdAnnual: "price_1SFvNfKaCjM8mKvq4mrAGnMo",
      features: [
        "Hasta 30 agentes (Plan Mensual)",
        "Hasta 40 agentes (Plan Anual)",
        "Captain AI: RESPUESTAS ILIMITADAS",
        "Agente IA Personalizado (n8n),que agenda por google calendar,bases de datos,gmail y recordatorio desarrollado por klywo",
        "Acceso a API y Campañas por WhatsApp",
        "Dominio y Email Personalizados",
        "Audit Logs y Custom Roles",
        "SLA y Soporte Dedicado",
        "Exclusivo Anual: Agente IA Multicanal, Asesorías y Landing Page",
      ],
      limitations: [],
      popular: false,
    },
  ];

  const formatPrice = (monthlyPrice: number, annualPrice: number) => {
    const price = isAnnual ? annualPrice : monthlyPrice;
    return { price, period: isAnnual ? "/año" : "/mes" };
  };

  const handleGetStarted = (planName: string, priceId: string) => {
    console.log("Redirigiendo a autenticación para el plan:", planName);
    navigate(`/auth?priceId=${priceId}&plan=${planName}`);
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
                      Más Popular
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
                    className="w-full group relative overflow-hidden hover:shadow-brand hover:scale-105 transition-all duration-200"
                    size="lg"
                    onClick={() => handleGetStarted(plan.name, priceId)}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Empezar
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </Button>
                  
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