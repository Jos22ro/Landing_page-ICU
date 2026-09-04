import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { CurriculumEditor } from './CurriculumEditor';
import { CurriculumDocument, curriculumThemes } from './CurriculumDocument';
import { CurriculumPreviewControls } from './CurriculumPreviewControls';
import { exportCurriculumToPdf, exportCurriculumToImage, printCurriculumNative } from '../utils/pdfExport';

export type CurriculumViewMode = 'formulario' | 'vista_previa' | 'dividida';

export const CurriculumView: React.FC = () => {
  const {
    curriculumData,
    saveCurriculumData,
    resetCurriculumData,
    showToast,
  } = useBrand();

  const [viewMode, setViewMode] = useState<CurriculumViewMode>('vista_previa');
  const [selectedThemeKey, setSelectedThemeKey] = useState<string>('classic_pdf');
  const [customAccentColor, setCustomAccentColor] = useState<string>(
    curriculumThemes.classic_pdf.accentColor
  );
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string>('');

  const handleThemeChange = (key: string) => {
    setSelectedThemeKey(key);
    if (curriculumThemes[key]) {
      setCustomAccentColor(curriculumThemes[key].accentColor);
    }
    showToast(`Tema '${curriculumThemes[key]?.name || key}' aplicado`);
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    const fileName = `CV_${curriculumData.firstName || 'Alejandro'}_${curriculumData.lastName || 'Torres'}.pdf`
      .replace(/\s+/g, '_');

    const success = await exportCurriculumToPdf('cv-print-document', {
      fileName,
      onProgress: (status) => setExportStatus(status),
    });

    setIsExporting(false);
    setExportStatus('');

    if (success) {
      showToast('¡PDF generado y descargado con éxito!');
    } else {
      showToast('Hubo un inconveniente al generar el PDF. Puedes usar el botón Imprimir.');
    }
  };

  const handleExportPng = async () => {
    setIsExporting(true);
    setExportStatus('Generando imagen de alta resolución...');
    const fileName = `CV_${curriculumData.firstName || 'Alejandro'}_${curriculumData.lastName || 'Torres'}.png`
      .replace(/\s+/g, '_');

    const success = await exportCurriculumToImage('cv-print-document', fileName);
    setIsExporting(false);
    setExportStatus('');

    if (success) {
      showToast('¡Imagen PNG descargada con éxito!');
    }
  };

  const handlePrint = () => {
    showToast('Abriendo ventana de impresión A4...');
    printCurriculumNative();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header & Mode Switcher */}
      <header className="border-b border-[rgba(38,33,28,0.14)] pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1c18] tracking-tight">
              Creador de Currículum
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5d172d]/10 text-[#5d172d] border border-[#5d172d]/20 uppercase tracking-wider">
              Fase 2 · Plantilla & Exportación PDF
            </span>
          </div>
          <p className="text-sm text-[#665d54]">
            Diseña, edita y exporta tu CV en alta resolución listo para imprimir en formato estándar A4.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Mode Switcher */}
          <div className="bg-[#e6e2db] p-1 rounded-lg flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('formulario')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'formulario'
                  ? 'bg-white text-[#5d172d] shadow-sm'
                  : 'text-[#665d54] hover:text-[#1c1c18]'
              }`}
              title="Ver únicamente el formulario de edición"
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              <span className="hidden sm:inline">Formulario</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('vista_previa')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'vista_previa'
                  ? 'bg-white text-[#5d172d] shadow-sm'
                  : 'text-[#665d54] hover:text-[#1c1c18]'
              }`}
              title="Ver el documento A4 final y opciones de exportación"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span className="hidden sm:inline">Diseño & PDF</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('dividida');
                setZoomLevel(0.65);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'dividida'
                  ? 'bg-white text-[#5d172d] shadow-sm'
                  : 'text-[#665d54] hover:text-[#1c1c18]'
              }`}
              title="Editar en vivo con previsualización simultánea"
            >
              <span className="material-symbols-outlined text-sm">vertical_split</span>
              <span className="hidden sm:inline">Vista Dividida</span>
            </button>
          </div>

          {/* Quick buttons */}
          <button
            type="button"
            onClick={resetCurriculumData}
            className="px-3 py-2 rounded-lg border border-[rgba(38,33,28,0.2)] bg-white text-[#665d54] font-semibold text-xs hover:bg-[#f7f3ec] hover:text-[#1c1c18] transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            title="Restaurar a los datos originales del PDF de muestra"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            <span className="hidden md:inline">Restaurar Muestra</span>
          </button>

          <button
            type="button"
            onClick={saveCurriculumData}
            className="px-3.5 py-2 rounded-lg bg-[#5d172d] text-white font-bold text-xs uppercase tracking-wider shadow-cta hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            <span>Guardar</span>
          </button>
        </div>
      </header>

      {/* Controls Bar for Themes & Exports (Visible in Preview and Split modes) */}
      {viewMode !== 'formulario' && (
        <CurriculumPreviewControls
          currentThemeKey={selectedThemeKey}
          onThemeChange={handleThemeChange}
          customColor={customAccentColor}
          onCustomColorChange={setCustomAccentColor}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onExportPdf={handleExportPdf}
          onPrint={handlePrint}
          onExportPng={handleExportPng}
          isExporting={isExporting}
          exportStatus={exportStatus}
        />
      )}

      {/* VIEW MODES */}

      {/* 1. Only Form Mode */}
      {viewMode === 'formulario' && (
        <div className="max-w-[1080px] mx-auto space-y-6">
          <div className="flex items-center justify-between bg-[#fdf9f2] p-4 rounded-xl border border-[rgba(38,33,28,0.14)]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#5d172d] text-2xl">feed</span>
              <div>
                <h4 className="font-bold text-sm text-[#1c1c18]">Modo Edición de Contenido</h4>
                <p className="text-xs text-[#665d54]">Modifica los textos, experiencias y habilidades. Los cambios se reflejarán inmediatamente en el PDF.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('vista_previa')}
              className="px-4 py-2 bg-[#5d172d] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-90"
            >
              <span className="material-symbols-outlined text-sm">preview</span>
              <span>Ver Diseño A4</span>
            </button>
          </div>

          <CurriculumEditor />
        </div>
      )}

      {/* 2. Full Preview / PDF Document Mode */}
      {viewMode === 'vista_previa' && (
        <div
          id="cv-preview-container"
          className="w-full flex flex-col items-center justify-start p-4 sm:p-8 bg-[#2d2926]/5 rounded-2xl border border-[rgba(38,33,28,0.12)] min-h-[700px] overflow-auto"
        >
          {/* Scaled A4 Container */}
          <div
            className="transition-transform duration-200 origin-top shadow-2xl rounded-sm"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              marginBottom: `${(zoomLevel - 1) * 350}px`,
            }}
          >
            <CurriculumDocument
              data={curriculumData}
              themeKey={selectedThemeKey}
              customAccentColor={customAccentColor}
            />
          </div>
        </div>
      )}

      {/* 3. Interactive Split View (Editor Left, Document Right) */}
      {viewMode === 'dividida' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Editor (Scrollable) */}
          <div className="xl:col-span-6 space-y-4 max-h-[880px] overflow-y-auto pr-1">
            <div className="bg-white p-3.5 rounded-xl border border-[rgba(38,33,28,0.14)] flex items-center justify-between sticky top-0 z-20 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5d172d] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">edit</span>
                Editor en Vivo
              </span>
              <span className="text-[11px] text-[#665d54]">Escribe para ver los cambios a la derecha</span>
            </div>
            <CurriculumEditor compact />
          </div>

          {/* Right Column: Live A4 Document */}
          <div
            id="cv-preview-container"
            className="xl:col-span-6 bg-[#2d2926]/5 p-4 sm:p-6 rounded-2xl border border-[rgba(38,33,28,0.12)] flex flex-col items-center justify-start overflow-hidden min-h-[880px] sticky top-4"
          >
            <div
              className="transition-transform duration-150 origin-top shadow-xl"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
              }}
            >
              <CurriculumDocument
                data={curriculumData}
                themeKey={selectedThemeKey}
                customAccentColor={customAccentColor}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden print document rendered for strict native browser printing */}
      <div className="hidden print:block">
        <CurriculumDocument
          data={curriculumData}
          themeKey={selectedThemeKey}
          customAccentColor={customAccentColor}
        />
      </div>
    </div>
  );
};
