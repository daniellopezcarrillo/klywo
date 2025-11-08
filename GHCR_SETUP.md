# Configuración de GitHub Container Registry para Portainer

## Problema
Portainer no puede acceder a la imagen `ghcr.io/daniellopezcarrillo/klywo-sparkle-launch:latest` porque requiere autenticación.

## Solución: Crear Personal Access Token (PAT)

### Paso 1: Crear PAT en GitHub
1. Ve a tu perfil de GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Haz clic en "Generate new token" → "Generate new token (classic)"
3. Configura el token:
   - **Note**: "Portainer Access"
   - **Expiration**: Elige un período razonable (90 días)
   - **Scopes**: Marca solo `read:packages`
4. Haz clic en "Generate token"
5. **¡COPIA EL TOKEN INMEDIATAMENTE! No volverás a verlo.

### Paso 2: Configurar en Portainer
1. En tu VPS, abre Portainer
2. Ve a "Registries" en el menú lateral
3. Haz clic en "+ Add registry"
4. Configura:
   - **Name**: "GitHub Container Registry"
   - **URL**: `https://ghcr.io`
   - **Username**: `daniellopezcarrillo` (tu usuario de GitHub)
   - **Password**: El PAT que acabas de crear
5. Haz clic en "Create registry"

### Paso 3: Actualizar el stack
1. Ve a tu stack "klywo-sparkle-web"
2. Haz clic en "Edit stack"
3. En la sección "Services", asegúrate de que la imagen sea:
   ```
   ghcr.io/daniellopezcarrillo/klywo-sparkle-launch:latest
   ```
4. Guarda los cambios y actualiza el stack

### Paso 4: Verificar despliegue
Las réplicas deberían cambiar de 0/1 a 1/1 cuando la imagen se descargue correctamente.

## Solución Definitiva: Construir localmente en Portainer

**Recomendado**: Dado que el acceso a GHCR puede ser problemático en Portainer, la solución más confiable es construir la imagen localmente.

### Pasos para construir localmente:

1. **Edita tu stack en Portainer:**
   - Ve a tu stack "klywo-sparkle-web"
   - Haz clic en "Edit stack"

2. **Cambia la configuración del servicio:**
   - En la sección "Services", asegúrate de que esté configurado como:
     ```yaml
     klywo-sparkle-web:
       build: .
       image: klywo-sparkle-launch:latest
     ```

3. **Guarda y actualiza el stack:**
   - Portainer construirá la imagen automáticamente usando tu Dockerfile
   - Las réplicas deberían cambiar a 1/1 cuando termine

### Ventajas de construir localmente:
- ✅ No requiere tokens de autenticación
- ✅ Construcción optimizada con cache de capas
- ✅ Control total sobre el proceso de build
- ✅ Acceso a todos los archivos y dependencias locales

### Flujo de trabajo recomendado:
1. **Desarrollo local**: Haz cambios y haz `git push`
2. **GitHub Actions**: Construye y sube a GHCR (para respaldo)
3. **Despliegue en Portainer**: Construye localmente usando `build: .`

### Si aún así quieres usar GHCR:
Si prefieres usar la imagen remota después de configurar el PAT, puedes cambiar temporalmente a:
```yaml
image: ghcr.io/daniellopezcarrillo/klywo-sparkle-launch:latest
```
Pero la construcción local es más confiable para producción.