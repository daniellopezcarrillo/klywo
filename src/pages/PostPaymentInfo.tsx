
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SandglassTransition from "@/components/SandglassTransition";
import { supabase } from "@/lib/supabaseClient";

const PostPaymentInfo = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, planName, priceId } = location.state || {};

  const handleTransitionComplete = () => {
    window.location.href = 'https://app.klywo.com/';
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("No se pudo obtener la sesión del usuario.");
      }

      const webhookPayload = {
        email,
        fullName: adminName,
        companyName,
        phoneNumber,
        planName,
        priceId,
        accessToken: session.access_token, // Use the secure access token
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ipAddress: "", // IP address would ideally be captured on the backend
        platform: "web",
        source: "klywo-sparkle-launch-post-payment",
      };

      // Send data to your webhook
      const response = await fetch("https://webhook.ainnovaoficial.com/webhook/nuevocuenta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        throw new Error("Webhook call failed");
      }

      // Show transition instead of navigating directly
      setShowTransition(true);

    } catch (error) {
      console.error("Error submitting post-payment info:", error);
      // Handle error, maybe show a message to the user
    } finally {
      setIsLoading(false);
    }
  };

  if (showTransition) {
    return (
      <SandglassTransition
        isVisible={true}
        message="Estamos creando tu cuenta y te hemos enviado un correo electrónico."
        subMessage="Sigue las instrucciones para continuar."
        onComplete={handleTransitionComplete}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Completa tu perfil</CardTitle>
          <CardDescription>
            ¡Ya casi terminamos! Solo necesitamos un par de detalles más para configurar tu cuenta.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleFormSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre de la Empresa</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Tu Empresa S.A. de C.V."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Número de Teléfono</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+52 1 55 1234 5678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminName">Nombre del Administrador</Label>
              <Input
                id="adminName"
                type="text"
                placeholder="John Doe"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
              />
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Configurando..." : "Finalizar Configuración"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PostPaymentInfo;
