import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowRight, Star, User, Mail, Lock, Building, Phone } from "lucide-react";
import SandglassTransition from './SandglassTransition';
import { sendToWebhook, formatUserDataForWebhook } from '../services/webhookService';
import '../styles/auth-flow.css';

const AuthDualForm = () => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const priceId = searchParams.get('priceId');
  const planName = searchParams.get('plan');

  const handleSignUp = async () => {
    // Validar campos requeridos para registro
    if (!fullName || !email || !password) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      // Intentar crear usuario en Supabase
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/payment?priceId=${priceId}&plan=${planName}`,
          data: {
            full_name: fullName,
            company_name: companyName,
            phone_number: phoneNumber,
          },
        },
      });
      
      if (supabaseError) {
        throw supabaseError;
      }
      
      setMessage('¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta y poder continuar con el pago.');
      console.log('User data:', data);
      
    } catch (err: any) {
      setError(err.message);
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Por favor ingresa tu email y contraseña');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      // Iniciar sesión en Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      if (data.user) {
        const { data: subscriptions, error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .select('stripe_customer_id')
          .eq('user_id', data.user.id);

        if (subscriptionError) {
          throw subscriptionError;
        }

        if (!subscriptions || subscriptions.length === 0 || !subscriptions[0].stripe_customer_id) {
          // If not, create a new Stripe customer
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const jwt = session.access_token;
            const createStripeCustomerResponse = await fetch('https://gvxljxkmlckefbbjenwq.supabase.co/functions/v1/createStripeCustomer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
                'apiKey': import.meta.env.VITE_SUPABASE_ANON_KEY
              },
              body: JSON.stringify({ userId: data.user.id }),
            });
            const stripeCustomer = await createStripeCustomerResponse.json();
            console.log('Stripe customer created:', stripeCustomer);
            console.log('Subscription object after creating customer:', await supabase.from('user_subscriptions').select('*').eq('user_id', data.user.id).single());
          }
        }
      }

      // On success:
      setMessage('¡Inicio de sesión exitoso!');
      console.log('Sign in data:', data);
      setShowTransition(true); // Show transition only on success

      // Formatear datos para el webhook (login)
      const userData = await formatUserDataForWebhook(
        { email, password },
        planName || 'Login',
        priceId || ''
      );
      
      // Enviar datos al webhook
      const webhookResponse = await sendToWebhook(userData);
      
      if (webhookResponse.success) {
        console.log('Datos de login enviados al webhook exitosamente');
      } else {
        console.warn('Error al enviar datos de login al webhook:', webhookResponse.message);
      }
      
    } catch (err: any) {
      setError(err.message);
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransitionComplete = () => {
    // Redirigir directamente al formulario de pago
    if (priceId) {
      navigate(`/payment?priceId=${priceId}&plan=${planName}`);
    } else {
      navigate('/payment');
    }
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setCompanyName('');
    setPhoneNumber('');
    setMessage(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* Selector de modo */}
      <div className="flex space-x-2 mb-6 bg-muted/50 p-1 rounded-lg">
        <Button
          onClick={() => {
            setMode('register');
            clearForm();
          }}
          variant={mode === 'register' ? 'default' : 'ghost'}
          className="flex-1 relative overflow-hidden"
          size="sm"
        >
          <span className="flex items-center justify-center gap-2">
            <User className="w-4 h-4" />
            Crear Cuenta
          </span>
          {mode === 'register' && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          )}
        </Button>
        <Button
          onClick={() => {
            setMode('login');
            clearForm();
          }}
          variant={mode === 'login' ? 'default' : 'ghost'}
          className="flex-1 relative overflow-hidden"
          size="sm"
        >
          <span className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Iniciar Sesión
          </span>
          {mode === 'login' && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          )}
        </Button>
      </div>

      <Card className="w-full shadow-lg border-border">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            {mode === 'register' ? 'Únete a Klywo' : 'Bienvenido de Vuelta'}
          </CardTitle>
          
          {/* Mensaje contextual si viene de un plan específico */}
          {planName && (
            <div className="bg-gradient-to-r from-brand/10 to-primary/10 rounded-lg p-3 border border-brand/20">
              <div className="flex items-center justify-center gap-2 text-brand">
                <Star className="w-4 h-4" />
                <span className="font-medium text-sm">
                  Plan seleccionado: {planName}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Completa el proceso para activar tu plan
              </p>
            </div>
          )}
          
          <CardDescription>
            {mode === 'register' 
              ? 'Crea tu cuenta y comienza a gestionar tus chats' 
              : 'Ingresa tus credenciales para continuar'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulario de Registro */}
          {mode === 'register' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombre Completo *
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="transition-all duration-200 focus:ring-2 focus:ring-brand/20"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Nombre de la Empresa
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Klywo Inc."
                  className="transition-all duration-200 focus:ring-2 focus:ring-brand/20"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Número de Teléfono
                </Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="transition-all duration-200 focus:ring-2 focus:ring-brand/20"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Campos comunes para ambos modos */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                className="transition-all duration-200 focus:ring-2 focus:ring-brand/20"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Contraseña *
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="transition-all duration-200 focus:ring-2 focus:ring-brand/20"
                disabled={loading}
              />
            </div>
          </div>

          {/* Botón de acción */}
          <Button
            onClick={mode === 'register' ? handleSignUp : handleSignIn}
            disabled={loading}
            className="w-full bg-gradient-brand hover:shadow-brand hover:scale-105 transition-all duration-200 group relative overflow-hidden"
            size="lg"
          >
            <span className="flex items-center justify-center gap-2 relative z-10">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  {mode === 'register' ? 'Crear Cuenta' : 'Iniciar Sesión'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </Button>
        </CardContent>
      </Card>

      {/* Mensajes de estado */}
      {message && (
        <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm text-center flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      {/* Componente de transición con reloj de arena */}
      <SandglassTransition 
        isVisible={showTransition}
        message={mode === 'register' ? 'Creando tu cuenta...' : 'Iniciando sesión...'}
        subMessage={priceId ? 'Redirigiendo a tu plan seleccionado...' : 'Preparando tu experiencia...'}
        onComplete={handleTransitionComplete}
      />
    </div>
  );
};

export default AuthDualForm;