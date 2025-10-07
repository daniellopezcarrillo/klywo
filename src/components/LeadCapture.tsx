import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LeadCapture = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://webhook.ainnovaoficial.com/webhook/4802c6c9-c167-4163-bf6e-4d145ddb114e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "¡Demo solicitada!",
          description: "Nos pondremos en contacto contigo en las próximas 24 horas.",
        });
        setFormData({ name: "", email: "", company: "", teamSize: "" });
      } else {
        throw new Error("Error al enviar el formulario");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al solicitar la demo. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Demo personalizada en vivo",
    "Configuración gratuita",
    "Migración de datos incluida",
    "Soporte en español",
  ];

  return (
    <section id="demo" className="py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left side - Benefits */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Descubre el poder de{" "}
              <span className="text-primary">
                Klywo
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Agenda una demo personalizada y ve cómo Klywo puede transformar 
              la atención al cliente de tu empresa.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-3" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-4 text-sm text-muted-foreground">
              <p>✓ Sin compromiso inicial</p>
              <p>✓ Demo en tu idioma y timezone</p>
              <p>✓ Casos de uso específicos para tu industria</p>
            </div>
          </div>

          {/* Right side - Form */}
          <Card className="shadow-brand">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Solicita tu demo gratuita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email corporativo *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="nombre@empresa.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Tamaño del equipo</Label>
                  <Select
                    value={formData.teamSize}
                    onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 personas</SelectItem>
                      <SelectItem value="6-20">6-20 personas</SelectItem>
                      <SelectItem value="21-50">21-50 personas</SelectItem>
                      <SelectItem value="51-200">51-200 personas</SelectItem>
                      <SelectItem value="200+">Más de 200 personas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Solicitar Demo"}
                  {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Al solicitar la demo, aceptas nuestros{" "}
                  <a href="#" className="text-primary hover:underline">
                    términos de servicio
                  </a>{" "}
                  y{" "}
                  <a href="#" className="text-primary hover:underline">
                    política de privacidad
                  </a>
                  .
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LeadCapture;