import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "¿Puedo exportar mis datos si decido cambiar de plataforma?",
      answer: "Absolutamente. Proporcionamos exportación completa de datos en formatos estándar (JSON, CSV, XML). No hay lock-in de vendor - tus datos son tuyos. También ofrecemos APIs para sincronización en tiempo real con otras plataformas.",
    },
    {
      question: "¿Qué canales de comunicación soportan?",
      answer: "Soportamos todos los canales principales: Web chat, Email, WhatsApp Business, Instagram DM, Facebook Messenger, Telegram, Line, SMS, y llamadas telefónicas. También ofrecemos APIs para canales personalizados.",
    },
    {
      question: "¿Hay límites en el uso de IA y automatizaciones?",
      answer: "En el plan Starter hay límites básicos. Los planes Growth y Scale incluyen IA y automatizaciones ilimitadas. También puedes usar tu propia API key de OpenAI para control total de costos y uso.",
    },
    {
      question: "¿Qué SLA ofrecen y qué soporte incluye?",
      answer: "Ofrecemos 99.9% uptime SLA en todos los planes pagos. El soporte incluye: email (todos los planes), chat prioritario (Growth+), y soporte dedicado con SLA de respuesta garantizado (Scale). También proporcionamos formación gratuita para equipos.",
    },
    {
      question: "¿Puedo integrar con mi CRM y herramientas existentes?",
      answer: "Sí, ofrecemos integraciones nativas con los CRMs principales (Salesforce, HubSpot, Pipedrive) y conectores para herramientas como Slack, Teams, Zapier, y Make. También proporcionamos webhooks y APIs REST completas para integraciones personalizadas.",
    },
  ];

  return (
    <section id="docs" className="py-24 bg-gradient-surface">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Preguntas{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              frecuentes
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre Klywo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            ¿No encuentras la respuesta que buscas?
          </p>
          <a
            href="#contact"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Contáctanos →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;