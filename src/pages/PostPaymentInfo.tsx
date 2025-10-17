import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SandglassTransition from "@/components/SandglassTransition";
import { supabase } from "@/lib/supabaseClient";

const PostPaymentInfo = () => {
  // Form fields state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  
  // Data fetched from backend
  const [email, setEmail] = useState("");
  const [planName, setPlanName] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation(); // <-- Add useLocation hook

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      setError(null);

      try {
        // 1. Get user data from Supabase Auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("Usuario no autenticado.");

        // Pre-fill form with data from user metadata if available
        setAdminName(user.user_metadata?.full_name || '');
        setCompanyName(user.user_metadata?.company_name || '');
        setPhoneNumber(user.user_metadata?.phone_number || '');
        setEmail(user.email || '');

        // 2. Determine planName from various sources
        const sessionId = searchParams.get('session_id');
        const locationState = location.state || {};

        if (sessionId) {
          // Paid flow: Get planName from Stripe session
          const { data, error: sessionError } = await supabase.functions.invoke('get-checkout-session', {
            body: JSON.stringify({ sessionId }),
          });

          if (sessionError) throw new Error(`Error al obtener datos del pago: ${sessionError.message}`);
          
          setPlanName(data.planName || 'Plan no especificado');

        } else if (locationState.planName) {
          // Free flow (from login): Get planName from location state
          setPlanName(locationState.planName);

        } else {
          // Free flow (from new sign-up) or other cases: Get planName from URL
          const planNameFromUrl = searchParams.get('planName');
          if (planNameFromUrl) {
            setPlanName(planNameFromUrl);
          } else {
            setPlanName('Plan no especificado');
          }
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [searchParams, location.state]);

  const handleTransitionComplete = () => {
    // Redirect to the new registration success page
    navigate('/registration-success');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No se pudo obtener la sesión del usuario.");

      const webhookPayload = {
        email,
        fullName: adminName,
        companyName,
        phoneNumber,
        planName,
        accessToken: session.access_token,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: "web",
        source: "klywo-sparkle-launch-post-payment",
      };

      // Send data to your n8n webhook
      const response = await fetch("https://webhook.ainnovaoficial.com/webhook/nuevocuenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`El webhook de n8n falló: ${errorBody}`);
      }

      setShowTransition(true);

    } catch (err: any) {
      setError(err.message);
      console.error("Error submitting post-payment info:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (showTransition) {
    return (
      <SandglassTransition
        isVisible={true}
        message="¡Listo! Estamos creando tu cuenta."
        subMessage="Recibirás un correo con tu contraseña temporal para que puedas acceder. Serás redirigido en un momento."
        onComplete={handleTransitionComplete}
      />
    );
  }

  if (isFetching) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Completa tu perfil</CardTitle>
          <CardDescription>
            ¡Ya casi terminamos! Solo necesitamos un par de detalles más para configurar tu cuenta para el <span className="font-bold text-primary">{planName}</span>.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleFormSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">Tu Nombre Completo</Label>
              <Input
                id="adminName"
                type="text"
                placeholder="John Doe"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="email">Email de la cuenta</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
              />
            </div>

          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Configurando..." : "Finalizar Configuración"}
            </Button>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PostPaymentInfo;