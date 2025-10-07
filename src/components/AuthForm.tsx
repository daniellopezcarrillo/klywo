import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowRight, Star } from "lucide-react";
import AuthTransition from './AuthTransition';

const AuthForm = () => {
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
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
            phone_number: phoneNumber,
          },
        },
      });
      if (error) throw error;
      setMessage('¡Registro exitoso! Por favor, revisa tu correo para confirmar.');
      console.log('Sign up data:', data);
      
      // Mostrar transición antes de redirigir
      setShowTransition(true);
    } catch (err: any) {
      setError(err.message);
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransitionComplete = () => {
    if (priceId) {
      // Redirigir a pricing con el plan seleccionado
      navigate(`/?priceId=${priceId}&plan=${planName}`);
    } else {
      // No redirection, user needs to confirm email
      setShowTransition(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setMessage('¡Inicio de sesión exitoso!');
      console.log('Sign in data:', data);
      
      // Mostrar transición antes de redirigir
      setShowTransition(true);
    } catch (err: any) {
      setError(err.message);
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransitionCompleteSignIn = () => {
    if (priceId) {
      // Redirigir a pricing con el plan seleccionado
      navigate(`/?priceId=${priceId}&plan=${planName}`);
    } else {
      navigate('/landing');
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMessage('¡Sesión cerrada exitosamente!');
      console.log('Signed out.');
      navigate('/auth');
    } catch (err: any) {
      setError(err.message);
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-background to-surface flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-brand opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-lg border-border relative z-10">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            Únete a Klywo
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
                Completa tu registro para activar tu plan
              </p>
            </div>
          )}
          
          <CardDescription>
            Crea tu cuenta y comienza a gestionar tus chats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campos del formulario */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="transition-all duration-200 focus:ring-2 focus:ring-brand/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre de la Empresa</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Klywo Inc."
                className="transition-all duration-200 focus:ring-2 focus:ring-brand/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Número de Teléfono</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className="transition-all duration-200 focus:ring-2 focus:ring-brand/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                className="transition-all duration-200 focus:ring-2 focus:ring-brand/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="transition-all duration-200 focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-3">
            <Button
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 bg-gradient-brand hover:shadow-brand hover:scale-105 transition-all duration-200 group"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Registrando...' : 'Registrarse'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={handleSignIn}
              disabled={loading}
              className="flex-1 hover:bg-surface hover:border-primary transition-all duration-200 group"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </Button>
          </div>

          {/* Botón de cerrar sesión */}
          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              disabled={loading}
              className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
            </Button>
          </div>

          {/* Mensajes de estado */}
          {message && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Componente de transición */}
      <AuthTransition 
        isVisible={showTransition}
        message={message?.includes('Registro') ? '¡Registro exitoso!' : '¡Inicio de sesión exitoso!'}
        subMessage={priceId ? 'Redirigiendo a tu plan seleccionado...' : 'Preparando tu experiencia...'}
        onComplete={message?.includes('Registro') ? handleTransitionComplete : handleTransitionCompleteSignIn}
      />
    </div>
  );
};

export default AuthForm;