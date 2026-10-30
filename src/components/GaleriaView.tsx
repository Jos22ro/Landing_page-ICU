import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { useBrand } from '../context/BrandContext';
import { GalleryImage } from '../types';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║  ★ GALERÍA — VISTA ADMIN ★ (Sidebar → tab "Galería")                    ║
   ╠══════════════════════════════════════════════════════════════════════════╣
   ║  ESTA es la vista en la que se SUBEN/ELIMINAN imágenes. Es distinta de   ║
   ║  la galería PÚBLICA de la landing (esa está en LandingPublicaView.tsx,   ║
   ║  secciones "Momentos Destacados" y "Momentos ICU").                      ║
   ║                                                                          ║
   ║  FLUJO COMPLETO al subir una imagen:                                    ║
   ║   1. botón "Agregar Imagen" → input type=file oculto.                    ║
   ║   2. handleFileSelect → FileReader la convierte a base64 (dataURL).      ║
   ║   3. Se abre el modal con Cropper (react-easy-crop) recorte 4:3 con      ║
   ║      zoom. Al confirmar, getCroppedImg dibuja el recorte en un <canvas>  ║
   ║      y exporta JPEG calidad 0.9 (esto reduce el tamaño).                 ║
   ║   4. handleSave → addGalleryImage(...) del contexto (BrandContext)       ║
   ║      → se guarda en localStorage clave 'icu_gallery_images' y la         ║
   ║      galería pública de la landing se actualiza sola.                    ║
   ║                                                                          ║
   ║  ⚠ PREGUNTAS TÍPICAS DE PRUEBA y DÓNDE TOCAR:                            ║
   ║   · "el recorte es 4:3, quiero 16:9" → Cropper aspect={4 / 3} (abajo)     ║
   ║     y aclarar que la landing recorta por CSS con object-cover igual.     ║
   ║   · "otra categoría" → el select del modal + el type de useState acá     ║
   ║     + el array de tabs en LandingPublicaView + el campo del types.ts.    ║
   ║   · "no guarda si no hay título" → validación en handleSave.             ║
   ║   · Riesgo conocido: son base64 en localStorage (cupo ~5MB del           ║
   ║     navegador). Funciona normal con pocas imágenes; con muchas hay       ║
   ║     que pasar a guardar en un servidor (de eso avisar si preguntan).     ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

