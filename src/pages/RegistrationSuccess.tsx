import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LogIn, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  const handleGoToAppLogin = () => {
    window.location.href = 'https://app.klywo.com/';
  };

  const handleGoToHome = () => {
    navigate('/landing'); // Navigate to the main landing page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Tu cuenta está casi lista!</CardTitle>
          <CardDescription className="text-base">
            Sigue estos pasos para acceder a tu nuevo espacio de trabajo.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-left space-y-6 p-8">
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">1</div>
                    <div>
                        <h3 className="font-semibold">Revisa tu correo electrónico</h3>
                        <p className="text-sm">Te hemos enviado un correo a la dirección que registraste. Contiene tu <strong>contraseña temporal</strong>.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">2</div>
                    <div>
                        <h3 className="font-semibold">Inicia sesión en la aplicación</h3>
                        <p className="text-sm">Usa tu email y la contraseña temporal para acceder a la plataforma de Klywo.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">3</div>
                    <div>
                        <h3 className="font-semibold">Configura tu nueva contraseña</h3>
                        <p className="text-sm">Por seguridad, la aplicación te pedirá que establezcas una nueva contraseña personal la primera vez que inicies sesión.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button variant="outline" className="w-full" onClick={handleGoToHome}>
                    <Home className="mr-2 h-4 w-4" />
                    Ir al Inicio
                </Button>
                <Button className="w-full" onClick={handleGoToAppLogin}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login con la APP
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationSuccess;
