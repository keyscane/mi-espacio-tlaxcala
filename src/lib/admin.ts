import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore';

// 1. Obtener perfil del tallerista autenticado
export async function obtenerPerfilTallerista(uid: string) {
  const ref = doc(db, 'talleristas', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// 2. Actualizar o crear perfil de tallerista
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
}

// 3. Obtener solo los productos pertenecientes a este tallerista
export async function getProductosPorTallerista(uid: string) {
  const q = query(collection(db, "productos"), where("id_tallerista", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// 4. Crear un nuevo producto
export async function crearProducto(producto: {
  id_tallerista: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
}) {
  await addDoc(collection(db, 'productos'), {
    ...producto,
    en_stock: true,
    fecha_actualizacion: Timestamp.now()
  });
}

// 5. Cambiar estado de stock (En stock / Agotado)
export async function cambiarStockProducto(idProducto: string, enStockActual: boolean) {
  const ref = doc(db, 'productos', idProducto);
  await updateDoc(ref, { en_stock: !enStockActual });
}

// 6. Eliminar un producto
export async function eliminarProducto(idProducto: string) {
  const ref = doc(db, 'productos', idProducto);
  await deleteDoc(ref);
}