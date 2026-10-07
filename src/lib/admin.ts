import { db } from './firebase';
import type { CategoriaRecova, TipoProducto } from './firebase';
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

export type ProductoAdmin = {
  id: string;
  id_tallerista: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  en_stock: boolean;
  tipo?: TipoProducto;
  productor?: string;
  categoria?: CategoriaRecova;
};

export type TallerAdmin = {
  id: string;
  id_tallerista: string;
  titulo: string;
  descripcion: string;
  fechas_horario: string;
  imagen_url: string;
  activo: boolean;
};
// 1. Obtener perfil del tallerista autenticado
export async function obtenerPerfilTallerista(uid: string) {
  const ref = doc(db, 'talleristas', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// 2. Actualizar o crear perfil de tallerista
export async function actualizarPerfilTallerista(
  uid: string, 
  data: { nombre: string; bio: string; contacto: string; whatsapp_ventas: string; foto_url?: string }
) {
  const ref = doc(db, 'talleristas', uid);
  await setDoc(ref, {
    ...data,
    whatsapp_ventas: data.whatsapp_ventas.trim(),
    activo: true
  }, { merge: true });
}

// 3. Obtener solo los productos pertenecientes a este tallerista
export async function getProductosPorTallerista(uid: string): Promise<ProductoAdmin[]> {
  const q = query(collection(db, "productos"), where("id_tallerista", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ProductoAdmin[];
}

// 4. Crear un nuevo producto
export async function crearProducto(producto: {
  id_tallerista: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  tipo: TipoProducto;
  productor?: string;
  categoria?: CategoriaRecova;
}) {
  await addDoc(collection(db, 'productos'), {
    ...producto,
    en_stock: true,
    fecha_actualizacion: Timestamp.now()
  });
}

// Actualizar el tipo del producto para uno de los dos catálogos
export async function actualizarTipoProducto(idProducto: string, tipo: TipoProducto) {
  const ref = doc(db, 'productos', idProducto);
  await updateDoc(ref, { tipo });
}

// Comprueba el marcador de rol administradores/{uid} para mostrar la gestión exclusiva de La Recova.
export async function esAdministrador(uid: string): Promise<boolean> {
  const snapshot = await getDoc(doc(db, 'administradores', uid));
  return snapshot.exists() && snapshot.data().activo === true;
}

// 5. Cambiar estado de stock
export async function cambiarStockProducto(idProducto: string, enStockActual: boolean) {
  const ref = doc(db, 'productos', idProducto);
  await updateDoc(ref, { en_stock: !enStockActual });
}

// 6. Eliminar un producto
export async function eliminarProducto(idProducto: string) {
  const ref = doc(db, 'productos', idProducto);
  await deleteDoc(ref);
}

// 7. Obtener todos los talleres activos para la portada
export async function getTalleresActivos(): Promise<TallerAdmin[]> {
  const q = query(
    collection(db, 'talleres'),
    where('activo', '==', true)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  })) as TallerAdmin[];
}

// 8. Obtener talleres de un instructor específico
export async function getTalleresPorTallerista(uid: string): Promise<TallerAdmin[]> {
  const q = query(
    collection(db, 'talleres'),
    where('id_tallerista', '==', uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  })) as TallerAdmin[];
}

// 9. Crear un nuevo taller
export async function crearTaller(taller: {
  id_tallerista: string;
  titulo: string;
  descripcion: string;
  fechas_horario: string;
  imagen_url: string;
}) {
  await addDoc(collection(db, 'talleres'), {
    ...taller,
    activo: true,
    fecha_creacion: Timestamp.now()
  });
}

// 10. Eliminar un taller
export async function eliminarTaller(idTaller: string) {
  const ref = doc(db, 'talleres', idTaller);
  await deleteDoc(ref);
}
