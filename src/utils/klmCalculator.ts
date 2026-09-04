import { CurriculumData } from '../types';

export interface KlmOperatorDefinition {
  code: string;
  name: string;
  action: string;
  timeSec: number;
  description: string;
}

export const KLM_STANDARD_OPERATORS: Record<string, KlmOperatorDefinition> = {
  K: {
    code: 'K',
    name: 'Keystroke',
    action: 'Presionar una tecla',
    timeSec: 0.2,
    description: 'Pulsación de cualquier tecla en el teclado al escribir caracteres.',
  },
  P: {
    code: 'P',
    name: 'Point',
    action: 'Señalar o apuntar con dispositivo de entrada',
    timeSec: 1.1,
    description: 'Mover el cursor del ratón hacia un campo, botón o elemento interactivo.',
  },
  H: {
    code: 'H',
    name: 'Homing',
    action: 'Mover la mano de un dispositivo a otro',
    timeSec: 0.4,
    description: 'Cambiar la mano del teclado al ratón o viceversa.',
  },
  M: {
    code: 'M',
    name: 'Mental Preparation',
    action: 'Pensar en qué hacer a continuación',
    timeSec: 1.2,
    description: 'Pausa cognitiva de decisión o lectura previa a una acción.',
  },
  B: {
    code: 'B',
    name: 'Button Click',
    action: 'Presionar botón del ratón',
    timeSec: 0.1,
    description: 'Hacer clic sobre un botón o selector.',
  },
  DatePicker: {
    code: 'Date-Picker',
    name: 'Date Picker',
    action: 'Entrada de fecha tipo Date-Picker',
    timeSec: 6.81,
    description: 'Interacción con selector de fecha desplegable o calendario.',
  },
  Scrolling: {
    code: 'Scrolling',
    name: 'Scroll',
    action: 'Mover scroll',
    timeSec: 3.96,
    description: 'Desplazamiento vertical de la página o panel para localizar campos.',
  },
  D: {
    code: 'D',
    name: 'Draw',
    action: 'Dibujar o arrastrar',
    timeSec: 1.2,
    description: 'Acción de dibujo manual o arrastre de controles.',
  },
  R: {
    code: 'R',
    name: 'Response Time',
    action: 'Tiempo de Respuesta del Sistema',
    timeSec: 0.5,
    description: 'Tiempo de espera mientras el sistema procesa o descarga el PDF.',
  },
};

export interface KlmTaskStep {
  id: string;
  taskName: string;
  category: 'Datos Personales' | 'Experiencia' | 'Formación' | 'Idiomas' | 'Competencias' | 'Habilidades' | 'Exportación & PDF';
  dataSummary: string;
  operators: {
    K: number;
    P: number;
    H: number;
    M: number;
    B: number;
    DatePicker?: number;
    Scrolling?: number;
    D?: number;
    R?: number;
  };
  stepTimeSec: number;
  explanation: string;
}

export interface KlmAnalysisReport {
  totalEstimatedTimeSec: number;
  totalEstimatedTimeFormatted: string;
  totalOperatorsCount: {
    K: number;
    P: number;
    H: number;
    M: number;
    B: number;
    DatePicker: number;
    Scrolling: number;
    D: number;
    R: number;
  };
  timeBreakdownByOperator: {
    K: number;
    P: number;
    H: number;
    M: number;
    B: number;
    DatePicker: number;
    Scrolling: number;
    D: number;
    R: number;
  };
  timeBreakdownByCategory: Record<string, number>;
  steps: KlmTaskStep[];
  productivityRating: 'Alta' | 'Excelente' | 'Moderada';
}

/**
 * Calculates GOMS-KLM total execution time for creating/editing the curriculum
 * based on the exact user data and mathematical operators from the document.
 */
