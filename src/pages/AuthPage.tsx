import AuthDualForm from "@/components/AuthDualForm";
import { CheckCircle, Shield, Zap, Users } from "lucide-react";
import '../styles/auth-flow.css';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-background to-surface relative overflow-hidden">
      {/* Fondo decorativo con gradientes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-brand opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-brand opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 left-10 opacity-20">
        <div className="w-20 h-20 bg-gradient-brand rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-20">
        <div className="w-16 h-16 bg-primary rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="absolute top-1/3 right-20 opacity-10">
        <div className="w-12 h-12 bg-accent rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda - Beneficios y branding */}
          <div className="hidden lg:block space-y-8">
            {/* Logo y branding */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-brand rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <div className="text-white text-2xl font-bold">K</div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-brand bg-clip-text text-transparent">
                Klywo
              </h1>
              <p className="text-xl text-muted-foreground">
                La plataforma definitiva para gestionar todos tus chats
              </p>
            </div>

            {/* Beneficios principales */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 soft-shadow-hover fade-in">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-brand/10 rounded-full flex items-center justify-center bounce-slow">
                  <Shield className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Seguridad garantizada</h3>
                  <p className="text-sm text-muted-foreground">Tus datos están protegidos con encriptación de nivel empresarial</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 soft-shadow-hover fade-in">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-brand/10 rounded-full flex items-center justify-center bounce-medium">
                  <Zap className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Rápido y eficiente</h3>
                  <p className="text-sm text-muted-foreground">Gestiona todos tus canales en un solo lugar</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 soft-shadow-hover fade-in">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center bounce-fast">
                  <Users className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">1,000+ empresas confían en nosotros</h3>
                  <p className="text-sm text-muted-foreground">Únete a empresas que ya transformaron su atención al cliente</p>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm soft-shadow-hover fade-in">
                <div className="text-2xl font-bold text-brand gradient-animate">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm soft-shadow-hover fade-in">
                <div className="text-2xl font-bold text-brand gradient-animate">24/7</div>
                <div className="text-xs text-muted-foreground">Soporte</div>
              </div>
              <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm soft-shadow-hover fade-in">
                <div className="text-2xl font-bold text-brand gradient-animate">30d</div>
                <div className="text-xs text-muted-foreground">Prueba gratis</div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario de autenticación dual */}
          <div className="w-full max-w-md mx-auto">
            <AuthDualForm />
          </div>
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </div>
  );
};

export default AuthPage;
