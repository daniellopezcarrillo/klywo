import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, CreditCard, Loader2, AlertCircle } from "lucide-react";
import SandglassTransition from './SandglassTransition';
import '../styles/auth-flow.css';

interface PaymentProcessorProps {
  userData?: any;
  priceId?: string;
  planName?: string;
}

interface PaymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
}

const PaymentProcessor = ({ 
  userData, 
  priceId, 
  planName 
}: PaymentProcessorProps) => {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed' | 'error'>('idle');
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Obtener parámetros de la URL
  const urlPriceId = searchParams.get('priceId');
  const urlPlanName = searchParams.get('plan');

  const finalPriceId = priceId || urlPriceId;
  const finalPlanName = planName || urlPlanName;

  const processPayment = async () => {
    if (!finalPriceId || !finalPlanName) {
      setError('No se ha especificado un plan para procesar el pago');
      setStatus('error');
      return;
    }

    setProcessing(true);
    setStatus('processing');
    setError(null);

    try {
      // Simular procesamiento de pago (aquí iría la integración real con Stripe)
      console.log('Procesando pago para el plan:', finalPlanName);
      console.log('Price ID:', finalPriceId);
      console.log('Usuario:', userData);

      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular resultado aleatorio para demostración
      const isSuccess = Math.random() > 0.2; // 80% de éxito

      if (isSuccess) {
        // Simular pago exitoso
        const result: PaymentResult = {
          success: true,
          message: 'Pago procesado exitosamente',
          transactionId: `txn_${Date.now()}`,
          amount: 29.99, // Esto debería venir de la API de Stripe
          currency: 'USD'
        };

        setPaymentResult(result);
        setStatus('success');
        
        // Enviar notificación de éxito al webhook
        await sendPaymentSuccessToWebhook(result);
        
      } else {
        // Simular pago fallido
        const result: PaymentResult = {
          success: false,
          message: 'El pago fue rechazado por el banco',
          transactionId: `txn_${Date.now()}_failed`
        };

        setPaymentResult(result);
        setStatus('failed');
        
        // Enviar notificación de fracaso al webhook
        await sendPaymentFailureToWebhook(result);
      }

    } catch (err: any) {
      console.error('Error en procesamiento de pago:', err);
      setError(err.message || 'Error al procesar el pago');
      setStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  const sendPaymentSuccessToWebhook = async (result: PaymentResult) => {
    try {
      const webhookData = {
        ...userData,
        planName: finalPlanName,
        priceId: finalPriceId,
        paymentStatus: 'success',
        transactionId: result.transactionId,
        amount: result.amount,
        currency: result.currency,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('https://webhook.ainnovaoficial.com/webhook/pago-exitoso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      console.log('Notificación de pago exitoso enviada:', response.ok);
    } catch (error) {
      console.error('Error al enviar notificación de pago exitoso:', error);
    }
  };

  const sendPaymentFailureToWebhook = async (result: PaymentResult) => {
    try {
      const webhookData = {
        ...userData,
        planName: finalPlanName,
        priceId: finalPriceId,
        paymentStatus: 'failed',
        transactionId: result.transactionId,
        message: result.message,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('https://webhook.ainnovaoficial.com/webhook/pago-fallido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      console.log('Notificación de pago fallido enviada:', response.ok);
    } catch (error) {
      console.error('Error al enviar notificación de pago fallido:', error);
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setPaymentResult(null);
    setError(null);
  };

  const handleComplete = () => {
    if (status === 'success') {
      // Redirigir al dashboard o página de bienvenida
      navigate('/dashboard');
    } else {
      // Redirigir a pricing para seleccionar otro plan
      navigate('/');
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return 'Procesando tu pago...';
      case 'success':
        return '¡Pago exitoso!';
      case 'failed':
        return 'Pago rechazado';
      case 'error':
        return 'Error en el procesamiento';
      default:
        return 'Preparando procesamiento de pago';
    }
  };

  const getStatusSubMessage = () => {
    switch (status) {
      case 'processing':
        return 'Por favor espera un momento mientras procesamos tu pago';
      case 'success':
        return 'Tu cuenta ha sido activada correctamente';
      case 'failed':
        return 'Por favor intenta con otro método de pago o tarjeta';
      case 'error':
        return 'Ha ocurrido un error, por favor intenta de nuevo';
      default:
        return 'Estamos listos para procesar tu pago';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-background to-surface flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-brand opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-lg border-border relative z-10 card-enter">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            Procesando Pago
          </CardTitle>
          
          {/* Información del plan */}
          <div className="bg-gradient-to-r from-brand/10 to-primary/10 rounded-lg p-3 border border-brand/20">
            <div className="flex items-center justify-center gap-2 text-brand">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium text-sm">
                Plan: {finalPlanName}
              </span>
            </div>
          </div>
          
          <CardDescription>
            {getStatusMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estado del pago */}
          <div className="text-center space-y-4">
            {/* Icono de estado */}
            <div className="relative">
              {status === 'processing' && (
                <div className="w-20 h-20 mx-auto bg-gradient-brand rounded-full flex items-center justify-center shadow-lg pulse-effect">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              )}
              
              {status === 'success' && (
                <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              )}
              
              {status === 'failed' && (
                <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
              )}
              
              {status === 'error' && (
                <div className="w-20 h-20 mx-auto bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            {/* Mensajes de estado */}
            <div className="space-y-2 fade-in">
              <h3 className="text-lg font-semibold">{getStatusMessage()}</h3>
              <p className="text-sm text-muted-foreground">{getStatusSubMessage()}</p>
            </div>

            {/* Detalles del pago (solo si es exitoso) */}
            {status === 'success' && paymentResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-left fade-in">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">ID de Transacción:</span>
                    <span className="font-mono text-green-800">{paymentResult.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Monto:</span>
                    <span className="font-semibold text-green-800">
                      ${paymentResult.amount?.toFixed(2)} {paymentResult.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Plan:</span>
                    <span className="font-semibold text-green-800">{finalPlanName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left fade-in">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            {status === 'processing' && (
              <Button disabled className="w-full form-loading">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Procesando...
              </Button>
            )}
            
            {status === 'success' && (
              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-brand hover:shadow-brand hover:scale-105 transition-all duration-200 btn-hover-effect"
              >
                Ir a Mi Dashboard
              </Button>
            )}
            
            {status === 'failed' && (
              <div className="space-y-3">
                <Button
                  onClick={processPayment}
                  className="w-full bg-gradient-brand hover:shadow-brand hover:scale-105 transition-all duration-200 btn-hover-effect"
                >
                  Intentar de Nuevo
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="w-full soft-shadow-hover"
                >
                  Cambiar Método de Pago
                </Button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-3">
                <Button
                  onClick={processPayment}
                  className="w-full bg-gradient-brand hover:shadow-brand hover:scale-105 transition-all duration-200 btn-hover-effect"
                >
                  Intentar de Nuevo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full soft-shadow-hover"
                >
                  Volver a Planes
                </Button>
              </div>
            )}
            
            {status === 'idle' && (
              <Button
                onClick={processPayment}
                disabled={processing}
                className="w-full bg-gradient-brand hover:shadow-brand hover:scale-105 transition-all duration-200 btn-hover-effect"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Procesar Pago'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transición con reloj de arena durante procesamiento */}
      <SandglassTransition
        isVisible={status === 'processing'}
        message="Procesando tu pago..."
        subMessage="Por favor espera un momento"
      />
    </div>
  );
};

export default PaymentProcessor;