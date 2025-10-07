// Servicio para enviar datos al webhook externo
const WEBHOOK_URL = 'https://webhook.ainnovaoficial.com/webhook/nuevocuenta';

export interface UserData {
  email: string;
  fullName: string;
  companyName: string;
  phoneNumber: string;
  password: string;
  planName: string;
  priceId: string;
  timestamp: string;
  userAgent: string;
  ipAddress: string;
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Envía datos de usuario al webhook externo
 * @param userData Datos del usuario a enviar
 * @returns Promise con la respuesta del webhook
 */
export const sendToWebhook = async (userData: UserData): Promise<WebhookResponse> => {
  try {
    console.log('Enviando datos al webhook:', userData);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Klywo-Auth-Flow/1.0',
      },
      body: JSON.stringify({
        // Variables importantes del usuario
        email: userData.email,
        fullName: userData.fullName,
        companyName: userData.companyName,
        phoneNumber: userData.phoneNumber,
        planName: userData.planName,
        priceId: userData.priceId,
        timestamp: userData.timestamp,
        userAgent: userData.userAgent,
        ipAddress: userData.ipAddress,
        // Información adicional del sistema
        platform: 'web',
        source: 'klywo-sparkle-launch',
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    
    console.log('Webhook response:', responseData);
    
    return {
      success: true,
      message: 'Datos enviados correctamente',
      data: responseData,
    };
  } catch (error) {
    console.error('Error al enviar datos al webhook:', error);
    
    // No bloquear el flujo, solo loggear el error
    return {
      success: false,
      message: 'Error al enviar datos al webhook, pero el flujo continúa',
      data: null,
    };
  }
};

/**
 * Obtiene la IP del usuario del cliente
 * @returns Promise con la IP del usuario
 */
export const getUserIP = async (): Promise<string> => {
  try {
    // Intentar obtener IP desde un servicio externo
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error al obtener IP del usuario:', error);
    return 'unknown';
  }
};

/**
 * Obtiene información del navegador del usuario
 * @returns Información del navegador
 */
export const getUserAgent = (): string => {
  return navigator.userAgent;
};

/**
 * Formatea datos del usuario para el webhook
 * @param formData Datos del formulario
 * @param planName Nombre del plan seleccionado
 * @param priceId ID del precio
 * @returns Datos formateados para el webhook
 */
export const formatUserDataForWebhook = async (
  formData: any, 
  planName: string, 
  priceId: string
): Promise<UserData> => {
  const timestamp = new Date().toISOString();
  const userAgent = getUserAgent();
  const ipAddress = await getUserIP();

  return {
    email: formData.email || '',
    fullName: formData.fullName || '',
    companyName: formData.companyName || '',
    phoneNumber: formData.phoneNumber || '',
    password: formData.password || '',
    planName,
    priceId,
    timestamp,
    userAgent,
    ipAddress,
  };
};