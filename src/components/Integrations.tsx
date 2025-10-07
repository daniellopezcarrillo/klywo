import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Webhook,
  Workflow,
  MessageSquare,
  Brain,
  Slack,
  Database,
  ArrowRight,
} from "lucide-react";

const Integrations = () => {
  const integrations = [
    {
      icon: Workflow,
      name: "N8n & Make",
      description: "Automatizaciones workflow complejas",
      category: "Automation",
    },
    {
      icon: MessageSquare,
      name: "Typebot",
      description: "Chatbots conversacionales avanzados",
      category: "Chatbots",
    },
    {
      icon: Brain,
      name: "OpenAI",
      description: "IA generativa y procesamiento de lenguaje",
      category: "AI",
    },
    {
      icon: Slack,
      name: "Slack & Teams",
      description: "Notificaciones y colaboración",
      category: "Communication",
    },
    {
      icon: Database,
      name: "CRM Systems",
      description: "Sincronización de datos de clientes",
      category: "Data",
    },
    {
      icon: Webhook,
      name: "Webhooks & API",
      description: "Integraciones personalizadas",
      category: "Development",
    },
  ];

  return (
    <section className="py-24">
      <div className="container">
        {/* Integrations */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Stack{" "}
            <span className="text-primary">
              flexible
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conecta con las herramientas que ya usas. API abierta y webhooks para integraciones personalizadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {integrations.map((integration, index) => (
            <Card key={index} className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <integration.icon className="h-8 w-8 text-primary" />
                  <span className="text-xs px-2 py-1 bg-accent rounded-full text-accent-foreground">
                    {integration.category}
                  </span>
                </div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{integration.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;