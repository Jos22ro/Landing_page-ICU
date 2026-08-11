import React, { useRef, useState } from 'react';
import { useBrand } from '../context/BrandContext';

export const TipografiaView: React.FC = () => {
  const {
    typography,
    updateTypography,
    resetTypography,
    saveTypography,
    fonts,
    useFont,
    deleteFont,
    uploadFont,
  } = useBrand();

  const [previewTab, setPreviewTab] = useState<'h1-h6' | 'editorial'>('h1-h6');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = (file: File) => {
    const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        uploadFont(fontName, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const currentFont = fonts.find((f) => f.current) || fonts[0];

  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[rgba(38,33,28,0.14)] pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1c18] mb-2 tracking-tight">
            Gestión Tipográfica
          </h2>
          <p className="text-lg text-[#665d54]">
            Ajusta las fuentes y jerarquías visuales de la marca.
          </p>
        </div>
        <div className="flex gap-3 self-end md:self-auto">
          <button
            onClick={resetTypography}
            className="px-4 py-2.5 border border-[rgba(38,33,28,0.14)] rounded-lg text-[#665d54] hover:text-[#1c1c18] hover:border-[#1c1c18] transition-colors text-xs font-bold tracking-widest uppercase"
          >
            DESHACER CAMBIOS
          </button>
          <button
            onClick={saveTypography}
            className="px-5 py-2.5 bg-[#5d172d] text-white rounded-lg shadow-cta hover:opacity-90 transition-opacity text-xs font-bold tracking-widest uppercase flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>GUARDAR CAMBIOS</span>
          </button>
        </div>
      </header>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5/12): Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Upload Card */}
          <section className="bg-white rounded-xl p-5 shadow-1 border border-transparent">
            <h3 className="text-lg font-bold text-[#1c1c18] mb-3">Fuente Principal</h3>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  processFile(file);
                }
              }}
              className="border-2 border-dashed border-[#d9c1c4] rounded-lg p-6 flex flex-col items-center justify-center text-center bg-[#f7f3ec] hover:bg-[#e6e2db] transition-colors cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="material-symbols-outlined text-4xl text-[#665d54] mb-2 group-hover:text-[#5d172d] transition-colors">
                upload_file
              </span>
              <p className="text-sm font-medium text-[#534245] mb-1">
                Arrastra tu archivo .ttf aquí
              </p>
              <p className="text-xs uppercase tracking-widest text-[#665d54]">
                O HAZ CLIC PARA NAVEGAR
              </p>
              <div className="mt-4 bg-[#e6e2db] px-3 py-1 rounded-full inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2E6B4F] block"></span>
                <span className="text-xs text-[#4e453d] font-semibold">
                  {currentFont ? `${currentFont.name} cargada` : 'Fraunces Regular cargada'}
                </span>
              </div>
            </div>
          </section>

          {/* Sizing Controls Card */}
          <section className="bg-white rounded-xl p-5 shadow-1 border border-transparent space-y-5">
            <h3 className="text-lg font-bold text-[#1c1c18]">Escala Tipográfica</h3>
            <div className="flex flex-col gap-5">
              {/* Slider 1: Headline */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#534245]">
                    TÍTULOS (HEADLINE)
                  </label>
                  <span className="text-base font-bold text-[#5d172d] tabular-nums">
                    {typography.headlineSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="96"
                  value={typography.headlineSize}
                  onChange={(e) => updateTypography('headlineSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Slider 2: Lead */}
              <div className="pt-3 border-t border-[rgba(38,33,28,0.14)]">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#534245]">
                    SUBTÍTULOS (LEAD)
                  </label>
                  <span className="text-base font-bold text-[#5d172d] tabular-nums">
                    {typography.leadSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="32"
                  value={typography.leadSize}
                  onChange={(e) => updateTypography('leadSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Slider 3: Body */}
              <div className="pt-3 border-t border-[rgba(38,33,28,0.14)]">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#534245]">
                    PÁRRAFOS (BODY)
                  </label>
                  <span className="text-base font-bold text-[#5d172d] tabular-nums">
                    {typography.bodySize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={typography.bodySize}
                  onChange={(e) => updateTypography('bodySize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* Fuentes Guardadas Card */}
          <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] overflow-hidden">
            <div className="p-4 border-b border-[rgba(38,33,28,0.14)] bg-[#f7f3ec]">
              <h3 className="text-base font-bold text-[#5d172d]">Fuentes Guardadas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-white border-b border-[rgba(38,33,28,0.14)] text-xs uppercase tracking-widest text-[#534245]">
                    <th className="py-3 px-4 font-normal">Nombre</th>
                    <th className="py-3 px-4 font-normal">Estilos</th>
                    <th className="py-3 px-4 font-normal">Fecha</th>
                    <th className="py-3 px-4 font-normal text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(38,33,28,0.14)]">
                  {fonts.map((f) => (
                    <tr key={f.id} className="hover:bg-[#f7f3ec] transition-colors group">
                      <td className="py-3.5 px-4 font-bold text-[#1c1c18]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{f.name}</span>
                          {f.current && (
                            <span className="bg-[#2E6B4F]/10 text-[#2E6B4F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2E6B4F]/20 uppercase">
                              ACTUAL
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#665d54] text-xs">{f.styles}</td>
                      <td className="py-3.5 px-4 text-[#665d54] text-xs whitespace-nowrap">
                        {f.uploadDate}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {f.current ? (
                          <button
                            disabled
                            className="px-3 py-1 bg-[#e6e2db] text-[#534245] border border-[rgba(38,33,28,0.14)] rounded text-xs opacity-75 cursor-not-allowed"
                          >
                            En Uso
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => useFont(f.id)}
                              className="px-2.5 py-1 text-[#5d172d] border border-[rgba(38,33,28,0.14)] rounded hover:border-[#5d172d] hover:bg-[#5d172d]/5 transition-colors text-xs flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                check_circle
                              </span>
                              Usar
                            </button>
                            <button
                              onClick={() => deleteFont(f.id)}
                              className="p-1 text-[#A03434] hover:bg-[#ffdad6] rounded transition-colors"
                              title="Eliminar"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                delete
                              </span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column (7/12): Live Preview Canvas */}
        <div className="lg:col-span-7">
          <section className="bg-white rounded-xl h-full p-6 sm:p-8 shadow-1 border border-[rgba(38,33,28,0.14)] flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[rgba(38,33,28,0.14)] pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#665d54]">visibility</span>
                <span className="text-xs uppercase tracking-widest text-[#665d54] font-bold">
                  VISTA PREVIA DE TIPOGRAFÍA
                </span>
              </div>
              
              {/* Tabs */}
              <div className="flex bg-[#f7f3ec] p-1 rounded-lg border border-[rgba(38,33,28,0.1)] text-xs font-sans">
                <button
                  onClick={() => setPreviewTab('h1-h6')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                    previewTab === 'h1-h6'
                      ? 'bg-white text-[#5d172d] shadow-sm'
                      : 'text-[#665d54] hover:text-[#1c1c18]'
                  }`}
                >
                  Niveles H1 - H6
                </button>
                <button
                  onClick={() => setPreviewTab('editorial')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                    previewTab === 'editorial'
                      ? 'bg-white text-[#5d172d] shadow-sm'
                      : 'text-[#665d54] hover:text-[#1c1c18]'
                  }`}
                >
                  Composición Editorial
                </button>
              </div>
            </div>

            {previewTab === 'h1-h6' ? (
              <div className="flex-1 space-y-5 py-2">
                <div className="flex items-center justify-between bg-[#f7f3ec] px-4 py-2.5 rounded-lg border border-[rgba(38,33,28,0.1)] text-xs font-sans mb-4">
                  <span className="text-[#534245] font-semibold">
                    Fuente activa: <strong className="text-[#5d172d]">{typography.fontFamily}</strong>
                  </span>
                  <span className="text-[#665d54]">Aplicado automáticamente a H1, H2, H3, H4, H5, H6</span>
                </div>

                {/* H1 */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#5d172d] text-white font-bold tracking-wider">
                      H1
                    </span>
                    <span className="text-[#665d54] font-mono">{typography.headlineSize}px</span>
                  </div>
                  <h1
                    className="text-[#1c1c18] font-bold leading-tight"
                    style={{
                      fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                      fontSize: `${typography.headlineSize}px`,
                    }}
                  >
                    H1. Galas, Ceremonias & Premiaciones
                  </h1>
                </div>

                {/* H2 */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#7a2e43] text-white font-bold tracking-wider">
                      H2
                    </span>
                    <span className="text-[#665d54] font-mono">
                      {Math.max(1, Math.round(typography.headlineSize * 0.78))}px
                    </span>
                  </div>
                  <h2
                    className="text-[#1c1c18] font-bold leading-tight"
                    style={{
                      fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                      fontSize: `${Math.max(1, Math.round(typography.headlineSize * 0.78))}px`,
                    }}
                  >
                    H2. Lanzamientos de Producto y Marcas de Lujo
                  </h2>
                </div>

                {/* H3 */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#8b4c5c] text-white font-bold tracking-wider">
                      H3
                    </span>
                    <span className="text-[#665d54] font-mono">
                      {Math.max(1, Math.round(typography.headlineSize * 0.62))}px
                    </span>
                  </div>
                  <h3
                    className="text-[#1c1c18] font-bold leading-tight"
                    style={{
                      fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                      fontSize: `${Math.max(1, Math.round(typography.headlineSize * 0.62))}px`,
                    }}
                  >
                    H3. Cumbres Ejecutivas y Convenciones Internacionales
                  </h3>
                </div>

                {/* H4 */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#534245] text-white font-bold tracking-wider">
                      H4
                    </span>
                    <span className="text-[#665d54] font-mono">
                      {Math.max(1, Math.round(typography.headlineSize * 0.5))}px
                    </span>
                  </div>
                  <h4
                    className="text-[#1c1c18] font-bold leading-snug"
                    style={{
                      fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                      fontSize: `${Math.max(1, Math.round(typography.headlineSize * 0.5))}px`,
                    }}
                  >
                    H4. Experiencias Privadas y Cenas Efímeras de Autor
                  </h4>
                </div>

                {/* H5 */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#665d54] text-white font-bold tracking-wider">
                      H5
                    </span>
                    <span className="text-[#665d54] font-mono">
                      {Math.max(1, Math.round(typography.headlineSize * 0.4))}px
                    </span>
                  </div>
                  <h5
                    className="text-[#1c1c18] font-bold leading-normal"
                    style={{
                      fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                      fontSize: `${Math.max(1, Math.round(typography.headlineSize * 0.4))}px`,
                    }}
                  >
                    H5. Especificaciones Audiovisuales y Protocolo de Seguridad
                  </h5>
                </div>

                {/* H6 */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#867275] text-white font-bold tracking-wider">
                      H6
                    </span>
                    <span className="text-[#665d54] font-mono">
                      {Math.max(1, Math.round(typography.headlineSize * 0.33))}px
                    </span>
                  </div>
                  <h6
                    className="text-[#1c1c18] font-bold leading-normal"
                    style={{
                      fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                      fontSize: `${Math.max(1, Math.round(typography.headlineSize * 0.33))}px`,
                    }}
                  >
                    H6. Notas editoriales, códigos de vestimenta y datos complementarios del evento
                  </h6>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full space-y-6 py-4">
                <h1
                  className="text-[#1c1c18] transition-all duration-200 font-bold leading-tight"
                  style={{
                    fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                    fontSize: `${typography.headlineSize}px`,
                    lineHeight: '1.05',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Elegancia y Precisión en Cada Evento.
                </h1>

                <h2
                  className="text-[#5d172d] transition-all duration-200 font-bold leading-tight"
                  style={{
                    fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                    fontSize: `${Math.max(1, Math.round(typography.headlineSize * 0.75))}px`,
                  }}
                >
                  H2. Producción integral con dirección de arte a la medida.
                </h2>

                <p
                  className="text-[#665d54] transition-all duration-200 leading-relaxed"
                  style={{
                    fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                    fontSize: `${typography.leadSize}px`,
                    lineHeight: '1.6',
                  }}
                >
                  Diseñamos experiencias memorables a través de una planificación meticulosa y una
                  dirección de arte impecable.
                </p>

                <h3
                  className="text-[#1c1c18] font-bold"
                  style={{
                    fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                    fontSize: `${Math.max(1, Math.round(typography.headlineSize * 0.6))}px`,
                  }}
                >
                  H3. Armonía visual y coherencia de marca.
                </h3>

                <p
                  className="text-[#534245] transition-all duration-200 leading-relaxed"
                  style={{
                    fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                    fontSize: `${typography.bodySize}px`,
                    lineHeight: '1.6',
                  }}
                >
                  Nuestra agencia se especializa en crear atmósferas únicas que reflejan la identidad de
                  tu marca. Desde la selección cromática hasta la ejecución logística, cada detalle es
                  orquestado para transmitir profesionalismo y calidez.
                </p>

                <div className="mt-6 pt-6 border-t border-[rgba(38,33,28,0.14)] flex flex-wrap gap-4">
                  <button
                    className="px-6 py-3 bg-[#5d172d] text-white rounded-lg font-bold shadow-cta text-sm"
                    style={{ fontFamily: `"${typography.fontFamily}", serif, sans-serif` }}
                  >
                    Botón Primario
                  </button>
                  <button
                    className="px-6 py-3 border border-[rgba(38,33,28,0.2)] text-[#665d54] rounded-lg font-bold text-sm"
                    style={{ fontFamily: `"${typography.fontFamily}", serif, sans-serif` }}
                  >
                    Botón Secundario
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
