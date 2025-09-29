import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- Reemplaza estos valores ---
const SUPABASE_URL = 'https://gvxljxkmlckefbbjenwq.supabase.co'; // Tu URL de Supabase
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eGxqeGttbGNrZWZiYmplbndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjkxMzEsImV4cCI6MjA2ODkwNTEzMX0.uC9pPr7gFUmiJ4_vITz18P0gUhxtVc1mrspqo0Y50Mg'; // Tu clave anónima

const TEST_USER_EMAIL = 'daniellopezcarrillo491@gmail.com'; // El correo electrónico del usuario de prueba
const TEST_USER_PASSWORD = '2203043138';
// --------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTest() {
  console.log('Iniciando sesión con el usuario de prueba...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  if (authError) {
    console.error('Error al iniciar sesión:', authError.message);
    return;
  }

  if (!authData.session) {
    console.error('No se pudo obtener la sesión. Revisa las credenciales.');
    return;
  }

  console.log('¡Sesión iniciada con éxito!');
  console.log('Llamando a la función createStripeCustomer...');

  const { data, error } = await supabase.functions.invoke('createStripeCustomer', {
    body: { userId: authData.user.id },
  });

  if (error) {
    console.error('Error al llamar a la función:', error);
  } else {
    console.log('Respuesta exitosa de la función:', data);
  }

  // Cerrar sesión
  await supabase.auth.signOut();
  console.log('Sesión cerrada.');
}

runTest();
