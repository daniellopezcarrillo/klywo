import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Bot,
  BarChart3,
  Zap,
  Users,
  CheckCircle,
  Globe,
  GitBranch,
  LifeBuoy,
  Server,
  Database,
  Rocket
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FeaturesPage = () => {
  const communicationFeatures = [
    {
      icon: Globe,
      title: "Soporte Multicanal",
      description: "Integra correo electrónico, chat en vivo, WhatsApp, Facebook, Twitter y SMS en una sola bandeja de entrada.",
    },
    {
      icon: MessageSquare,
      title: "Conversaciones en Tiempo Real",
      description: "Comunícate en vivo con tus clientes para ofrecer respuestas rápidas y eficientes.",
    },
    {
      icon: Users,
      title: "Bandeja de Entrada Omnicanal",
      description: "Consolida mensajes de varias plataformas en una interfaz unificada para una gestión más sencilla.",
    },
  ];

  const collaborationFeatures = [
    {
      icon: Users,
      title: "Colaboración en Equipo",
      description: "Herramientas para que los miembros del equipo colaboren eficazmente, incluyendo notas privadas y asignación de conversaciones.",
    },
    {
      icon: GitBranch,
      title: "Transferencia de Chats",
      description: "Transfiere conversaciones entre agentes para asegurar que el cliente sea atendido por la persona adecuada.",
    },
    {
      icon: CheckCircle,
      title: "Equipos Internos",
      description: "Crea equipos internos para gestionar y escalar el soporte al cliente de manera organizada.",
    },
  ];

  const automationFeatures = [
    {
      icon: Bot,
      title: "Integración con Bots",
      description: "Automatiza respuestas a consultas comunes y la interacción inicial con el cliente para una disponibilidad 24/7.",
    },
    {
      icon: Zap,
      title: "Flujos de Trabajo Automatizados",
      description: "Reduce el esfuerzo manual y aumenta la eficiencia mediante la automatización de tareas repetitivas.",
    },
    {
      icon: Rocket,
      title: "Enrutamiento Inteligente",
      description: "Asigna conversaciones automáticamente al agente o equipo más adecuado según reglas predefinidas.",
    },
  ];

  const analyticsFeatures = [
    {
      icon: BarChart3,
      title: "Análisis e Informes",
      description: "Obtén información valiosa sobre las interacciones con los clientes a través de análisis y reportes detallados.",
    },
    {
      icon: Server,
      title: "Informes de Conversación",
      description: "Analiza el volumen de conversaciones, los tiempos de respuesta y la satisfacción del cliente.",
    },
    {
      icon: Database,
      title: "Informes de Etiquetas",
      description: "Clasifica y analiza las conversaciones por temas o categorías para identificar tendencias.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onFormTrigger={() => {}} />
      <main className="py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Todas las herramientas que necesitas en un solo lugar
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Una plataforma completa de soporte al cliente para mejorar la eficiencia y la satisfacción del cliente.
            </p>
          </div>

          <Section title="Comunicación Unificada" features={communicationFeatures} />
          <Section title="Colaboración Eficiente" features={collaborationFeatures} />
          <Section title="Automatización Inteligente" features={automationFeatures} />
          <Section title="Análisis y Reportes" features={analyticsFeatures} />

        </div>
      </main>
      <Footer />
    </div>
  );
};

const Section = ({ title, features }) => (
  <div className="mb-24">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
        {title}
      </h2>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <Card key={index} className="text-center hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <feature.icon className="h-10 w-10 mx-auto mb-4 text-primary" />
            <CardTitle className="text-lg">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FeaturesPage;