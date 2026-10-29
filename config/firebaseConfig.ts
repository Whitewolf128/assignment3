import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
// Replace with your actual service account file name
import serviceAccount from "../assignment3-2f09b-firebase-adminsdk-fbsvc-a98e6a6f0c.json"; // Ensure this path is correct and the file is in the right location

// Initialize the Firebase app with the service account credentials
initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

// Get a reference to the Firestore service
const db: Firestore = getFirestore();

export { db };