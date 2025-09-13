import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Bot,
  BarChart3,
  Zap,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import dashboardDark from "@/assets/dashboard-dark.jpg";

const Features = () => {
  const channels = [
    { logo: "https://cdn-icons-png.flaticon.com/512/134/134914.png", name: "Web Chat", description: "Chat en tiempo real" },
    { logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", name: "WhatsApp", description: "Mensajería WhatsApp" },
    { logo: "https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-instagram-icon-png-image_6315974.png", name: "Instagram", description: "DMs de Instagram" },
    { logo: "https://telegram.org/img/t_logo.png", name: "Telegram", description: "Bots de Telegram" },
    { logo: "https://cdn-icons-png.flaticon.com/512/134/134914.png", name: "SMS", description: "Mensajería SMS" },
    { logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_(2020).svg", name: "Gmail", description: "Soporte vía Gmail" },
  ];

  const automations = [
    {
      icon: Bot,
      title: "Auto-Reply Inteligente",
      description: "Respuestas automáticas contextuales con IA",
    },
    {
      icon: Users,
      title: "Routing Inteligente",
      description: "Asigna conversaciones al agente correcto",
    },
    {
      icon: CheckCircle,
      title: "Clasificación Automática",
      description: "Etiqueta y categoriza conversaciones",
    },
    {
      icon: Clock,
      title: "Follow-ups",
      description: "Recordatorios y seguimientos automáticos",
    },
  ];

  const analytics = [
    { metric: "CSAT", value: "4.8/5", change: "+15%" },
    { metric: "FRT", value: "2.3min", change: "-45%" },
    { metric: "Resolution", value: "92%", change: "+12%" },
    { metric: "AHT", value: "8.7min", change: "-23%" },
  ];

  return (
    <section className="py-24 bg-gradient-surface">
      <div className="container">
        {/* Omnichannel Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Un solo lugar para{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              todos los canales
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Centraliza todas las conversaciones de tus clientes en una sola bandeja de entrada.
          </p>
        </div>

        <div className="relative overflow-hidden mb-24">
          <div className="flex animate-carousel-scroll">
            {/* Duplicar los elementos para un scroll infinito */}
            {[...channels, ...channels].map((channel, index) => (
              <Card key={index} className="flex-shrink-0 w-[50%] sm:w-[33.33%] md:w-[25%] lg:w-[16.66%] text-center hover:shadow-soft transition-all duration-300 hover:-translate-y-1 mx-3">
                <CardContent className="pt-6">
                  <img src={channel.logo} alt={channel.name} className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{channel.name}</h3>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Chat Section */}
        <div className="grid lg:grid-cols-4 gap-16 items-center mb-24">
          <div className="lg:col-span-1">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Live Chat que{" "}
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                convierte
              </span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Atiende a tus clientes en tiempo real con notas de contacto, atajos rápidos 
              y segmentación inteligente. Todo desde una interfaz unificada.
            </p>
            <ul className="space-y-4">
              {[
                "Notas de contacto y historial completo",
                "Atajos y respuestas predefinidas", 
                "Etiquetas y segmentación automática",
                "Transferencias entre agentes",
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-3" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="lg:col-span-3 p-4 shadow-brand">
            <div className="space-y-2">
              <div className="h-4 bg-accent rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="rounded-lg overflow-hidden aspect-video flex items-center justify-center bg-gradient-hero">
                <img src={dashboardDark} alt="Live Chat Dashboard" className="w-full h-full object-cover" />
              </div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </Card>
        </div>

        {/* Automations Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Automatizaciones{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              inteligentes
            </span>
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Eventos → Condiciones → Acciones. Automatiza lo repetitivo y enfócate en lo importante.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {automations.map((automation, index) => (
            <Card key={index} className="text-center hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <automation.icon className="h-10 w-10 mx-auto mb-4 text-primary" />
                <CardTitle className="text-lg">{automation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{automation.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Card className="p-8 shadow-brand">
            <div className="grid grid-cols-2 gap-6">
              {analytics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mb-2">{stat.metric}</div>
                  <div className="text-sm font-medium text-success">{stat.change}</div>
                </div>
              ))}
            </div>
          </Card>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Analytics que{" "}
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                importan
              </span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Métricas de CSAT, tiempo de respuesta, resolución y más. 
              Reportes por inbox, equipo y periodos personalizables.
            </p>
            <ul className="space-y-4">
              {[
                "CSAT y métricas de satisfacción",
                "Tiempo de primera respuesta (FRT)",
                "Reportes por equipo e inbox",
                "Análisis de tendencias y patrones",
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-primary mr-3" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;