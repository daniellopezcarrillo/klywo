import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Testimonials = () => {
  const [api, setApi] = useState<any>(); // Estado para la API del carrusel
  const testimonials = [
    {
      name: "María González",
      role: "Customer Success Manager",
      company: "TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c70a?w=150&h=150&fit=crop&crop=face",
      content: "Klywo redujo nuestro tiempo de primera respuesta en un 45%. La automatización de IA es impresionante.",
      rating: 5,
      metrics: "-45% FRT",
    },
    {
      name: "Carlos Ruiz",
      role: "CEO",
      company: "StartupXYZ",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "La unificación de canales nos permitió escalar el soporte sin contratar más personal. ROI inmediato.",
      rating: 5,
      metrics: "+32% CSAT",
    },
    {
      name: "Ana López",
      role: "Head of Support",
      company: "E-commerce Pro",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Las integraciones con nuestro CRM y herramientas existentes fueron perfectas. Setup en menos de una semana.",
      rating: 5,
      metrics: "-23% AHT",
    },
    {
      name: "Javier Fernández",
      role: "Director de Operaciones",
      company: "Logistics Solutions",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      content: "La capacidad de gestionar todas las comunicaciones desde una única plataforma ha optimizado nuestros procesos logísticos.",
      rating: 5,
      metrics: "+40% Eficiencia",
    },
    {
      name: "Laura Jiménez",
      role: "Gerente de Marketing",
      company: "Creative Agency",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      content: "Implementamos Klywo para nuestras campañas y el engagement con los clientes ha mejorado notablemente.",
      rating: 5,
      metrics: "+25% Engagement",
    },
    {
      name: "David Moreno",
      role: "Fundador",
      company: "Innovatech",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
      content: "El soporte técnico es excepcional. Nos ayudaron a personalizar la solución para nuestras necesidades específicas.",
      rating: 5,
      metrics: "Soporte 24/7",
    },
    {
      name: "Sofía Vargas",
      role: "Gerente de Ventas",
      company: "Global Connect",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      content: "Klywo ha transformado nuestra estrategia de ventas. La comunicación omnicanal es clave para cerrar más tratos.",
      rating: 5,
      metrics: "+18% Conversión",
    },
    {
      name: "Roberto Castro",
      role: "Especialista en Soporte",
      company: "HelpDesk Solutions",
      avatar: "https://images.unsplash.com/photo-1507003211169-e69fe1c5a39f?w=150&h=150&fit=crop&crop=face",
      content: "La interfaz es muy intuitiva y fácil de usar. Mis agentes se adaptaron rápidamente y son más productivos.",
      rating: 4,
      metrics: "+30% Productividad",
    },
    {
      name: "Elena Morales",
      role: "Directora de Experiencia de Cliente",
      company: "ClientFirst",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      content: "La personalización que ofrece Klywo nos permite brindar una experiencia única a cada cliente. ¡Impresionante!",
      rating: 5,
      metrics: "+22% Satisfacción",
    },
  ];

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Lo que dicen{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              nuestros clientes
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Únete a cientos de empresas que ya transformaron su atención al cliente.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi} // Pasar la función setApi al carrusel
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-start p-6">
                      <div className="flex mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="text-foreground mb-6 leading-relaxed flex-grow">
                        "{testimonial.content}"
                      </blockquote>
                      <div className="mb-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success/10 text-success">
                          {testimonial.metrics}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <div className="font-semibold text-foreground">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role} at {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
          {[
            { value: "500+", label: "Empresas confían en nosotros" },
            { value: "99.9%", label: "Uptime garantizado" },
            { value: "45%", label: "Reducción promedio en FRT" },
            { value: "24/7", label: "Soporte disponible" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;