import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export interface ExportPdfOptions {
  fileName?: string;
  onProgress?: (status: string) => void;
}

export const exportCurriculumToPdf = async (
  elementId: string = 'cv-print-document',
  options: ExportPdfOptions = {}
): Promise<boolean> => {
  const { fileName = 'Curriculum_Vitae.pdf', onProgress } = options;
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    onProgress?.('Preparando documento en alta resolución...');

    // skipFonts: true prevents SecurityError when accessing cross-origin Google Fonts stylesheets cssRules
    const imgData = await toJpeg(element, {
      quality: 0.98,
      pixelRatio: 2.5, // 300 DPI equivalent for crisp A4 PDF output
      backgroundColor: '#ffffff',
      skipFonts: true,
    });

    onProgress?.('Generando archivo PDF (A4)...');

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    pdf.save(fileName);

    onProgress?.('Descarga completada');
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export const exportCurriculumToImage = async (
  elementId: string = 'cv-print-document',
  fileName: string = 'Curriculum_Vitae.png'
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    const dataUrl = await toPng(element, {
      pixelRatio: 2.5,
      backgroundColor: '#ffffff',
      skipFonts: true,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (error) {
    console.error('Error generating Image:', error);
    return false;
  }
};

export const printCurriculumNative = () => {
  window.print();
};
