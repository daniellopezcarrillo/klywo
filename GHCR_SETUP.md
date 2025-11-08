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

## Alternativa: Construir localmente en Portainer
Si prefieres no usar tokens, puedes cambiar el docker-compose.yml para que use `build: .` en lugar de la imagen de GHCR.