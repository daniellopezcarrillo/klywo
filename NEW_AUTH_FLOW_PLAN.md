# Nuevo Plan de Flujo de Autenticación y Pago

## 📋 Análisis del Flujo Requerido

### Flujo Actual vs Nuevo Flujo:

#### **Flujo Actual:**
1. Pricing → AuthPage → AuthForm (mixto registro/login) → Redirección → Pricing → Pago

#### **Nuevo Flujo Requerido:**
1. Pricing → AuthPage → **Formulario de Registro Completo** (nuevos usuarios)
2. **O** → **Formulario de Login Simple** (usuarios existentes)
3. **Transición con reloj de arena** → **Redirección directa a Pago**
4. **Procesamiento de pago** → **Notificación de éxito/fracaso**

## 🎯 Objetivos del Nuevo Flujo

### 1. **Diferenciación de Formularios**
- **Registro**: Campos completos (nombre, empresa, teléfono, email, contraseña)
- **Login**: Campos simples (email, contraseña)
- **Selector visual** para cambiar entre ambos modos

### 2. **Integración con Webhook**
- **Envío de datos** a: `https://webhook.ainnovaoficial.com/webhook/nuevocuenta`
- **Variables importantes** a enviar (definirás cuáles)
- **Manejo de errores** en la petición POST

### 3. **Transición con Reloj de Arena**
- **Efecto visual** de reloj de arena durante el proceso
- **Animación atractiva** mientras se crean cuentas/procesan pagos
- **Mensajes contextuales** según el proceso

### 4. **Flujo Directo a Pago**
- **Redirección inmediata** después de autenticación
- **Integración con sistema de pago existente**
- **Notificaciones claras** de resultado del pago

## 🏗️ Arquitectura de Implementación

### 1. **Componentes a Modificar/Crear**

#### **AuthForm.tsx → Nuevo AuthDualForm.tsx**
```typescript
// Nuevo componente con dos modos
const AuthDualForm = () => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  
  return (
    <div>
      {/* Selector de modo */}
      <div className="flex space-x-4 mb-6">
        <Button onClick={() => setMode('register')} variant={mode === 'register' ? 'default' : 'outline'}>
          Crear Cuenta
        </Button>
        <Button onClick={() => setMode('login')} variant={mode === 'login' ? 'default' : 'outline'}>
          Iniciar Sesión
        </Button>
      </div>
      
      {/* Formulario de Registro (completo) */}
      {mode === 'register' && (
        <RegisterForm />
      )}
      
      {/* Formulario de Login (simple) */}
      {mode === 'login' && (
        <LoginForm />
      )}
    </div>
  );
};
```

#### **Nuevo SandglassTransition.tsx**
```typescript
// Componente de transición con reloj de arena
const SandglassTransition = ({ isVisible, onComplete }) => {
  return (
    <div className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="text-center space-y-6">
        {/* Reloj de arena animado */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-brand rounded-full flex items-center justify-center">
            <div className="sandglass">
              <div className="sandglass-top"></div>
              <div className="sandglass-bottom"></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Creando tu cuenta...</h3>
          <p className="text-sm text-muted-foreground">Por favor espera un momento</p>
        </div>
      </div>
    </div>
  );
};
```

#### **Nuevo PaymentProcessor.tsx**
```typescript
// Componente para procesar pago después de autenticación
const PaymentProcessor = ({ userData, priceId, onComplete }) => {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  
  const processPayment = async () => {
    setProcessing(true);
    setStatus('processing');
    
    // 1. Enviar datos al webhook
    await sendToWebhook(userData);
    
    // 2. Procesar pago con Stripe
    const paymentResult = await processStripePayment(priceId);
    
    // 3. Actualizar estado
    setStatus(paymentResult.success ? 'success' : 'failed');
    onComplete(paymentResult);
  };
  
  return (
    <div className="text-center space-y-4">
      {status === 'processing' && <SandglassTransition isVisible={true} />}
      {status === 'success' && <SuccessNotification />}
      {status === 'failed' && <FailedNotification />}
    </div>
  );
};
```

### 2. **Integración con Webhook**

#### **Servicio de Webhook**
```typescript
// src/services/webhookService.ts
const sendToWebhook = async (userData: any) => {
  try {
    const response = await fetch('https://webhook.ainnovaoficial.com/webhook/nuevocuenta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Variables importantes que definirás
        email: userData.email,
        fullName: userData.fullName,
        companyName: userData.companyName,
        phoneNumber: userData.phoneNumber,
        timestamp: new Date().toISOString(),
        // ... otras variables
      }),
    });
    
    if (!response.ok) {
      throw new Error('Webhook request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Webhook error:', error);
    // No bloquear el flujo, solo loggear el error
  }
};
```

### 3. **Flujo Principal Modificado**

