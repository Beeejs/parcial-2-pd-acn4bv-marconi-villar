import admin from 'firebase-admin';

// Configura la cuenta de servicio
const serviceAccount = {
  "type": process.env.TYPE_FIREBASE_SERVICE,
  "project_id": process.env.PROJECT_ID_FIREBASE_SERVICE,
  "private_key_id": process.env.PRIVATE_KEY_ID_FIREBASE_SERVICE,
  "private_key": process.env.PRIVATE_KEY_FIREBASE_SERVICE.replace(/\\n/g, '\n'),
  "client_email":  process.env.CLIENT_EMAIL_FIREBASE_SERVICE,
  "client_id": process.env.CLIENT_ID_FIREBASE_SERVICE,
  "auth_uri": process.env.AUTH_URI_FIREBASE_SERVICE,
  "token_uri": process.env.TOKEN_URI_FIREBASE_SERVICE,
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_FIREBASE_SERVICE,
  "client_x509_cert_url": process.env.CLIENT_CERT_URL_FIREBASE_SERVICE,
  "universe_domain": process.env.UNIVERSE_DOMAIN_FIREBASE_SERVICE
}

// Inicializa la aplicación de Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Exporta la instancia de Firestore para usarla en tus controladores
export const db = admin.firestore();
export { admin };