export function calculateCurriculumKlm(
  data: CurriculumData,
  systemResponseTimeSec: number = 0.5
): KlmAnalysisReport {
  const steps: KlmTaskStep[] = [];

  // Helper to count non-empty string length
  const charCount = (str?: string) => (str ? str.length : 0);

  // 1. Datos Personales
  const personalFields = [
    { name: 'Nombre', val: data.firstName || 'Alejandro' },
    { name: 'Apellido', val: data.lastName || 'Torres' },
    { name: 'Título Profesional', val: data.jobTitle || 'Programador Web' },
    { name: 'Resumen Mi Perfil', val: data.profileSummary || '' },
    { name: 'Teléfono', val: data.phone || '+34 91 123 4567' },
    { name: 'Correo Electrónico', val: data.email || 'hola@unsitiogenial.es' },
    { name: 'Sitio Web', val: data.website || 'www.unsitiogenial.es' },
    { name: 'Dirección', val: data.address || 'Calle Cualquiera 123' },
  ];

  personalFields.forEach((field) => {
    const k = charCount(field.val);
    const p = 1;
    const b = 1;
    const h = 1;
    const m = 1;
    const time =
      k * KLM_STANDARD_OPERATORS.K.timeSec +
      p * KLM_STANDARD_OPERATORS.P.timeSec +
      b * KLM_STANDARD_OPERATORS.B.timeSec +
      h * KLM_STANDARD_OPERATORS.H.timeSec +
      m * KLM_STANDARD_OPERATORS.M.timeSec;

    steps.push({
      id: `personal-${field.name}`,
      taskName: `Ingresar ${field.name}`,
      category: 'Datos Personales',
      dataSummary: `${k} caracteres`,
      operators: { K: k, P: p, H: h, M: m, B: b },
      stepTimeSec: Number(time.toFixed(2)),
      explanation: `M (${KLM_STANDARD_OPERATORS.M.timeSec}s) + P (${KLM_STANDARD_OPERATORS.P.timeSec}s) + B (${KLM_STANDARD_OPERATORS.B.timeSec}s) + H (${KLM_STANDARD_OPERATORS.H.timeSec}s) + ${k}K (${(k * 0.2).toFixed(1)}s)`,
    });
  });

  // 2. Experiencia Laboral
  data.experiences.forEach((exp, idx) => {
    const kCompany = charCount(exp.company);
    const kPeriod = charCount(exp.period);
    const kDesc = charCount(exp.description);
    const totalK = kCompany + kPeriod + kDesc;

    const p = 3;
    const b = 3;
    const h = 3;
    const m = 3;
    const scroll = idx > 1 ? 1 : 0;

    const time =
      totalK * KLM_STANDARD_OPERATORS.K.timeSec +
      p * KLM_STANDARD_OPERATORS.P.timeSec +
      b * KLM_STANDARD_OPERATORS.B.timeSec +
      h * KLM_STANDARD_OPERATORS.H.timeSec +
      m * KLM_STANDARD_OPERATORS.M.timeSec +
      scroll * KLM_STANDARD_OPERATORS.Scrolling.timeSec;

    steps.push({
      id: `exp-${exp.id || idx}`,
      taskName: `Experiencia ${idx + 1}: ${exp.company || 'Empresa'}`,
      category: 'Experiencia',
      dataSummary: `${exp.period || 'Periodo'} (${totalK} caracteres)`,
      operators: {
        K: totalK,
        P: p,
        H: h,
        M: m,
        B: b,
        Scrolling: scroll,
      },
      stepTimeSec: Number(time.toFixed(2)),
      explanation: `3 campos de texto + ${totalK} pulsaciones K + ${m}M preparaciones cognitivas`,
    });
  });

  // 3. Formación Académica
  data.education.forEach((edu, idx) => {
    const kInst = charCount(edu.institution);
    const kDegree = charCount(edu.degree);
    const kPeriod = charCount(edu.period);
    const totalK = kInst + kDegree + kPeriod;

    const p = 3;
    const b = 3;
    const h = 3;
    const m = 2;
    const scroll = 1;

    const time =
      totalK * KLM_STANDARD_OPERATORS.K.timeSec +
      p * KLM_STANDARD_OPERATORS.P.timeSec +
      b * KLM_STANDARD_OPERATORS.B.timeSec +
      h * KLM_STANDARD_OPERATORS.H.timeSec +
      m * KLM_STANDARD_OPERATORS.M.timeSec +
      scroll * KLM_STANDARD_OPERATORS.Scrolling.timeSec;

    steps.push({
      id: `edu-${edu.id || idx}`,
      taskName: `Formación ${idx + 1}: ${edu.institution || 'Institución'}`,
      category: 'Formación',
      dataSummary: `${edu.degree || 'Título'} (${totalK} car.)`,
      operators: {
        K: totalK,
        P: p,
        H: h,
        M: m,
        B: b,
        Scrolling: scroll,
      },
      stepTimeSec: Number(time.toFixed(2)),
      explanation: `Registro académico + ${totalK}K + 1 desplazamiento de Scroll`,
    });
  });

  // 4. Idiomas
  data.languages.forEach((lang, idx) => {
    const kName = charCount(lang.name);
    const kLevel = charCount(lang.level);
    const totalK = kName + kLevel;

    const p = 2;
    const b = 2;
    const h = 2;
    const m = 1;

    const time =
      totalK * KLM_STANDARD_OPERATORS.K.timeSec +
      p * KLM_STANDARD_OPERATORS.P.timeSec +
      b * KLM_STANDARD_OPERATORS.B.timeSec +
      h * KLM_STANDARD_OPERATORS.H.timeSec +
      m * KLM_STANDARD_OPERATORS.M.timeSec;

    steps.push({
      id: `lang-${lang.id || idx}`,
      taskName: `Idioma: ${lang.name || 'Idioma'} (${lang.level || 'Nivel'})`,
      category: 'Idiomas',
      dataSummary: `${lang.level || 'Nivel'} (${totalK} car.)`,
      operators: { K: totalK, P: p, H: h, M: m, B: b },
      stepTimeSec: Number(time.toFixed(2)),
      explanation: `Ingreso de nombre de lengua y nivel`,
    });
  });

  // 5. Competencias (Software con slider / % numérico)
  data.competencies.forEach((comp, idx) => {
    const kName = charCount(comp.name);
    const p = 2;
    const b = 1;
    const d = 1;
    const h = 1;
    const m = 1;

    const time =
      kName * KLM_STANDARD_OPERATORS.K.timeSec +
      p * KLM_STANDARD_OPERATORS.P.timeSec +
      b * KLM_STANDARD_OPERATORS.B.timeSec +
      d * KLM_STANDARD_OPERATORS.D.timeSec +
      h * KLM_STANDARD_OPERATORS.H.timeSec +
      m * KLM_STANDARD_OPERATORS.M.timeSec;

    steps.push({
      id: `comp-${comp.id || idx}`,
      taskName: `Competencia: ${comp.name || 'Software'}`,
      category: 'Competencias',
      dataSummary: `${comp.percentage}% asignado`,
      operators: { K: kName, P: p, H: h, M: m, B: b, D: d },
      stepTimeSec: Number(time.toFixed(2)),
      explanation: `Ajuste interactivo de porcentaje (${comp.percentage}%) con operador de arrastre D (1.2s)`,
    });
  });

  // 6. Habilidades (Rating de 5 estrellas / puntos)
  data.skills.forEach((skill, idx) => {
    const kName = charCount(skill.name);
    const p = 1;
    const b = 1;
    const m = 1;
    const h = 1;

    const time =
      kName * KLM_STANDARD_OPERATORS.K.timeSec +
      p * KLM_STANDARD_OPERATORS.P.timeSec +
      b * KLM_STANDARD_OPERATORS.B.timeSec +
      h * KLM_STANDARD_OPERATORS.H.timeSec +
      m * KLM_STANDARD_OPERATORS.M.timeSec;

    steps.push({
      id: `skill-${skill.id || idx}`,
      taskName: `Habilidad: ${skill.name || 'Habilidad'}`,
      category: 'Habilidades',
      dataSummary: `${skill.rating} / 5 puntos`,
      operators: { K: kName, P: p, H: h, M: m, B: b },
      stepTimeSec: Number(time.toFixed(2)),
      explanation: `Selección directa en escala visual (nivel ${skill.rating})`,
    });
  });

  // 7. Acciones de Exportación y Generación de PDF
  const exportSteps = [
    {
      name: 'Seleccionar Tema / Color de Acento',
      cat: 'Exportación & PDF' as const,
      ops: { P: 1, B: 1, M: 1, H: 0, K: 0 },
      expl: 'Point y Click sobre la paleta de colores',
    },
    {
      name: 'Generar y Descargar PDF A4',
      cat: 'Exportación & PDF' as const,
      ops: { P: 1, B: 1, M: 1, H: 0, K: 0, R: 1 },
      expl: `P + B + M + Tiempo de respuesta del sistema R (${systemResponseTimeSec}s)`,
    },
  ];

  exportSteps.forEach((st, idx) => {
    const time =
      (st.ops.P || 0) * KLM_STANDARD_OPERATORS.P.timeSec +
      (st.ops.B || 0) * KLM_STANDARD_OPERATORS.B.timeSec +
      (st.ops.M || 0) * KLM_STANDARD_OPERATORS.M.timeSec +
      (st.ops.R || 0) * systemResponseTimeSec;

    steps.push({
      id: `export-${idx}`,
      taskName: st.name,
      category: st.cat,
      dataSummary: 'Descarga / Acción de interfaz',
      operators: {
        K: st.ops.K,
        P: st.ops.P,
        H: st.ops.H,
        M: st.ops.M,
        B: st.ops.B,
        R: st.ops.R,
      },
      stepTimeSec: Number(time.toFixed(2)),
      explanation: st.expl,
    });
  });

  // Aggregates
  const totalOperatorsCount = {
    K: 0,
    P: 0,
    H: 0,
    M: 0,
    B: 0,
    DatePicker: 0,
    Scrolling: 0,
    D: 0,
    R: 0,
  };

  const timeBreakdownByCategory: Record<string, number> = {};

  steps.forEach((st) => {
    totalOperatorsCount.K += st.operators.K || 0;
    totalOperatorsCount.P += st.operators.P || 0;
    totalOperatorsCount.H += st.operators.H || 0;
    totalOperatorsCount.M += st.operators.M || 0;
    totalOperatorsCount.B += st.operators.B || 0;
    totalOperatorsCount.DatePicker += st.operators.DatePicker || 0;
    totalOperatorsCount.Scrolling += st.operators.Scrolling || 0;
    totalOperatorsCount.D += st.operators.D || 0;
    totalOperatorsCount.R += st.operators.R || 0;

    timeBreakdownByCategory[st.category] = Number(
      ((timeBreakdownByCategory[st.category] || 0) + st.stepTimeSec).toFixed(2)
    );
  });

  const timeBreakdownByOperator = {
    K: Number((totalOperatorsCount.K * KLM_STANDARD_OPERATORS.K.timeSec).toFixed(2)),
    P: Number((totalOperatorsCount.P * KLM_STANDARD_OPERATORS.P.timeSec).toFixed(2)),
    H: Number((totalOperatorsCount.H * KLM_STANDARD_OPERATORS.H.timeSec).toFixed(2)),
    M: Number((totalOperatorsCount.M * KLM_STANDARD_OPERATORS.M.timeSec).toFixed(2)),
    B: Number((totalOperatorsCount.B * KLM_STANDARD_OPERATORS.B.timeSec).toFixed(2)),
    DatePicker: Number((totalOperatorsCount.DatePicker * KLM_STANDARD_OPERATORS.DatePicker.timeSec).toFixed(2)),
    Scrolling: Number((totalOperatorsCount.Scrolling * KLM_STANDARD_OPERATORS.Scrolling.timeSec).toFixed(2)),
    D: Number((totalOperatorsCount.D * KLM_STANDARD_OPERATORS.D.timeSec).toFixed(2)),
    R: Number((totalOperatorsCount.R * systemResponseTimeSec).toFixed(2)),
  };

  const totalEstimatedTimeSec = Number(
    Object.values(timeBreakdownByOperator)
      .reduce((acc, curr) => acc + curr, 0)
      .toFixed(2)
  );

  const minutes = Math.floor(totalEstimatedTimeSec / 60);
  const seconds = Math.round(totalEstimatedTimeSec % 60);
  const totalEstimatedTimeFormatted = `${minutes}m ${seconds}s (${totalEstimatedTimeSec}s)`;

  return {
    totalEstimatedTimeSec,
    totalEstimatedTimeFormatted,
    totalOperatorsCount,
    timeBreakdownByOperator,
    timeBreakdownByCategory,
    steps,
    productivityRating: totalEstimatedTimeSec < 120 ? 'Excelente' : totalEstimatedTimeSec < 240 ? 'Alta' : 'Moderada',
  };
}
