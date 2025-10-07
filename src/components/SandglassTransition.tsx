import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SandglassTransitionProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
  onComplete?: () => void;
}

const SandglassTransition = ({ 
  isVisible, 
  message = "Creando tu cuenta...", 
  subMessage = "Estamos preparando todo para tu plan",
  onComplete 
}: SandglassTransitionProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto-completar después de 3 segundos para dar tiempo a la animación
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="text-center space-y-8 p-8">
        {/* Contenedor principal con animación */}
        <div className="relative">
          {/* Círculo de fondo con efecto de pulso */}
          <div className={`absolute inset-0 bg-gradient-brand rounded-full opacity-20 animate-ping ${isAnimating ? 'scale-100' : 'scale-0'}`}></div>
          
          {/* Reloj de arena principal */}
          <div className="relative w-24 h-24 mx-auto bg-gradient-brand rounded-full flex items-center justify-center shadow-lg">
            <div className="sandglass">
              <div className="sandglass-top"></div>
              <div className="sandglass-bottom"></div>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="space-y-3">
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

        {/* Partículas decorativas */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-brand rounded-full animate-confetti"
                style={{
                  left: `${20 + (i * 10)}%`,
                  animationDelay: `${i * 0.3}s`,
                  top: `${30 + Math.random() * 40}%`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SandglassTransition;