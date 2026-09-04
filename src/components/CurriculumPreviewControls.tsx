import React from 'react';
import { curriculumThemes } from './CurriculumDocument';

interface CurriculumPreviewControlsProps {
  currentThemeKey: string;
  onThemeChange: (key: string) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onExportPng: () => void;
  isExporting: boolean;
  exportStatus: string;
}

export const CurriculumPreviewControls: React.FC<CurriculumPreviewControlsProps> = ({
  currentThemeKey,
  onThemeChange,
  customColor,
  onCustomColorChange,
  zoomLevel,
  onZoomChange,
  onExportPdf,
  onPrint,
  onExportPng,
  isExporting,
  exportStatus,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] p-4 sm:p-5 space-y-4 no-print">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Theme / Colors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5d172d] text-base">palette</span>
            <label className="text-xs font-bold uppercase tracking-wider text-[#665d54]">
              Estilo y Paleta:
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {Object.entries(curriculumThemes).map(([key, theme]) => {
              const isActive = currentThemeKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onThemeChange(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isActive
                      ? 'border-[#5d172d] bg-[#5d172d]/10 text-[#5d172d] font-bold shadow-xs'
                      : 'border-[rgba(38,33,28,0.15)] bg-[#fdf9f2]/60 text-[#665d54] hover:bg-white'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span>{theme.name.split(' ')[0]}</span>
                </button>
              );
            })}

            {/* Custom Accent Color Picker */}
            <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-[rgba(38,33,28,0.14)]">
              <label className="text-[11px] font-medium text-[#665d54]">Acento:</label>
              <div className="relative flex items-center">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => onCustomColorChange(e.target.value)}
                  className="w-7 h-7 rounded-md border border-[rgba(38,33,28,0.2)] cursor-pointer p-0.5 bg-white"
                  title="Elegir color de acento personalizado"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right: Zoom & Export Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Zoom controls */}
          <div className="flex items-center bg-[#f7f3ec] rounded-lg p-1 border border-[rgba(38,33,28,0.12)]">
            <button
              type="button"
              onClick={() => onZoomChange(Math.max(0.4, Number((zoomLevel - 0.1).toFixed(2))))}
              className="p-1 text-[#665d54] hover:text-[#1c1c18] rounded cursor-pointer"
              title="Reducir zoom"
            >
              <span className="material-symbols-outlined text-sm">zoom_out</span>
            </button>
            <span className="text-xs font-bold text-[#1c1c18] px-2 min-w-[45px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => onZoomChange(Math.min(1.4, Number((zoomLevel + 0.1).toFixed(2))))}
              className="p-1 text-[#665d54] hover:text-[#1c1c18] rounded cursor-pointer"
              title="Aumentar zoom"
            >
              <span className="material-symbols-outlined text-sm">zoom_in</span>
            </button>
            <button
              type="button"
              onClick={() => onZoomChange(0.75)}
              className="px-2 py-0.5 text-[10px] font-semibold text-[#5d172d] hover:bg-white rounded ml-1 cursor-pointer"
            >
              Ajustar
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct PNG Export */}
            <button
              type="button"
              onClick={onExportPng}
              disabled={isExporting}
              className="px-3 py-2 rounded-lg border border-[rgba(38,33,28,0.2)] bg-white text-[#1c1c18] font-bold text-xs hover:bg-[#f7f3ec] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Descargar imagen PNG de alta resolución"
            >
              <span className="material-symbols-outlined text-sm">image</span>
              <span className="hidden sm:inline">Descargar PNG</span>
            </button>

            {/* Print / Save as PDF native */}
            <button
              type="button"
              onClick={onPrint}
              disabled={isExporting}
              className="px-3 py-2 rounded-lg border border-[rgba(38,33,28,0.2)] bg-white text-[#1c1c18] font-bold text-xs hover:bg-[#f7f3ec] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Imprimir o guardar directamente con el motor nativo del navegador"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            {/* Direct High-Res PDF Download */}
            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExporting}
              className="px-4 py-2 rounded-lg bg-[#5d172d] text-white font-bold text-xs uppercase tracking-wider shadow-cta hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Exportando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                  <span>Descargar PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isExporting && exportStatus && (
        <div className="bg-[#5d172d]/10 border border-[#5d172d]/20 text-[#5d172d] text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-sm animate-spin">sync</span>
          <span>{exportStatus}</span>
        </div>
      )}
    </div>
  );
};
