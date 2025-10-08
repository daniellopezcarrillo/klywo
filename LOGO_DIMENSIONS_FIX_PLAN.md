# Plan de Ajuste de Dimensiones del Logo

## Problema Actual
El logo se ve muy cuadriculado debido a que las dimensiones actuales son muy pequeñas para un logo completo. Los tamaños actuales (h-8, h-10) hacen que el logo se vea pixelado y poco profesional.

## Solución Propuesta
Ajustar las dimensiones del logo a tamaños más apropiados que permitan una mejor visualización y proporción.

## Cambios Necesarios

### 1. Header.tsx
**Línea 45-47:** Cambiar dimensiones del logo
- **Actual:** `h-8 w-auto` (scroll: `h-10`)
- **Propuesto:** `h-12 w-auto` (scroll: `h-14`)
- **Razón:** Tamaños más grandes para mejor visibilidad y profesionalismo

### 2. Footer.tsx  
**Línea 40:** Cambiar dimensiones del logo
- **Actual:** `h-10 w-auto`
- **Propuesto:** `h-12 w-auto`
- **Razón:** Consistencia con el header y mejor proporción en el footer

### 3. AuthPage.tsx
**Línea 35:** Cambiar dimensiones del logo
- **Actual:** `h-10 w-auto`
- **Propuesto:** `h-12 w-auto`
- **Razón:** Mejor proporción en la página de autenticación

### 4. AuthForm.tsx
**Línea 128:** Cambiar dimensiones del logo
- **Actual:** `h-10 w-auto`
- **Propuesto:** `h-12 w-auto`
- **Razón:** Consistencia con el resto de la aplicación

## Beneficios Esperados
- Logo más visible y profesional
- Mejor proporción visual en todos los componentes
- Eliminación de la apariencia cuadriculada
- Consistencia visual en toda la aplicación
- Mejor experiencia de usuario en dispositivos móviles

## Implementación
Los cambios son simples y consisten en modificar las clases Tailwind CSS de los elementos img en los archivos especificados.

## Verificación
Después de los cambios, se debe verificar:
- Que el logo se vea nítido y proporcional
- Que no afecte el diseño responsivo
- Que las transiciones de scroll sigan funcionando correctamente
- Que el footer mantenga su alineación visual