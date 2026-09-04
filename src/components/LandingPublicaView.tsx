import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { validateEmail, validateNotEmpty, validatePeriod, validateMinLength } from '../utils/validation';

export const LandingPublicaView: React.FC = () => {
  const { colors, typography, showToast, navigate, themeMode, toggleThemeMode } = useBrand();

  // SISTEMA ESTRICTO DE 5 ESCALAS TIPOGRÁFICAS (MÁXIMO 5 ESCALAS)
  // Escala 1: Titular Principal Hero (H1 / Display)
  const h1Size = typography.headlineSize;
  // Escala 2: Títulos de Sección (H2 / Section Titles)
  const h2Size = typography.h2Size || Math.max(1, Math.round(typography.headlineSize * 0.67));
  // Escala 3: Subtítulos, Logotipo y Títulos de Tarjetas (H3 / Lead / Logo)
  const leadSize = typography.leadSize;
  // Escala 4: Párrafos, Inputs de Formulario y Botones de Acción (Body / Form / CTA)
  const bodySize = typography.bodySize;
  // Escala 5: UI Auxiliar, Navegación, Badges, Etiquetas y Metadatos (Small / Micro / Labels)
  const smallSize = typography.smallSize || Math.max(1, Math.round(typography.bodySize * 0.75));

  const getContrastColor = (_hexBg?: string): string => {
    return colors.bg;
  };

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipoEvento: 'Gala Benéfica',
    fechaDesde: '',
    fechaHasta: '',
    mensaje: '',
  });

  const [formTouched, setFormTouched] = useState({
    nombre: false,
    email: false,
    tipoEvento: false,
    fechaDesde: false,
    fechaHasta: false,
    mensaje: false,
  });

  // Validaciones estrictas
  const nombreError = validateNotEmpty(formData.nombre, 'El nombre').error;
  const emailError = validateEmail(formData.email).error;
  const fechaDesdeError = validateNotEmpty(formData.fechaDesde, "La fecha 'Desde'").error;
  const fechaHastaError = validateNotEmpty(formData.fechaHasta, "La fecha 'Hasta'").error;
  const periodError = validatePeriod(formData.fechaDesde, formData.fechaHasta, {
    allowFuture: true,
    maxSpanYears: 100,
  }).error;
  const mensajeEmptyError = validateNotEmpty(formData.mensaje, 'Los detalles de la propuesta').error;
  const mensajeLengthError = validateMinLength(formData.mensaje, 10, 'Los detalles de la propuesta').error;
  const mensajeError = mensajeEmptyError || mensajeLengthError;

  const hasFormErrors = Boolean(
    nombreError || emailError || fechaDesdeError || fechaHastaError || periodError || mensajeError
  );

  const [selectedGalleryTab, setSelectedGalleryTab] = useState('todos');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const galleryImages = [
    {
      id: 1,
      category: 'galas',
      title: "Gala Benéfica 'Aura'",
      location: 'Palacio de Velázquez',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 2,
      category: 'lanzamientos',
      title: 'Lanzamiento Colección PV25',
      location: 'Galería de Arte Vanguardia',
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 3,
      category: 'corporativo',
      title: 'Cumbre Tech Latam',
      location: 'Centro de Convenciones',
      url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 4,
      category: 'galas',
      title: 'Noche de Premios Elipsis',
      location: 'Teatro Real',
      url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 5,
      category: 'lanzamientos',
      title: 'Showroom Automotriz Luxury',
      location: 'Pavillion One',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 6,
      category: 'corporativo',
      title: 'Foro Internacional de Innovación',
      location: 'Hotel Grand Hyatt',
      url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched({
      nombre: true,
      email: true,
      tipoEvento: true,
      fechaDesde: true,
      fechaHasta: true,
      mensaje: true,
    });

    if (hasFormErrors) {
      showToast('Por favor corrige los errores: ningún campo puede estar vacío, el correo debe tener @ y la fecha desde no puede ser mayor que hasta.');
      return;
    }

    showToast(`¡Gracias ${formData.nombre}! Tu propuesta ha sido enviada a ICU.`);
    setFormData({
      nombre: '',
      email: '',
      tipoEvento: 'Gala Benéfica',
      fechaDesde: '',
      fechaHasta: '',
      mensaje: '',
    });
    setFormTouched({
      nombre: false,
      email: false,
      tipoEvento: false,
      fechaDesde: false,
      fechaHasta: false,
      mensaje: false,
    });
  };

  const filteredGallery =
    selectedGalleryTab === 'todos'
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedGalleryTab);

  return (
    <div
      className="landing-page-scope min-h-screen font-serif transition-colors duration-300"
      style={{
        backgroundColor: colors.bg,
        color: colors.textMain,
        fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
      }}
    >
      {/* Sticky Top Navbar */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md transition-colors"
        style={{
          backgroundColor: `${colors.surface}EE`,
          borderColor: colors.neutral,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="font-bold tracking-tight"
              style={{
                color: colors.accent,
                fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                fontSize: `${leadSize}px`,
              }}
            >
              ICU
            </span>
            <span
              className="uppercase tracking-widest px-2.5 py-0.5 rounded-full border opacity-80 font-sans font-semibold"
              style={{
                borderColor: colors.neutral,
                color: colors.textMain,
                fontSize: `${smallSize}px`,
              }}
            >
              Agencia de Eventos
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-sans font-medium" style={{ color: colors.textMain, fontSize: `${smallSize}px` }}>
            <a href="#inicio" className="hover:opacity-75 transition-opacity">
              Inicio
            </a>
            <a href="#servicios" className="hover:opacity-75 transition-opacity">
              Servicios
            </a>
            <a href="#galeria" className="hover:opacity-75 transition-opacity">
              Galería
            </a>
            <a href="#contacto" className="hover:opacity-75 transition-opacity">
              Contacto
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleThemeMode}
              type="button"
              className="px-3 py-2 rounded-lg border transition-all hover:opacity-90 flex items-center gap-2 cursor-pointer shadow-xs"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.neutral,
                color: colors.textMain,
                fontSize: `${smallSize}px`,
              }}
              title={themeMode === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              <span
                className="material-symbols-outlined transition-all"
                style={{
                  color: colors.accent,
                  fontSize: `${Math.max(14, Math.round(smallSize * 1.35))}px`,
                }}
              >
                {themeMode === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              <span
                className="hidden sm:inline font-sans font-bold uppercase tracking-wider"
                style={{ fontSize: `${smallSize}px` }}
              >
                {themeMode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </button>
            <a
              href="#contacto"
              className="px-5 py-2.5 rounded font-sans font-bold uppercase tracking-wider shadow-cta transition-transform hover:scale-105"
              style={{
                backgroundColor: colors.accent,
                color: getContrastColor(colors.accent),
                fontSize: `${smallSize}px`,
              }}
            >
              Solicitar Cotización
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="inicio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-8">
        <div
          className="inline-block px-4 py-1.5 rounded-full border font-sans font-bold uppercase tracking-widest"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.neutral,
            color: colors.textMain,
            fontSize: `${smallSize}px`,
          }}
        >
          Experiencias de Alto Impacto
        </div>

        <h1
          className="max-w-4xl mx-auto font-bold tracking-tight leading-tight"
          style={{ fontSize: `${h1Size}px`, color: colors.textMain }}
        >
          Creamos eventos memorables con diseño y dirección de arte excepcional.
        </h1>

        <p
          className="max-w-2xl mx-auto opacity-80 leading-relaxed"
          style={{ fontSize: `${leadSize}px`, color: colors.textMain }}
        >
          Desde galas benéficas hasta lanzamientos de marcas globales. Nos encargamos de cada detalle
          para transformar tu visión en una experiencia inolvidable.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4 font-sans">
          <a
            href="#contacto"
            className="px-8 py-4 rounded-lg font-bold tracking-wider uppercase shadow-cta transition-all hover:opacity-90 flex items-center gap-2"
            style={{
              backgroundColor: colors.accent,
              color: getContrastColor(colors.accent),
              fontSize: `${bodySize}px`,
            }}
          >
            <span>Planifica tu Evento</span>
            <span className="material-symbols-outlined" style={{ fontSize: `${bodySize}px` }}>arrow_forward</span>
          </a>
          <a
            href="#galeria"
            className="px-8 py-4 rounded-lg font-bold tracking-wider uppercase border transition-colors hover:opacity-80"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.neutral,
              color: colors.textMain,
              fontSize: `${bodySize}px`,
            }}
          >
            Explorar Portfolio
          </a>
        </div>
      </header>

      {/* Value Proposition */}
      <section
        className="py-16 border-y transition-colors"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.neutral,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="p-8 rounded-xl border shadow-1 space-y-4"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.neutral,
              }}
            >
              <span className="material-symbols-outlined" style={{ color: colors.accent, fontSize: `${h2Size}px` }}>
                palette
              </span>
              <h3 className="font-bold font-serif" style={{ fontSize: `${leadSize}px`, color: colors.textMain }}>
                Dirección de Arte Cromática
              </h3>
              <p className="opacity-80 leading-relaxed font-sans" style={{ fontSize: `${bodySize}px`, color: colors.textMain }}>
                Paletas conceptuales a medida que alinean la atmósfera del espacio con los valores más profundos de tu marca.
              </p>
            </div>

            <div
              className="p-8 rounded-xl border shadow-1 space-y-4"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.neutral,
              }}
            >
              <span className="material-symbols-outlined" style={{ color: colors.accent, fontSize: `${h2Size}px` }}>
                architecture
              </span>
              <h3 className="font-bold font-serif" style={{ fontSize: `${leadSize}px`, color: colors.textMain }}>
                Producción Meticulosa
              </h3>
              <p className="opacity-80 leading-relaxed font-sans" style={{ fontSize: `${bodySize}px`, color: colors.textMain }}>
                Cronogramas rigurosos, coordinación de proveedores de élite y montajes sin contratiempos.
              </p>
            </div>

            <div
              className="p-8 rounded-xl border shadow-1 space-y-4"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.neutral,
              }}
            >
              <span className="material-symbols-outlined" style={{ color: colors.accent, fontSize: `${h2Size}px` }}>
                verified
              </span>
              <h3 className="font-bold font-serif" style={{ fontSize: `${leadSize}px`, color: colors.textMain }}>
                Experiencias Exclusivas
              </h3>
              <p className="opacity-80 leading-relaxed font-sans" style={{ fontSize: `${bodySize}px`, color: colors.textMain }}>
                Curaduría gastronómica, iluminación sensorial y escenografías diseñadas para impresionar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="font-bold font-serif" style={{ color: colors.accent, fontSize: `${h2Size}px` }}>
            Nuestros Servicios
          </h2>
          <p className="font-sans opacity-85 leading-relaxed" style={{ fontSize: `${leadSize}px`, color: colors.textMain }}>
            Soluciones integrales diseñadas para materializar tu visión con precisión editorial y elegancia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Coordinación */}
          <div
            className="rounded-xl shadow-1 border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.neutral,
            }}
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80"
                alt="El Día del Evento"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span
                  className="uppercase font-sans tracking-widest font-semibold block"
                  style={{ color: colors.accent, fontSize: `${smallSize}px` }}
                >
                  01 Coordinación
                </span>
                <h3 className="font-bold font-serif" style={{ fontSize: `${leadSize}px`, color: colors.textMain }}>
                  El Día del Evento
                </h3>
                <p className="font-sans opacity-80 leading-relaxed pt-1" style={{ fontSize: `${bodySize}px`, color: colors.textMain }}>
                  Ejecución impecable. Nos aseguramos de que todo fluya según lo planeado mientras tú disfrutas como un invitado más.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="#contacto"
                  className="inline-flex items-center gap-1.5 font-bold font-sans transition-all hover:gap-2"
                  style={{ color: colors.accent, fontSize: `${smallSize}px` }}
                >
                  <span>Saber más</span>
                  <span className="material-symbols-outlined" style={{ fontSize: `${smallSize}px` }}>arrow_forward</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Planificación */}
          <div
            className="rounded-xl shadow-1 border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.neutral,
            }}
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
                alt="Diseño Integral"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span
                  className="uppercase font-sans tracking-widest font-semibold block"
                  style={{ color: colors.accent, fontSize: `${smallSize}px` }}
                >
                  02 Planificación
                </span>
                <h3 className="font-bold font-serif" style={{ fontSize: `${leadSize}px`, color: colors.textMain }}>
                  Diseño Integral
                </h3>
                <p className="font-sans opacity-80 leading-relaxed pt-1" style={{ fontSize: `${bodySize}px`, color: colors.textMain }}>
                  Desde el concepto hasta el último detalle. Seleccionamos y gestionamos a los mejores proveedores para tu evento.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="#contacto"
                  className="inline-flex items-center gap-1.5 font-bold font-sans transition-all hover:gap-2"
                  style={{ color: colors.accent, fontSize: `${smallSize}px` }}
                >
                  <span>Saber más</span>
                  <span className="material-symbols-outlined" style={{ fontSize: `${smallSize}px` }}>arrow_forward</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Diseño */}
          <div
            className="rounded-xl shadow-1 border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.neutral,
            }}
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
                alt="Ambientación Visual"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span
                  className="uppercase font-sans tracking-widest font-semibold block"
                  style={{ color: colors.accent, fontSize: `${smallSize}px` }}
                >
                  03 Diseño
                </span>
                <h3 className="font-bold font-serif" style={{ fontSize: `${leadSize}px`, color: colors.textMain }}>
                  Ambientación Visual
                </h3>
                <p className="font-sans opacity-80 leading-relaxed pt-1" style={{ fontSize: `${bodySize}px`, color: colors.textMain }}>
                  Creamos atmósferas únicas con una estética minimalista y editorial. Espacios que comunican elegancia y propósito.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="#contacto"
                  className="inline-flex items-center gap-1.5 font-bold font-sans transition-all hover:gap-2"
                  style={{ color: colors.accent, fontSize: `${smallSize}px` }}
                >
                  <span>Saber más</span>
                  <span className="material-symbols-outlined" style={{ fontSize: `${smallSize}px` }}>arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        id="galeria"
        className="py-20 border-t transition-colors"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.neutral,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span
                className="font-sans uppercase tracking-widest opacity-75 block font-semibold"
                style={{ color: colors.accent, fontSize: `${smallSize}px` }}
              >
                Portfolio de Eventos
              </span>
              <h2 className="font-bold mt-1 font-serif" style={{ fontSize: `${h2Size}px`, color: colors.textMain }}>
                Momentos ICU
              </h2>
            </div>

            {/* Gallery Tabs */}
            <div
              className="flex font-sans font-bold uppercase tracking-wider p-1 rounded-lg self-start border"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.neutral,
                fontSize: `${smallSize}px`,
              }}
            >
              {['todos', 'galas', 'lanzamientos', 'corporativo'].map((tab) => {
                const isActive = selectedGalleryTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedGalleryTab(tab)}
                    className="px-4 py-2 rounded-md transition-all"
                    style={{
                      backgroundColor: isActive ? colors.accent : 'transparent',
                      color: isActive ? getContrastColor(colors.accent) : colors.textMain,
                      opacity: isActive ? 1 : 0.8,
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {filteredGallery.map((img) => (
              <div
                key={img.id}
                onClick={() => setLightboxImg(img.url)}
                className="group relative h-80 rounded-xl overflow-hidden cursor-pointer shadow-1 border"
                style={{ borderColor: colors.neutral }}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 transition-opacity"
                  style={{
                    background: `linear-gradient(to top, ${colors.surface}FA 0%, ${colors.surface}C0 50%, transparent 100%)`,
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1.5">
                  <span
                    className="uppercase font-bold tracking-widest px-2 py-0.5 rounded inline-block"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.bg,
                      fontSize: `${smallSize}px`,
                    }}
                  >
                    {img.category}
                  </span>
                  <h3 className="font-bold font-serif block" style={{ fontSize: `${leadSize}px`, color: colors.textMain }}>{img.title}</h3>
                  <p className="font-sans opacity-85" style={{ color: colors.textMain, fontSize: `${smallSize}px` }}>{img.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 text-white bg-black/60 p-2 rounded-full hover:bg-black"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <img src={lightboxImg} alt="Preview" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* Contact Form Section */}
      <section id="contacto" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
        <div
          className="rounded-2xl p-8 sm:p-12 shadow-1 border space-y-8"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.neutral,
          }}
        >
          <div className="text-center space-y-3">
            <span className="font-bold uppercase tracking-widest block" style={{ color: colors.accent, fontSize: `${smallSize}px` }}>
              Comienza la Conversación
            </span>
            <h2 className="font-bold font-serif" style={{ fontSize: `${h2Size}px`, color: colors.textMain }}>
              Reserva tu Fecha
            </h2>
            <p className="max-w-md mx-auto opacity-80" style={{ fontSize: `${leadSize}px`, color: colors.textMain }}>
              Cuéntanos sobre tu próximo evento y nuestro equipo creativo estructurará una propuesta personalizada.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold uppercase tracking-wider mb-2 flex items-center justify-between" style={{ color: colors.textMain, fontSize: `${smallSize}px` }}>
                  <span>Nombre Completo *</span>
                  {formTouched.nombre && nombreError && (
                    <span className="text-rose-600 font-bold normal-case text-xs">{nombreError}</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre o empresa"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  onBlur={() => setFormTouched((p) => ({ ...p, nombre: true }))}
                  className={`w-full rounded-lg p-3 border focus:outline-none transition-all ${
                    formTouched.nombre && nombreError ? 'border-rose-500 ring-1 ring-rose-500' : ''
                  }`}
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: formTouched.nombre && nombreError ? '#e11d48' : colors.neutral,
                    color: colors.textMain,
                    fontSize: `${bodySize}px`,
                  }}
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-2 flex items-center justify-between" style={{ color: colors.textMain, fontSize: `${smallSize}px` }}>
                  <span>Correo Electrónico (con @) *</span>
                  {formTouched.email && emailError && (
                    <span className="text-rose-600 font-bold normal-case text-xs">{emailError}</span>
                  )}
                </label>
                <input
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onBlur={() => setFormTouched((p) => ({ ...p, email: true }))}
                  className={`w-full rounded-lg p-3 border focus:outline-none transition-all ${
                    formTouched.email && emailError ? 'border-rose-500 ring-1 ring-rose-500' : ''
                  }`}
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: formTouched.email && emailError ? '#e11d48' : colors.neutral,
                    color: colors.textMain,
                    fontSize: `${bodySize}px`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block font-bold uppercase tracking-wider mb-2" style={{ color: colors.textMain, fontSize: `${smallSize}px` }}>
                  Tipo de Evento *
                </label>
                <select
                  value={formData.tipoEvento}
                  onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
                  className="w-full rounded-lg p-3 border focus:outline-none"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.neutral,
                    color: colors.textMain,
                    fontSize: `${bodySize}px`,
                  }}
                >
                  <option value="Gala Benéfica" style={{ backgroundColor: colors.bg, color: colors.textMain, fontSize: `${bodySize}px` }}>Gala Benéfica</option>
                  <option value="Lanzamiento de Producto" style={{ backgroundColor: colors.bg, color: colors.textMain, fontSize: `${bodySize}px` }}>Lanzamiento de Producto</option>
                  <option value="Cumbre Corporativa" style={{ backgroundColor: colors.bg, color: colors.textMain, fontSize: `${bodySize}px` }}>Cumbre Corporativa</option>
                  <option value="Celebración Privada" style={{ backgroundColor: colors.bg, color: colors.textMain, fontSize: `${bodySize}px` }}>Celebración Privada</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-2 flex items-center justify-between" style={{ color: colors.textMain, fontSize: `${smallSize}px` }}>
                  <span>Fecha Desde *</span>
                  {formTouched.fechaDesde && fechaDesdeError && (
                    <span className="text-rose-600 font-bold normal-case text-xs">Requerido</span>
                  )}
                </label>
                <input
                  type="date"
                  value={formData.fechaDesde}
                  onChange={(e) => setFormData({ ...formData, fechaDesde: e.target.value })}
                  onBlur={() => setFormTouched((p) => ({ ...p, fechaDesde: true }))}
                  className={`w-full rounded-lg p-3 border focus:outline-none transition-all ${
                    (formTouched.fechaDesde && fechaDesdeError) || ((formTouched.fechaDesde || formTouched.fechaHasta) && periodError)
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : ''
                  }`}
                  style={{
                    backgroundColor: colors.bg,
                    borderColor:
                      (formTouched.fechaDesde && fechaDesdeError) || ((formTouched.fechaDesde || formTouched.fechaHasta) && periodError)
                        ? '#e11d48'
                        : colors.neutral,
                    color: colors.textMain,
                    fontSize: `${bodySize}px`,
                  }}
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-2 flex items-center justify-between" style={{ color: colors.textMain, fontSize: `${smallSize}px` }}>
                  <span>Fecha Hasta *</span>
                  {formTouched.fechaHasta && fechaHastaError && (
                    <span className="text-rose-600 font-bold normal-case text-xs">Requerido</span>
                  )}
                </label>
                <input
                  type="date"
                  value={formData.fechaHasta}
                  onChange={(e) => setFormData({ ...formData, fechaHasta: e.target.value })}
                  onBlur={() => setFormTouched((p) => ({ ...p, fechaHasta: true }))}
                  className={`w-full rounded-lg p-3 border focus:outline-none transition-all ${
                    (formTouched.fechaHasta && fechaHastaError) || ((formTouched.fechaDesde || formTouched.fechaHasta) && periodError)
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : ''
                  }`}
                  style={{
                    backgroundColor: colors.bg,
                    borderColor:
                      (formTouched.fechaHasta && fechaHastaError) || ((formTouched.fechaDesde || formTouched.fechaHasta) && periodError)
                        ? '#e11d48'
                        : colors.neutral,
                    color: colors.textMain,
                    fontSize: `${bodySize}px`,
                  }}
                />
              </div>
            </div>

            {/* Advertencia de período si 'desde' es mayor que 'hasta' */}
            {(formTouched.fechaDesde || formTouched.fechaHasta) && periodError && !fechaDesdeError && !fechaHastaError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>{periodError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold uppercase tracking-wider mb-2 flex items-center justify-between" style={{ color: colors.textMain, fontSize: `${smallSize}px` }}>
                <span>Detalles de la Propuesta *</span>
                {formTouched.mensaje && mensajeError && (
                  <span className="text-rose-600 font-bold normal-case text-xs">{mensajeError}</span>
                )}
              </label>
              <textarea
                rows={4}
                placeholder="Indica la estimación de asistentes, locación preferida u objetivos del evento..."
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                onBlur={() => setFormTouched((p) => ({ ...p, mensaje: true }))}
                className={`w-full rounded-lg p-3 border focus:outline-none transition-all ${
                  formTouched.mensaje && mensajeError ? 'border-rose-500 ring-1 ring-rose-500' : ''
                }`}
                style={{
                  backgroundColor: colors.bg,
                  borderColor: formTouched.mensaje && mensajeError ? '#e11d48' : colors.neutral,
                  color: colors.textMain,
                  fontSize: `${bodySize}px`,
                }}
              />
            </div>

            {hasFormErrors && Object.values(formTouched).some(Boolean) && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2.5">
                <span className="material-symbols-outlined text-base text-rose-600">error</span>
                <div>
                  <p className="font-bold">Por favor revisa los campos señalados:</p>
                  <p className="text-[11px] opacity-90">No puede haber campos vacíos, el correo debe contener '@' y la fecha desde no puede ser mayor que hasta.</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-lg font-bold tracking-wider uppercase shadow-cta transition-transform hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: colors.accent,
                color: getContrastColor(colors.accent),
                fontSize: `${bodySize}px`,
              }}
            >
              Enviar Solicitud
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-12 font-sans transition-colors"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.neutral,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span
              className="font-bold font-serif"
              style={{ color: colors.accent, fontSize: `${leadSize}px` }}
            >
              ICU
            </span>
            <span className="opacity-70" style={{ color: colors.textMain, fontSize: `${smallSize}px` }}>
              © {new Date().getFullYear()} ICU Agencia de Eventos. Todos los derechos reservados.
            </span>
          </div>

          <div className="flex items-center gap-6" style={{ color: colors.textMain, fontSize: `${smallSize}px` }}>
            <a href="#inicio" className="hover:opacity-75 transition-opacity">
              Inicio
            </a>
            <a href="#servicios" className="hover:opacity-75 transition-opacity">
              Servicios
            </a>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin');
              }}
              className="hover:opacity-100 font-semibold opacity-75 transition-opacity"
              style={{ fontSize: `${smallSize}px` }}
            >
              Panel Admin (/admin)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

