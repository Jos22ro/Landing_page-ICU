import React, { useState, useEffect } from 'react';
import { useBrand } from '../context/BrandContext';
import { ColorTokens } from '../types';

export const ColoresView: React.FC = () => {
  const {
    colors,
    updateColorToken,
    resetColors,
    saveColors,
    setColors,
    editingPaletteId,
    editingPalette,
    cancelEditingPalette,
  } = useBrand();

  const [paletteName, setPaletteName] = useState('Paleta Principal ICU');
  const [paletteMode, setPaletteMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (editingPalette) {
      setPaletteName(editingPalette.name);
      setPaletteMode(editingPalette.category);
    }
  }, [editingPaletteId, editingPalette]);

  const colorFields: { key: keyof ColorTokens; label: string; varName: string }[] = [
    { key: 'bg', label: 'Fondo', varName: 'var(--bg)' },
    { key: 'surface', label: 'Superficie', varName: 'var(--surface)' },
    { key: 'textMain', label: 'Texto Principal', varName: 'var(--text-main)' },
    { key: 'accent', label: 'Acento', varName: 'var(--accent)' },
    { key: 'neutral', label: 'Neutro / Borde', varName: 'var(--neutral)' },
  ];

  const handleModeChange = (newMode: 'light' | 'dark') => {
    setPaletteMode(newMode);
    if (newMode === 'dark' && colors.bg === '#fdf9f2') {
      setColors({
        bg: '#121316',
        surface: '#1e2024',
        textMain: '#fdf9f2',
        accent: '#e2809a',
        neutral: '#363a40',
      });
    } else if (newMode === 'light' && colors.bg === '#121316') {
      setColors({
        bg: '#fdf9f2',
        surface: '#ffffff',
        textMain: '#1c1c18',
        accent: '#5d172d',
        neutral: '#d9c1c4',
      });
    }
  };

  const handleSave = () => {
    saveColors(paletteName, paletteMode);
  };

  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[rgba(38,33,28,0.14)] pb-6 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1c18] mb-2 tracking-tight">
            Colores de la marca
          </h2>
          <p className="text-lg text-[#534245]">
            Configura los tokens de color globales para la agencia y especifica el nombre y modo de la paleta.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-[rgba(38,33,28,0.14)] flex items-center gap-2.5 self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B4F]"></span>
          <span className="text-xs uppercase tracking-widest text-[#665d54] font-medium">
            5/5 COLORES CONFIGURADOS
          </span>
        </div>
      </div>

      {/* Editing Mode Banner */}
      {editingPaletteId && (
        <div className="bg-[#5d172d]/10 border border-[#5d172d]/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#5d172d]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">edit_note</span>
            <div>
              <p className="font-bold text-sm">
                Editando paleta existente: <span className="underline font-serif text-base">{editingPalette?.name || paletteName}</span>
              </p>
              <p className="text-xs opacity-85">
                Al guardar, los cambios se aplicarán directamente sobre esta paleta guardada.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={cancelEditingPalette}
            className="self-start sm:self-auto px-4 py-2 bg-white text-[#5d172d] border border-[#5d172d]/30 rounded-lg text-xs font-bold hover:bg-[#5d172d]/5 transition-colors shadow-xs"
          >
            Crear como nueva en su lugar
          </button>
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Palette Info + Color List */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Palette Metadata Box */}
          <div className="bg-white rounded-xl shadow-1 p-5 border border-[rgba(38,33,28,0.14)] space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(38,33,28,0.1)] pb-3">
              <h3 className="text-base font-bold text-[#1c1c18] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5d172d]">style</span>
                <span>Datos de la Paleta</span>
              </h3>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  paletteMode === 'dark'
                    ? 'bg-[#1a1c1e] text-[#fdf9f2]'
                    : 'bg-[#eee0d5] text-[#534245]'
                }`}
              >
                {paletteMode === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input: Nombre de la Paleta */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase font-sans font-bold tracking-wider text-[#665d54]">
                  Nombre de la Paleta
                </label>
                <input
                  type="text"
                  value={paletteName}
                  onChange={(e) => setPaletteName(e.target.value)}
                  placeholder="Ej. Gala Editorial, Noche Velada..."
                  className="w-full bg-[#fdf9f2] border border-[rgba(38,33,28,0.14)] rounded-lg px-3.5 py-2 text-sm text-[#1c1c18] font-medium focus:outline-none focus:border-[#5d172d] focus:ring-1 focus:ring-[#5d172d]"
                />
              </div>

              {/* Input/Selector: Modo (Oscuro o Claro) */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase font-sans font-bold tracking-wider text-[#665d54]">
                  Modo de la Paleta
                </label>
                <div className="flex bg-[#f7f3ec] p-1 rounded-lg border border-[rgba(38,33,28,0.14)] gap-1">
                  <button
                    type="button"
                    onClick={() => handleModeChange('light')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      paletteMode === 'light'
                        ? 'bg-white text-[#5d172d] shadow-sm border border-[rgba(38,33,28,0.1)]'
                        : 'text-[#665d54] hover:text-[#1c1c18]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">light_mode</span>
                    <span>Modo Claro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('dark')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      paletteMode === 'dark'
                        ? 'bg-[#1a1c1e] text-white shadow-sm'
                        : 'text-[#665d54] hover:text-[#1c1c18]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">dark_mode</span>
                    <span>Modo Oscuro</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Tokens List */}
          <div className="flex flex-col gap-4">
            {colorFields.map((field) => (
              <div
                key={field.key}
                className="bg-white rounded-lg shadow-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between border border-transparent hover:border-[#d9c1c4] transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full shadow-inner border border-[rgba(38,33,28,0.14)] shrink-0 transition-colors duration-200"
                    style={{ backgroundColor: colors[field.key] }}
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#1c1c18]">{field.label}</h3>
                    <p className="text-xs uppercase tracking-widest text-[#665d54] mt-0.5">
                      {field.varName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={colors[field.key]}
                    onChange={(e) => updateColorToken(field.key, e.target.value)}
                    className="w-10 h-10 p-1 bg-transparent border-0 cursor-pointer rounded-md hover:bg-[#e6e2db] transition-colors"
                  />
                  <input
                    type="text"
                    value={colors[field.key]}
                    onChange={(e) => updateColorToken(field.key, e.target.value)}
                    className="w-28 text-sm font-mono text-center border border-[rgba(38,33,28,0.14)] rounded px-2.5 py-1.5 focus:outline-none focus:border-[#5d172d] focus:ring-1 focus:ring-[#5d172d]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Preview Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 bg-white rounded-lg shadow-1 p-6 flex flex-col gap-5 border border-[rgba(38,33,28,0.14)]">
            <div className="flex items-center justify-between border-b border-[rgba(38,33,28,0.14)] pb-4">
              <h3 className="text-lg font-bold text-[#1c1c18] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#665d54]">visibility</span>
                <span>Vista Previa</span>
              </h3>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5d172d] px-3 py-1 bg-[#ffd9df] rounded-full">
                EN VIVO
              </span>
            </div>

            {/* Mini Landing Component Preview */}
            <div
              className="rounded-lg overflow-hidden border border-[rgba(38,33,28,0.14)] p-4 flex flex-col gap-5 transition-colors duration-200"
              style={{ backgroundColor: colors.bg, minHeight: '320px' }}
            >
              {/* Navbar mockup */}
              <div
                className="px-5 py-3 rounded flex justify-between items-center transition-colors duration-200 border border-[rgba(38,33,28,0.1)] shadow-sm"
                style={{ backgroundColor: colors.surface }}
              >
                <div
                  className="font-bold text-lg tracking-tight"
                  style={{ color: colors.accent }}
                >
                  ICU
                </div>
                <div className="flex gap-2">
                  <div
                    className="w-12 h-2.5 rounded-full"
                    style={{ backgroundColor: colors.neutral }}
                  />
                  <div
                    className="w-12 h-2.5 rounded-full"
                    style={{ backgroundColor: colors.neutral }}
                  />
                </div>
              </div>

              {/* Hero mockup */}
              <div className="px-4 py-6 flex flex-col items-center text-center gap-3">
                <div
                  className="w-3/4 h-7 rounded transition-colors duration-200"
                  style={{ backgroundColor: colors.textMain }}
                />
                <div
                  className="w-1/2 h-3.5 rounded opacity-75 transition-colors duration-200"
                  style={{ backgroundColor: colors.textMain }}
                />
                <div
                  className="w-2/3 h-3.5 rounded opacity-50 transition-colors duration-200"
                  style={{ backgroundColor: colors.textMain }}
                />
                <button
                  className="mt-4 px-6 py-2.5 rounded font-bold text-xs tracking-widest uppercase text-white shadow-cta transition-all"
                  style={{ backgroundColor: colors.accent }}
                >
                  ACCION PRINCIPAL
                </button>
              </div>

              {/* Card Grid mockup */}
              <div className="flex gap-3">
                <div
                  className="flex-1 p-3.5 rounded-md shadow-sm border border-[rgba(38,33,28,0.1)] transition-colors duration-200"
                  style={{ backgroundColor: colors.surface }}
                >
                  <div
                    className="w-7 h-7 rounded-full mb-3"
                    style={{ backgroundColor: colors.neutral }}
                  />
                  <div
                    className="w-full h-3 rounded mb-2"
                    style={{ backgroundColor: colors.textMain, opacity: 0.8 }}
                  />
                  <div
                    className="w-2/3 h-2 rounded"
                    style={{ backgroundColor: colors.textMain, opacity: 0.5 }}
                  />
                </div>
                <div
                  className="flex-1 p-3.5 rounded-md shadow-sm border border-[rgba(38,33,28,0.1)] transition-colors duration-200"
                  style={{ backgroundColor: colors.surface }}
                >
                  <div
                    className="w-7 h-7 rounded-full mb-3"
                    style={{ backgroundColor: colors.neutral }}
                  />
                  <div
                    className="w-full h-3 rounded mb-2"
                    style={{ backgroundColor: colors.textMain, opacity: 0.8 }}
                  />
                  <div
                    className="w-2/3 h-2 rounded"
                    style={{ backgroundColor: colors.textMain, opacity: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-12 flex items-center justify-end gap-4 border-t border-[rgba(38,33,28,0.14)] pt-6">
        <button
          onClick={resetColors}
          className="px-6 py-3 rounded text-xs font-bold uppercase tracking-widest text-[#534245] hover:bg-white border border-transparent hover:border-[rgba(38,33,28,0.14)] transition-all"
        >
          DESHACER CAMBIOS
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-3 rounded text-xs font-bold uppercase tracking-widest text-white bg-[#5d172d] shadow-cta hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">
            {editingPaletteId ? 'published_with_changes' : 'save'}
          </span>
          <span>{editingPaletteId ? 'ACTUALIZAR PALETA' : 'GUARDAR PALETA'}</span>
        </button>
      </div>
    </div>
  );
};
