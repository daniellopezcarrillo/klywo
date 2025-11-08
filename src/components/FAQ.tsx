import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Si adquiero un plan anual, ¿qué beneficios exclusivos obtengo?",
      answer: "Además de un 20% de descuento, el plan anual aumenta significativamente el número de agentes incluidos. En el plan Scale anual, recibes servicios de alto valor como la implementación de un Agente IA Multicanal, 4 asesorías estratégicas al año y la creación de una landing page personalizada para tu negocio.",
    },
    {
      question: "Necesito más agentes de los que ofrece mi plan, ¿qué hago?",
      answer: "Nuestro modelo está diseñado para crecer contigo. Si excedes el límite de agentes de tu plan (ej. más de 6 en Growth Anual), simplemente necesitas pasar al siguiente plan, Scale, para ampliar tu capacidad. Esto mantiene los costos predecibles.",
    },
    {
      question: "¿Cuál es la diferencia entre la funcionalidad de WhatsApp Limitada y Completa?",
      answer: "La funcionalidad Limitada del plan Starter te permite conectar una línea de WhatsApp para comunicación básica. La funcionalidad Completa en los planes Growth y Scale desbloquea todo el potencial, incluyendo automatizaciones avanzadas, campañas y una integración más profunda.",
    },
    {
      question: "¿Qué límites de IA tiene cada plan?",
      answer: "Nuestro asistente Captain AI tiene los siguientes límites de respuestas generadas al mes: Plan Starter: 250 respuestas. Plan Growth: 600 respuestas. Plan Scale: Respuestas ILIMITADAS. Si alcanzas tu límite, la IA se detendrá hasta el siguiente ciclo de facturación.",
    },
    {
      question: '¿En qué consiste el "Servicio de Agente IA Personalizado" del plan Scale?',
      answer: "Es un servicio premium donde nuestro equipo implementa un agente de IA avanzado (vía n8n) para un canal. Este agente puede realizar tareas complejas como agendar citas, consultar bases de datos o ejecutar flujos de trabajo a medida. En el plan anual, este agente se implementa en múltiples canales.",
    },
    {
      question: "¿Puedo cambiar de plan en cualquier momento?",
      answer: "Sí, puedes mejorar, degradar o cancelar tu plan en cualquier momento directamente desde tu panel de administración. Los cambios se aplicarán en el siguiente ciclo de facturación.",
    },
    {
      question: "¿Qué es el Kanban de Clientes (Beta) del plan Growth?",
      answer: "Es una vista de seguimiento visual que te permite organizar y gestionar a tus clientes como si fueran tareas en un tablero Kanban. Facilita el seguimiento de cada cliente a través de las diferentes etapas de tu proceso de venta o soporte.",
    },
    {
      question: "¿Puedo integrar KLYWO con mis herramientas actuales?",
      answer: "Sí. Todos los planes permiten integraciones básicas. Los planes Growth y Scale ofrecen integraciones más avanzadas, y el plan Scale te da acceso completo a la API para construir cualquier conexión a medida que necesites.",
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