export const GaleriaView: React.FC = () => {
  const { galleryImages, addGalleryImage, deleteGalleryImage, showToast } = useBrand();

  // ── ★ESTADO DEL MODAL★: imageSrc = imagen elegida (base64); crop/zoom =
  // posición del recorte; croppedAreaPixels = recorte exacto en píxeles que
  // llenó Cropper; title/location/category = los textos del formulario.   */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'galas' | 'lanzamientos' | 'corporativo'>('galas');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: unknown, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // ── ★1★ ELECCIÓN DEL ARCHIVO (input type=file oculto del header) ──────
  // Valida que sea imagen; reader.readAsDataURL la pasa a base64 para
  // poder mostrarla en el Cropper. Si piden más formatos o límite de
  // tamaño: acá en los checks de file.type / file.size.
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setTitle('');
      setLocation('');
      setCategory('galas');
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ── ★2★ RECORTAR (4:3) ────────────────────────────────────────────────
  // Se llama al confirmar en el modal: dibuja en un <canvas> la porción
  // recortada (pixelCrop) y la exporta como JPEG calidad 0.9. El 4:3 lo
  // fija el prop aspect={4 / 3} del <Cropper> en el modal (abajo).
  const getCroppedImg = async (imageSrc: string, pixelCrop: CropArea): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  // ── ★3★ GUARDAR ───────────────────────────────────────────────────────
  // Valida recorte + título → recorta (getCroppedImg) → addGalleryImage
  // (contexto → localStorage → la landing pública se re-pinta sola).
  // "Solo quiero cambiar la validación": es el if de title.trim().
  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      showToast('Por favor selecciona y recorta una imagen');
      return;
    }

    if (!title.trim()) {
      showToast('Por favor ingresa un título para la imagen');
      return;
    }

    setIsProcessing(true);

    try {
      const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);

      addGalleryImage({
        title: title.trim(),
        location: location.trim() || 'Ubicación no especificada',
        category,
        url: croppedImageUrl,
      });

      setIsModalOpen(false);
      setImageSrc(null);
      setTitle('');
      setLocation('');
      setCategory('galas');
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      showToast('Error al procesar la imagen. Intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImageSrc(null);
    setTitle('');
    setLocation('');
    setCategory('galas');
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // ── ★4★ ELIMINAR ──────────────────────────────────────────────────────
  // window.confirm = confirmación nativa del navegador. deleteGalleryImage
  // la saca del contexto + localStorage (BrandContext, línea ~1052).
  // Si piden un modal lindo de confirmación, reemplazar window.confirm acá.
  const handleDelete = (id: string, imageTitle: string) => {
    if (window.confirm(`¿Estás seguro de eliminar '${imageTitle}' de la galería?`)) {
      deleteGalleryImage(id);
    }
  };

  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#5d172d] mb-2 tracking-tight">
            Galería
          </h2>
          <p className="text-lg text-[#665d54] max-w-2xl leading-relaxed">
            Administra las imágenes de la galería pública. Las imágenes se recortan automáticamente a formato 4:3.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 bg-[#5d172d] text-white rounded-lg font-bold shadow-cta hover:opacity-90 active:scale-95 transition-all text-sm shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
          Agregar Imagen
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </header>

      {/* ★GRID ADMIN★: si está vacía muestra el panel "Agregá tu primera
          imagen" (el empty-state de abajo); si no, el grid de tarjetas con
          botón ELIMINAR al hover. Título/ubicación/categoría son los dados
          de alta en el modal. TIP: no hay botón "editar" (updateGalleryImage
          existe en el contexto pero esta vista no lo usa todavía). */}
      {galleryImages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-[#d9c1c4] mb-4">photo_library</span>
          <h3 className="text-xl font-bold text-[#5d172d] mb-2">No hay imágenes en la galería</h3>
          <p className="text-[#665d54] mb-6">
            Agrega tu primera imagen para mostrar en la galería pública.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5d172d] text-white rounded-lg font-bold shadow-cta hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
            Agregar Primera Imagen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="group bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(img.id, img.title)}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Eliminar imagen"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <span
                  className="inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mb-2"
                  style={{ backgroundColor: '#7a2e43', color: '#ff9ab0' }}
                >
                  {img.category}
                </span>
                <h3 className="font-bold text-[#1c1c18] text-base mb-1 truncate">{img.title}</h3>
                <p className="text-sm text-[#665d54] truncate">{img.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ╔═ ★MODAL SUBIR + RECORTAR (react-easy-crop) ★════════════════════╗
          ║ aspect={4 / 3}  ← SI piden cambiar el recorte, ES ACÁ.           ║
          ║ zoom 1..3 (range de abajo). showGrid = la cuadraditos guía.       ║
          ║ Título obligatorio (el botón Guardar queda deshabilitado sin     ║
          ║ él, ver disabled en el footer). Al guardar vuelve al paso ★3★.  ║
          ╚══════════════════════════════════════════════════════════════════╝ */}
      {/* Modal con Cropper */}
      {isModalOpen && imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={handleCancel} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(38,33,28,0.14)]">
              <h3 className="text-xl font-bold text-[#5d172d]">Agregar Imagen a Galería</h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-[#f7f3ec] rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Cropper */}
              <div className="relative h-80 bg-[#1c1c18] rounded-lg overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="rect"
                  showGrid={true}
                />
              </div>

              {/* Zoom Control */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#665d54] shrink-0">Zoom:</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-2 bg-[#e6e2db] rounded-lg appearance-none cursor-pointer accent-[#7a2e43]"
                />
                <span className="text-sm font-bold text-[#5d172d] w-12 text-right">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#5d172d] mb-1.5">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Gala Benéfica 'Aura'"
                    className="w-full px-4 py-2.5 border border-[rgba(38,33,28,0.14)] rounded-lg focus:outline-none focus:border-[#7a2e43] transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#5d172d] mb-1.5">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Palacio de Velázquez"
                    className="w-full px-4 py-2.5 border border-[rgba(38,33,28,0.14)] rounded-lg focus:outline-none focus:border-[#7a2e43] transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#5d172d] mb-1.5">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'galas' | 'lanzamientos' | 'corporativo')}
                  className="w-full px-4 py-2.5 border border-[rgba(38,33,28,0.14)] rounded-lg focus:outline-none focus:border-[#7a2e43] transition-colors text-sm bg-white"
                >
                  <option value="galas">Galas</option>
                  <option value="lanzamientos">Lanzamientos</option>
                  <option value="corporativo">Corporativo</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[rgba(38,33,28,0.14)] bg-[#f7f3ec]">
              <button
                onClick={handleCancel}
                disabled={isProcessing}
                className="px-6 py-2.5 border border-[rgba(38,33,28,0.14)] rounded-lg font-bold text-sm hover:bg-white transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isProcessing || !title.trim()}
                className="px-6 py-2.5 bg-[#5d172d] text-white rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    Guardar Imagen
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}
