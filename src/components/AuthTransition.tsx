import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface AuthTransitionProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
  onComplete?: () => void;
}

const AuthTransition = ({ 
  isVisible, 
  message = "Creando tu cuenta...", 
  subMessage = "Estamos preparando todo para tu plan",
  onComplete 
}: AuthTransitionProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto-completar después de 2 segundos
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="text-center space-y-6 p-8">
        {/* Contenedor principal con animación */}
        <div className="relative">
          {/* Círculo de fondo animado */}
          <div className={`absolute inset-0 bg-gradient-brand rounded-full opacity-20 animate-ping ${isAnimating ? 'scale-100' : 'scale-0'}`}></div>
          
          {/* Icono principal */}
          <div className="relative w-20 h-20 mx-auto bg-gradient-brand rounded-full flex items-center justify-center shadow-lg">
            {isAnimating ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : (
              <CheckCircle className="w-10 h-10 text-white" />
            )}
          </div>
        </div>

        {/* Mensajes */}
        <div className="space-y-2">
          <h3 className={`text-xl font-semibold transition-all duration-300 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {message}
          </h3>
          <p className={`text-sm text-muted-foreground transition-all duration-300 delay-100 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {subMessage}
          </p>
        </div>

        {/* Indicador de progreso */}
        {isAnimating && (
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-brand rounded-full animate-progress"></div>
          </div>
        )}

        {/* Confeti visual (elemento decorativo) */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-brand rounded-full animate-confetti"
                style={{
                  left: `${15 + (i * 14)}%`,
                  animationDelay: `${i * 0.2}s`,
                  top: `${20 + Math.random() * 60}%`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTransition;