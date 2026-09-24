const CLOUDINARY_CLOUD_NAME = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = 'tlaxcala_preset';

/**
 * Sube una imagen a Cloudinary y devuelve la URL HTTPS segura
 */
export async function subirImagenCloudinary(archivo: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', archivo);
  formData.append('upload_preset', UPLOAD_PRESET);

  const respuesta = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!respuesta.ok) {
    throw new Error('Error al subir la imagen a Cloudinary');
  }

  const data = await respuesta.json();
  return data.secure_url; // URL pública HTTPS devuelta por Cloudinary CDN
}