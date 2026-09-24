import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Interfaces TypeScript
export interface Tallerista {
  id: string;
  nombre: string;
  bio: string;
  contacto: string;
  whatsapp_ventas: string;
  foto_url?: string;
  activo: boolean;
}

export interface Producto {
  id: string;
  id_tallerista: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen_url: string; // URL alojada en Cloudinary CDN
  en_stock: boolean;
  fecha_actualizacion: Timestamp;
}

// Consultas para tiempo de compilación (SSG)
export async function getTalleristasActivos(): Promise<Tallerista[]> {
  const q = query(collection(db, "talleristas"), where("activo", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tallerista));
}

export async function getProductosEnStock(): Promise<Producto[]> {
  const q = query(
    collection(db, "productos"), 
    where("en_stock", "==", true),
    orderBy("fecha_actualizacion", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Producto));
}