#### **AuthPage.tsx Actualizado**
```typescript
const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-background to-surface">
      {/* Contenido existente con beneficios */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda - Beneficios (existente) */}
          <div className="hidden lg:block">
            {/* Contenido actual de beneficios */}
          </div>
          
          {/* Columna derecha - Formulario dual */}
          <div className="w-full max-w-md mx-auto">
            <AuthDualForm />
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### **Pricing.tsx Modificado**
```typescript
const Pricing = () => {
  const handleGetStarted = async (planName: string, priceId: string) => {
    // Redirigir directamente a auth con el plan
    navigate(`/auth?priceId=${priceId}&plan=${planName}`);
  };
  
  return (
    <div>
      {/* Tarjetas de planes */}
      {plans.map(plan => (
        <Card key={plan.id}>
          <Button onClick={() => handleGetStarted(plan.name, plan.priceId)}>
            Empezar
          </Button>
        </Card>
      ))}
    </div>
  );
};
```

## 🎨 Diseño Visual del Nuevo Flujo

### 1. **Selector de Modo de Autenticación**
```css
/* Estilos para el selector de modo */
.auth-mode-selector {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  backdrop-filter: blur(10px);
}

.mode-button {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
}

.mode-button.active {
  background: linear-gradient(135deg, hsl(175 100% 42%), hsl(195 100% 45%));
  color: white;
  box-shadow: 0 4px 12px rgba(23, 37, 84, 0.15);
}
```

### 2. **Reloj de Arena Animado**
```css
/* Animación de reloj de arena */
.sandglass {
  position: relative;
  width: 60px;
  height: 60px;
}

.sandglass-top,
.sandglass-bottom {
  position: absolute;
  width: 100%;
  height: 50%;
  background: linear-gradient(135deg, hsl(175 100% 42%), hsl(195 100% 45%));
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.sandglass-bottom {
  top: 50%;
  transform: rotate(180deg);
  animation: sandFlow 2s ease-in-out infinite;
}

@keyframes sandFlow {
  0%, 100% { transform: rotate(180deg) scaleY(1); }
  50% { transform: rotate(180deg) scaleY(0.8); }
}
```

### 3. **Notificaciones de Pago**
```css
/* Estilos para notificaciones */
.payment-success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-failed {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}
```

## 📋 Checklist de Implementación

### ✅ Fase 1: Formularios Diferenciados
- [ ] **Crear AuthDualForm.tsx** con selector de modo
- [ ] **Implementar RegisterForm** con campos completos
- [ ] **Implementar LoginForm** con campos simples
- [ ] **Diseño visual** del selector y transiciones

### ✅ Fase 2: Transición con Reloj de Arena
- [ ] **Crear SandglassTransition.tsx**
- [ ] **Diseñar animación CSS** del reloj de arena
- [ ] **Integrar en flujo** después de autenticación
- [ ] **Mensajes contextuales** durante el proceso

### ✅ Fase 3: Integración Webhook
- [ ] **Crear webhookService.ts**
- [ ] **Implementar función sendToWebhook**
- [ ] **Manejo de errores** en peticiones POST
- [ ] **Logging** de respuestas del webhook

### ✅ Fase 4: Procesamiento de Pago
- [ ] **Crear PaymentProcessor.tsx**
- [ ] **Integrar con sistema de pago existente**
- [ ] **Implementar notificaciones** de éxito/fracaso
- [ ] **Redirección final** según resultado

### ✅ Fase 5: Integración Completa
- [ ] **Modificar AuthPage.tsx** para usar AuthDualForm
- [ ] **Actualizar Pricing.tsx** para redirección directa
- [ ] **Probar flujo completo** desde inicio a fin
- [ ] **Optimizar rendimiento** y experiencia de usuario

## 🔧 Variables a Enviar al Webhook

Las variables importantes que se enviarán al webhook son:
```typescript
{
  email: string,           // Email del usuario
  fullName: string,        // Nombre completo
  companyName: string,     // Nombre de la empresa
  phoneNumber: string,     // Número de teléfono
  password: string,        // Contraseña (hash)
  planName: string,        // Plan seleccionado
  priceId: string,         // ID del precio
  timestamp: string,       // Fecha y hora del registro
  userAgent: string,       // User agent del navegador
  ipAddress: string,       // IP del usuario
  // ... otras variables que definas
}
```

## 🎯 Resultado Esperado

### Nuevo Flujo de Usuario:
1. **Usuario selecciona plan** en Pricing
2. **Redirige a AuthPage** con selector de modo
3. **Elige entre registro o login**
4. **Completa formulario correspondiente**
5. **Muestra transición con reloj de arena**
6. **Envía datos al webhook**
7. **Procesa pago con Stripe**
8. **Muestra notificación de resultado**
9. **Finaliza el proceso**

### Beneficios:
- **Experiencia más clara** para nuevos vs usuarios existentes
- **Flujo directo** a pago sin pasos innecesarios
- **Integración robusta** con backend externo
- **Visual atractivo** con transiciones suaves
- **Manejo adecuado** de errores y estados