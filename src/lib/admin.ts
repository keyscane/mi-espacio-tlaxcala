import { db } from './firebase';
import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { subirImagenCloudinary } from './cloudinary';

const BUILD_HOOK_URL = import.meta.env.PUBLIC_BUILD_HOOK_URL;

// Dispara la re-compilación en Netlify (Sección 6)
export async function dispararBuildHook() {
  try {
    const res = await fetch(BUILD_HOOK_URL, {
      method: 'POST',
      body: JSON.stringify({ reason: 'Actualización desde Panel Talleristas' })
    });
    console.log('Build Hook disparado correctamente con estatus:', res.status);
  } catch (err) {
    console.error('Error al notificar al servicio de hosting:', err);
  }
}

// Guarda un nuevo producto en Firestore (Sección 5)
export async function crearProductoP2P(
  idTallerista: string,
  titulo: string,
  descripcion: string,
  precio: number,
  imagenArchivo: File
) {
  const imagenUrl = await subirImagenCloudinary(imagenArchivo);

  await addDoc(collection(db, 'productos'), {
    id_tallerista: idTallerista,
    titulo: titulo.trim(),
    descripcion: descripcion.substring(0, 250),
    precio: Number(precio),
    imagen_url: imagenUrl,
    en_stock: true,
    fecha_actualizacion: Timestamp.now()
  });

  await dispararBuildHook();
}

// Actualiza el perfil y WhatsApp del instructor (Sección 3)
export async function actualizarPerfilTallerista(
  uid: string, 
  data: { nombre: string; bio: string; contacto: string; whatsapp_ventas: string }
) {
  const ref = doc(db, 'talleristas', uid);
  await setDoc(ref, {
    ...data,
    whatsapp_ventas: data.whatsapp_ventas.trim(),
    activo: true
  }, { merge: true });

  await dispararBuildHook();
}