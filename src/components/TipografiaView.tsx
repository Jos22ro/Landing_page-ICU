import React, { useRef, useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { validateNumberRange, validateNotEmpty } from '../utils/validation';

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
    showToast,
  } = useBrand();

  const [previewTab, setPreviewTab] = useState<'5-escalas' | 'editorial'>('5-escalas');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Validaciones de rangos para las 5 escalas
  const scale1Val = validateNumberRange(typography.headlineSize, 24, 96, 'Titular Hero (H1)');
  const scale2Val = validateNumberRange(typography.h2Size, 18, 64, 'Títulos de Sección (H2)');
  const scale3Val = validateNumberRange(typography.leadSize, 14, 40, 'Subtítulos (H3)');
  const scale4Val = validateNumberRange(typography.bodySize, 12, 26, 'Cuerpo de texto (Body)');
  const scale5Val = validateNumberRange(typography.smallSize, 9, 18, 'Texto Auxiliar (Small)');
  const fontNameVal = validateNotEmpty(typography.fontFamily, 'La fuente activa');

  const isHierarchyValid =
    typography.headlineSize > typography.h2Size &&
    typography.h2Size > typography.leadSize &&
    typography.leadSize > typography.bodySize &&
    typography.bodySize > typography.smallSize;

  const areAllScalesValid =
    scale1Val.isValid &&
    scale2Val.isValid &&
    scale3Val.isValid &&
    scale4Val.isValid &&
    scale5Val.isValid &&
    fontNameVal.isValid;

  const processFile = (file: File) => {
    const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
    if (!fontName) {
      showToast('El archivo debe tener un nombre válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        uploadFont(fontName, dataUrl, {
          scale1: typography.headlineSize || 56,
          scale2: typography.h2Size || 36,
          scale3: typography.leadSize || 22,
          scale4: typography.bodySize || 16,
          scale5: typography.smallSize || 12,
        });
        showToast(`Fuente '${fontName}' subida e inicializada correctamente.`);
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

  const handleSaveScales = () => {
    if (!areAllScalesValid) {
      showToast('Por favor corrige las escalas fuera del rango admitido antes de guardar.');
      return;
    }
    saveTypography();
    showToast('Escalas tipográficas guardadas con éxito.');
  };

  const autoHarmonize = () => {
    const baseH1 = typography.headlineSize || 56;
    const baseBody = typography.bodySize || 16;
    const h2 = Math.max(1, Math.round(baseH1 * 0.67));
    const lead = Math.max(1, Math.round(baseBody * 1.375));
    const small = Math.max(1, Math.round(baseBody * 0.75));

    updateTypography('h2Size', h2);
    updateTypography('leadSize', lead);
    updateTypography('smallSize', small);
  };

  const currentFont = fonts.find((f) => f.current) || fonts[0];

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[rgba(38,33,28,0.14)] pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1c18] mb-2 tracking-tight">
            Gestión Tipográfica
          </h2>
          <p className="text-sm sm:text-base text-[#665d54]">
            Configura y guarda las 5 escalas tipográficas asociadas a cada fuente de marca.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
          <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 text-xs font-semibold ${
            areAllScalesValid ? 'bg-white border-[rgba(38,33,28,0.14)] text-[#665d54]' : 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
          }`}>
            <span className={`w-2 h-2 rounded-full ${areAllScalesValid ? 'bg-[#2E6B4F]' : 'bg-rose-600 animate-pulse'}`}></span>
            <span>{areAllScalesValid ? '5/5 ESCALAS VÁLIDAS' : 'ESCALAS FUERA DE RANGO'}</span>
          </div>
          <button
            onClick={resetTypography}
            className="px-4 py-2.5 border border-[rgba(38,33,28,0.14)] rounded-lg text-[#665d54] hover:text-[#1c1c18] hover:border-[#1c1c18] transition-colors text-xs font-bold tracking-widest uppercase cursor-pointer"
          >
            DESHACER CAMBIOS
          </button>
          <button
            onClick={handleSaveScales}
            className={`px-5 py-2.5 rounded-lg shadow-cta transition-all text-xs font-bold tracking-widest uppercase flex items-center gap-2 cursor-pointer ${
              areAllScalesValid
                ? 'bg-[#5d172d] text-white hover:opacity-90'
                : 'bg-gray-400 text-white cursor-not-allowed opacity-80'
            }`}
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>GUARDAR ESCALAS DE FUENTE</span>
          </button>
        </div>
      </header>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5/12): Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Upload & Active Font Card */}
          <section className="bg-white rounded-xl p-5 shadow-1 border border-[rgba(38,33,28,0.1)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1c1c18]">Fuente de Marca Activa</h3>
              <span className="px-2.5 py-1 rounded-full bg-[#5d172d]/10 text-[#5d172d] text-xs font-bold font-mono">
                {typography.fontFamily}
              </span>
            </div>

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
              className="border-2 border-dashed border-[#d9c1c4] rounded-lg p-5 flex flex-col items-center justify-center text-center bg-[#f7f3ec] hover:bg-[#e6e2db] transition-colors cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="material-symbols-outlined text-3xl text-[#665d54] mb-1.5 group-hover:text-[#5d172d] transition-colors">
                upload_file
              </span>
              <p className="text-xs font-bold text-[#534245]">
                Subir nueva fuente (.ttf, .otf, .woff2)
              </p>
              <p className="text-[11px] text-[#665d54] mt-0.5">
                Se inicializará automáticamente con las 5 escalas base
              </p>
            </div>
          </section>

          {/* 5 Sizing Controls Card */}
          <section className="bg-white rounded-xl p-5 shadow-1 border border-[rgba(38,33,28,0.1)] space-y-5">
            <div className="flex items-center justify-between border-b border-[rgba(38,33,28,0.1)] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1c1c18]">5 Escalas Tipográficas</h3>
                <p className="text-xs text-[#665d54]">Ajustes para: <strong>{typography.fontFamily}</strong></p>
              </div>
              <button
                onClick={autoHarmonize}
                title="Calcula automáticamente proporciones armónicas para las 5 escalas"
                className="px-2.5 py-1 text-xs border border-[#5d172d]/30 text-[#5d172d] hover:bg-[#5d172d]/5 rounded font-semibold flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                Armonizar
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Escala 1: Headline */}
              <div className={`p-3.5 rounded-lg border space-y-2 transition-colors ${
                scale1Val.isValid ? 'bg-[#fdf9f2] border-[rgba(38,33,28,0.1)]' : 'bg-rose-50/40 border-rose-400'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#5d172d] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#534245]">
                      Titular Hero (H1)
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="24"
                      max="96"
                      value={typography.headlineSize}
                      onChange={(e) => updateTypography('headlineSize', parseInt(e.target.value) || 0)}
                      className={`w-14 text-right px-1.5 py-0.5 text-xs font-bold font-mono border rounded bg-white ${
                        scale1Val.isValid ? 'border-[rgba(38,33,28,0.2)] text-[#5d172d]' : 'border-rose-400 text-rose-600'
                      }`}
                    />
                    <span className="text-xs text-[#665d54] font-mono">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="24"
                  max="96"
                  value={typography.headlineSize}
                  onChange={(e) => updateTypography('headlineSize', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#665d54]">Rango recomendado: 24px - 96px</span>
                  {!scale1Val.isValid && (
                    <span className="text-rose-600 font-bold">{scale1Val.error}</span>
                  )}
                </div>
              </div>

              {/* Escala 2: Section H2 */}
              <div className={`p-3.5 rounded-lg border space-y-2 transition-colors ${
                scale2Val.isValid ? 'bg-[#fdf9f2] border-[rgba(38,33,28,0.1)]' : 'bg-rose-50/40 border-rose-400'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#7a2e43] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#534245]">
                      Títulos de Sección (H2)
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="18"
                      max="64"
                      value={typography.h2Size}
                      onChange={(e) => updateTypography('h2Size', parseInt(e.target.value) || 0)}
                      className={`w-14 text-right px-1.5 py-0.5 text-xs font-bold font-mono border rounded bg-white ${
                        scale2Val.isValid ? 'border-[rgba(38,33,28,0.2)] text-[#7a2e43]' : 'border-rose-400 text-rose-600'
                      }`}
                    />
                    <span className="text-xs text-[#665d54] font-mono">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="18"
                  max="64"
                  value={typography.h2Size}
                  onChange={(e) => updateTypography('h2Size', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#665d54]">Rango recomendado: 18px - 64px</span>
                  {!scale2Val.isValid && (
                    <span className="text-rose-600 font-bold">{scale2Val.error}</span>
                  )}
                </div>
              </div>

              {/* Escala 3: Subtitles / Lead H3 */}
              <div className={`p-3.5 rounded-lg border space-y-2 transition-colors ${
                scale3Val.isValid ? 'bg-[#fdf9f2] border-[rgba(38,33,28,0.1)]' : 'bg-rose-50/40 border-rose-400'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8b4c5c] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#534245]">
                      Subtítulos, Logo & Tarjetas (H3)
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="14"
                      max="40"
                      value={typography.leadSize}
                      onChange={(e) => updateTypography('leadSize', parseInt(e.target.value) || 0)}
                      className={`w-14 text-right px-1.5 py-0.5 text-xs font-bold font-mono border rounded bg-white ${
                        scale3Val.isValid ? 'border-[rgba(38,33,28,0.2)] text-[#8b4c5c]' : 'border-rose-400 text-rose-600'
                      }`}
                    />
                    <span className="text-xs text-[#665d54] font-mono">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="14"
                  max="40"
                  value={typography.leadSize}
                  onChange={(e) => updateTypography('leadSize', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#665d54]">Rango recomendado: 14px - 40px</span>
                  {!scale3Val.isValid && (
                    <span className="text-rose-600 font-bold">{scale3Val.error}</span>
                  )}
                </div>
              </div>

              {/* Escala 4: Body */}
              <div className={`p-3.5 rounded-lg border space-y-2 transition-colors ${
                scale4Val.isValid ? 'bg-[#fdf9f2] border-[rgba(38,33,28,0.1)]' : 'bg-rose-50/40 border-rose-400'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#534245] text-white flex items-center justify-center text-[10px] font-bold">4</span>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#534245]">
                      Párrafos, Formulario & CTA (Body)
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="12"
                      max="26"
                      value={typography.bodySize}
                      onChange={(e) => updateTypography('bodySize', parseInt(e.target.value) || 0)}
                      className={`w-14 text-right px-1.5 py-0.5 text-xs font-bold font-mono border rounded bg-white ${
                        scale4Val.isValid ? 'border-[rgba(38,33,28,0.2)] text-[#534245]' : 'border-rose-400 text-rose-600'
                      }`}
                    />
                    <span className="text-xs text-[#665d54] font-mono">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="12"
                  max="26"
                  value={typography.bodySize}
                  onChange={(e) => updateTypography('bodySize', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#665d54]">Rango recomendado: 12px - 26px</span>
                  {!scale4Val.isValid && (
                    <span className="text-rose-600 font-bold">{scale4Val.error}</span>
                  )}
                </div>
              </div>

              {/* Escala 5: Small / Micro */}
              <div className={`p-3.5 rounded-lg border space-y-2 transition-colors ${
                scale5Val.isValid ? 'bg-[#fdf9f2] border-[rgba(38,33,28,0.1)]' : 'bg-rose-50/40 border-rose-400'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#665d54] text-white flex items-center justify-center text-[10px] font-bold">5</span>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#534245]">
                      UI Auxiliar, Badges & Labels (Small)
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="9"
                      max="18"
                      value={typography.smallSize}
                      onChange={(e) => updateTypography('smallSize', parseInt(e.target.value) || 0)}
                      className={`w-14 text-right px-1.5 py-0.5 text-xs font-bold font-mono border rounded bg-white ${
                        scale5Val.isValid ? 'border-[rgba(38,33,28,0.2)] text-[#665d54]' : 'border-rose-400 text-rose-600'
                      }`}
                    />
                    <span className="text-xs text-[#665d54] font-mono">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="9"
                  max="18"
                  value={typography.smallSize}
                  onChange={(e) => updateTypography('smallSize', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#665d54]">Rango recomendado: 9px - 18px</span>
                  {!scale5Val.isValid && (
                    <span className="text-rose-600 font-bold">{scale5Val.error}</span>
                  )}
                </div>
              </div>

              {/* Hierarchy Notice */}
              {!isHierarchyValid && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 text-sm">info</span>
                  <span>Aviso de Jerarquía: Se recomienda H1 &gt; H2 &gt; H3 &gt; Body &gt; Small para asegurar armonía editorial. Puedes usar 'Armonizar' arriba.</span>
                </div>
              )}
            </div>
          </section>

          {/* Fuentes Guardadas Card */}
          <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] overflow-hidden">
            <div className="p-4 border-b border-[rgba(38,33,28,0.14)] bg-[#f7f3ec] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#5d172d] uppercase tracking-wider">
                Fuentes y sus 5 Escalas
              </h3>
              <span className="text-xs text-[#665d54] font-mono">{fonts.length} registradas</span>
            </div>
            <div className="divide-y divide-[rgba(38,33,28,0.14)]">
              {fonts.map((f) => {
                const s = f.scales || {
                  scale1: 56,
                  scale2: 36,
                  scale3: 22,
                  scale4: 16,
                  scale5: 12,
                };
                const isSelected = f.current || f.name.toLowerCase() === typography.fontFamily.toLowerCase();

                return (
                  <div key={f.id} className={`p-4 transition-colors ${isSelected ? 'bg-[#5d172d]/5' : 'hover:bg-[#f7f3ec]'}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1c1c18]">{f.name}</span>
                          {isSelected && (
                            <span className="bg-[#2E6B4F]/10 text-[#2E6B4F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2E6B4F]/20 uppercase">
                              ACTIVA
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#665d54] mt-0.5">{f.styles} · {f.uploadDate}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isSelected ? (
                          <span className="px-2.5 py-1 bg-[#5d172d] text-white text-[11px] font-bold rounded">
                            En Uso
                          </span>
                        ) : (
                          <button
                            onClick={() => useFont(f.id)}
                            className="px-2.5 py-1 text-[#5d172d] border border-[#5d172d]/40 rounded hover:bg-[#5d172d] hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Activar
                          </button>
                        )}
                        {!isSelected && fonts.length > 1 && (
                          <button
                            onClick={() => deleteFont(f.id)}
                            className="p-1 text-[#A03434] hover:bg-[#ffdad6] rounded transition-colors"
                            title="Eliminar fuente"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Escalas guardadas badge strip */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono pt-1">
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-[#5d172d] font-semibold border border-stone-200" title="Escala 1: H1">
                        H1: {s.scale1}px
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-[#7a2e43] font-semibold border border-stone-200" title="Escala 2: H2">
                        H2: {s.scale2}px
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-[#8b4c5c] font-semibold border border-stone-200" title="Escala 3: H3/Lead">
                        H3: {s.scale3}px
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-[#534245] font-semibold border border-stone-200" title="Escala 4: Body">
                        Body: {s.scale4}px
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-[#665d54] font-semibold border border-stone-200" title="Escala 5: Small">
                        Small: {s.scale5}px
                      </span>
                    </div>
                  </div>
                );
              })}
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
                  VISTA PREVIA DE JERARQUÍA
                </span>
              </div>
              
              {/* Tabs */}
              <div className="flex bg-[#f7f3ec] p-1 rounded-lg border border-[rgba(38,33,28,0.1)] text-xs font-sans">
                <button
                  onClick={() => setPreviewTab('5-escalas')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                    previewTab === '5-escalas'
                      ? 'bg-white text-[#5d172d] shadow-sm'
                      : 'text-[#665d54] hover:text-[#1c1c18]'
                  }`}
                >
                  5 Escalas Principales
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

            {previewTab === '5-escalas' ? (
              <div className="flex-1 space-y-4 py-2">
                <div className="flex items-center justify-between bg-[#f7f3ec] px-4 py-2.5 rounded-lg border border-[rgba(38,33,28,0.1)] text-xs font-sans mb-3">
                  <span className="text-[#534245] font-semibold">
                    Fuente activa: <strong className="text-[#5d172d]">{typography.fontFamily}</strong>
                  </span>
                  <span className="text-[#665d54]">5 niveles tipográficos guardados</span>
                </div>

                {/* Escala 1: H1 */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#5d172d] text-white font-bold tracking-wider">
                      Escala 1 · Titular Hero (H1)
                    </span>
                    <span className="text-[#665d54] font-mono font-bold">{typography.headlineSize}px</span>
                  </div>
                  <h1
                    className="text-[#1c1c18] font-bold leading-tight"
                    style={{
                      fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                      fontSize: `${typography.headlineSize}px`,
                    }}
                  >
                    Galas, Ceremonias & Premiaciones
                  </h1>
                </div>

                {/* Escala 2: H2 */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#7a2e43] text-white font-bold tracking-wider">
                      Escala 2 · Títulos de Sección (H2)
                    </span>
                    <span className="text-[#665d54] font-mono font-bold">
                      {typography.h2Size}px
                    </span>
                  </div>
                  <h2
                    className="text-[#1c1c18] font-bold leading-tight"
                    style={{
                      fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                      fontSize: `${typography.h2Size}px`,
                    }}
                  >
                    Nuestros Servicios y Experiencias Exclusivas
                  </h2>
                </div>

                {/* Escala 3: H3 / Lead */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#8b4c5c] text-white font-bold tracking-wider">
                      Escala 3 · Subtítulos, Logo & Tarjetas (H3 / Lead)
                    </span>
                    <span className="text-[#665d54] font-mono font-bold">{typography.leadSize}px</span>
                  </div>
                  <h3
                    className="text-[#1c1c18] font-bold leading-tight"
                    style={{
                      fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                      fontSize: `${typography.leadSize}px`,
                    }}
                  >
                    Producción integral y dirección de arte personalizada para marcas de alto calibre
                  </h3>
                </div>

                {/* Escala 4: Body */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#534245] text-white font-bold tracking-wider">
                      Escala 4 · Párrafos, Inputs & Botones (Body)
                    </span>
                    <span className="text-[#665d54] font-mono font-bold">{typography.bodySize}px</span>
                  </div>
                  <p
                    className="text-[#534245] leading-relaxed"
                    style={{
                      fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                      fontSize: `${typography.bodySize}px`,
                    }}
                  >
                    Diseñamos atmósferas inolvidables cuidando cada detalle logístico y estético para garantizar que tus invitados vivan un momento memorable.
                  </p>
                </div>

                {/* Escala 5: Small / Micro */}
                <div className="p-4 rounded-lg border border-[rgba(38,33,28,0.1)] bg-[#fdf9f2] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#665d54] text-white font-bold tracking-wider">
                      Escala 5 · UI Auxiliar, Badges & Labels (Small)
                    </span>
                    <span className="text-[#665d54] font-mono font-bold">
                      {typography.smallSize}px
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap pt-1 font-sans">
                    <span
                      className="px-2.5 py-1 rounded-full border border-[#5d172d]/30 text-[#5d172d] font-bold uppercase tracking-wider"
                      style={{ fontSize: `${typography.smallSize}px` }}
                    >
                      01 Coordinación
                    </span>
                    <span
                      className="text-[#665d54] uppercase tracking-wider font-semibold"
                      style={{ fontSize: `${typography.smallSize}px` }}
                    >
                      Navegación / Labels / Copyright
                    </span>
                  </div>
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
                    fontSize: `${typography.h2Size}px`,
                  }}
                >
                  Producción integral con dirección de arte a la medida.
                </h2>

                <p
                  className="text-[#665d54] transition-all duration-200 leading-relaxed font-serif"
                  style={{
                    fontFamily: `"${typography.fontFamily}", serif, sans-serif`,
                    fontSize: `${typography.leadSize}px`,
                    lineHeight: '1.5',
                  }}
                >
                  Diseñamos experiencias memorables a través de una planificación meticulosa y una
                  dirección de arte impecable.
                </p>

                <p
                  className="text-[#534245] transition-all duration-200 leading-relaxed font-sans"
                  style={{
                    fontSize: `${typography.bodySize}px`,
                    lineHeight: '1.6',
                  }}
                >
                  Nuestra agencia se especializa en crear atmósferas únicas que reflejan la identidad de
                  tu marca. Desde la selección cromática hasta la ejecución logística, cada detalle es
                  orquestado para transmitir profesionalismo y calidez.
                </p>

                <div className="mt-6 pt-6 border-t border-[rgba(38,33,28,0.14)] flex flex-wrap gap-4 font-sans">
                  <button
                    className="px-6 py-3 bg-[#5d172d] text-white rounded-lg font-bold shadow-cta"
                    style={{ fontSize: `${typography.bodySize}px` }}
                  >
                    Planifica tu Evento
                  </button>
                  <button
                    className="px-6 py-3 border border-[rgba(38,33,28,0.2)] text-[#665d54] rounded-lg font-bold"
                    style={{ fontSize: `${typography.smallSize}px` }}
                  >
                    Ver Portfolio
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

