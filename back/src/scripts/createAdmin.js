/* Dotenv */
import 'dotenv/config';
import { admin, db } from "../database/firebase.js";

const NAME_COLLECTION = "users";

async function createInitialAdmin() {
  try {
    const adminEmail = process.env.INIT_ADMIN_EMAIL;
    const adminPassword = process.env.INIT_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("Faltan INIT_ADMIN_EMAIL o INIT_ADMIN_PASSWORD en el .env");
      process.exit(1);
    }

    // Buscar si ya existe algun admin
    const existingAdmins = await db
      .collection(NAME_COLLECTION)
      .where("rol", "==", "admin")
      .limit(1)
      .get();

    if (!existingAdmins.empty) {
      console.log("Ya existe un administrador, no se crea otro.");
      const doc = existingAdmins.docs[0];
      console.log("Admin existente:", doc.id, doc.data());
      process.exit(0);
    }

    console.log("No hay admins en Firestore, creando admin inicial...");

    // Crear usuario o traerlo si ya existe en Auth
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(adminEmail);
      console.log("Usuario encontrado en Auth:", userRecord.uid);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        console.log("No existe en Auth, creando...");
        userRecord = await admin.auth().createUser({
          email: adminEmail,
          password: adminPassword,
          emailVerified: true,
        });
      } else {
        throw err;
      }
    }

    const uid = userRecord.uid;

    // Custom claims
    await admin.auth().setCustomUserClaims(uid, { rol: "admin" });

    // Crear documento en Firestore
    await db.collection(NAME_COLLECTION).doc(uid).set(
      {
        rol: "admin",
        email: adminEmail,
        createdAt: new Date(),
      },
      { merge: true }
    );

    console.log("Admin inicial creado correctamente", { uid, email: adminEmail });
    process.exit(0);

  } catch (error) {
    console.error("Error creando admin inicial:", error);
    process.exit(1);
  }
}

createInitialAdmin();
