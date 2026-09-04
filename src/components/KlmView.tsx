import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import {
  KLM_STANDARD_OPERATORS,
  calculateCurriculumKlm,
  KlmOperatorDefinition,
} from '../utils/klmCalculator';
import {
  Clock,
  Keyboard,
  MousePointer,
  ArrowLeftRight,
  Brain,
  Mouse,
  Calendar,
  MoveVertical,
  Pencil,
  Zap,
  CheckCircle2,
  Filter,
  Info,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const KlmView: React.FC = () => {
  const { curriculumData, setActiveTab } = useBrand();
  const [activeSubTab, setActiveSubTab] = useState<'resumen' | 'matriz' | 'subtareas' | 'calculadora_interactiva' | 'fundamentos'>('resumen');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [systemResponseTime, setSystemResponseTime] = useState<number>(0.5);

  // Interactive custom calculator states
  const [customK, setCustomK] = useState<number>(120);
  const [customP, setCustomP] = useState<number>(14);
  const [customH, setCustomH] = useState<number>(10);
  const [customM, setCustomM] = useState<number>(8);
  const [customB, setCustomB] = useState<number>(12);
  const [customDatePicker, setCustomDatePicker] = useState<number>(2);
  const [customScroll, setCustomScroll] = useState<number>(3);
  const [customD, setCustomD] = useState<number>(4);
  const [customR, setCustomR] = useState<number>(1);
  const [customRTime, setCustomRTime] = useState<number>(0.5);

  const report = calculateCurriculumKlm(curriculumData, systemResponseTime);

  const filteredSteps =
    categoryFilter === 'all'
      ? report.steps
      : report.steps.filter((s) => s.category === categoryFilter);

  const operatorIcons: Record<string, React.ReactNode> = {
    K: <Keyboard className="w-4 h-4 text-emerald-600" />,
    P: <MousePointer className="w-4 h-4 text-blue-600" />,
    H: <ArrowLeftRight className="w-4 h-4 text-amber-600" />,
    M: <Brain className="w-4 h-4 text-purple-600" />,
    B: <Mouse className="w-4 h-4 text-rose-600" />,
    DatePicker: <Calendar className="w-4 h-4 text-orange-600" />,
    Scrolling: <MoveVertical className="w-4 h-4 text-teal-600" />,
    D: <Pencil className="w-4 h-4 text-indigo-600" />,
    R: <Zap className="w-4 h-4 text-cyan-600" />,
  };

  const categories = Array.from(new Set(report.steps.map((s) => s.category)));

  // Calculate interactive simulation
  const customTotalTime = Number(
    (
      customK * KLM_STANDARD_OPERATORS.K.timeSec +
      customP * KLM_STANDARD_OPERATORS.P.timeSec +
      customH * KLM_STANDARD_OPERATORS.H.timeSec +
      customM * KLM_STANDARD_OPERATORS.M.timeSec +
      customB * KLM_STANDARD_OPERATORS.B.timeSec +
      customDatePicker * KLM_STANDARD_OPERATORS.DatePicker.timeSec +
      customScroll * KLM_STANDARD_OPERATORS.Scrolling.timeSec +
      customD * KLM_STANDARD_OPERATORS.D.timeSec +
      customR * customRTime
    ).toFixed(2)
  );

  const totalOpsCount = (Object.values(report.totalOperatorsCount) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <header className="border-b border-[rgba(38,33,28,0.14)] pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1c18] tracking-tight flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#5d172d] text-white flex items-center justify-center text-base shadow-xs">
                <Clock className="w-4 h-4" />
              </span>
              <span>Modelo GOMS - KLM</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5d172d]/10 text-[#5d172d] border border-[#5d172d]/20 uppercase tracking-wider">
              Keystroke-Level Model · HCI
            </span>
          </div>
          <p className="text-sm text-[#665d54]">
            Análisis cuantitativo y predictivo del tiempo de ejecución que le toma a un usuario experto completar y exportar el currículum.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('curriculum')}
            className="px-4 py-2 rounded-lg bg-[#5d172d] text-white font-bold text-xs uppercase tracking-wider shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Ver Currículum</span>
          </button>
        </div>
      </header>

      {/* Main KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[rgba(38,33,28,0.14)] p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#665d54] uppercase tracking-wider">
              Tiempo Total KLM (T_execute)
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#5d172d]/10 text-[#5d172d] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#5d172d] mt-2">
            {report.totalEstimatedTimeFormatted}
          </div>
          <p className="text-xs text-[#665d54] mt-1">
            Basado en los datos actuales del formulario de CV
          </p>
        </div>

        <div className="bg-white border border-[rgba(38,33,28,0.14)] p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#665d54] uppercase tracking-wider">
              Total Acciones / Operadores
            </span>
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1c1c18] mt-2">
            {totalOpsCount} <span className="text-sm font-semibold text-[#665d54]">operaciones</span>
          </div>
          <p className="text-xs text-[#665d54] mt-1">
            {report.totalOperatorsCount.K} pulsaciones de tecla (K)
          </p>
        </div>

        <div className="bg-white border border-[rgba(38,33,28,0.14)] p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#665d54] uppercase tracking-wider">
              Carga Cognitiva (M)
            </span>
            <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-800 mt-2">
            {report.timeBreakdownByOperator.M}s <span className="text-sm font-semibold text-[#665d54]">({report.totalOperatorsCount.M} pausas)</span>
          </div>
          <p className="text-xs text-[#665d54] mt-1">
            1.2s por preparación mental de decisión
          </p>
        </div>

        <div className="bg-white border border-[rgba(38,33,28,0.14)] p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#665d54] uppercase tracking-wider">
              Interacción Mouse (P + B)
            </span>
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Mouse className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-800 mt-2">
            {(report.timeBreakdownByOperator.P + report.timeBreakdownByOperator.B).toFixed(1)}s
          </div>
          <p className="text-xs text-[#665d54] mt-1">
            {report.totalOperatorsCount.P} apuntados + {report.totalOperatorsCount.B} clics
          </p>
        </div>
      </div>

      {/* Subtabs Bar */}
      <div className="bg-white p-1.5 rounded-xl border border-[rgba(38,33,28,0.14)] flex items-center justify-between flex-wrap gap-2 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => setActiveSubTab('resumen')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'resumen'
                ? 'bg-[#5d172d] text-white shadow-xs'
                : 'text-[#665d54] hover:text-[#1c1c18] hover:bg-[#ede8e1]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Resumen del Currículum</span>
          </button>

          <button
            onClick={() => setActiveSubTab('matriz')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'matriz'
                ? 'bg-[#5d172d] text-white shadow-xs'
                : 'text-[#665d54] hover:text-[#1c1c18] hover:bg-[#ede8e1]'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Matriz de Operadores</span>
          </button>

          <button
            onClick={() => setActiveSubTab('subtareas')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'subtareas'
                ? 'bg-[#5d172d] text-white shadow-xs'
                : 'text-[#665d54] hover:text-[#1c1c18] hover:bg-[#ede8e1]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Desglose por Subtarea</span>
          </button>

          <button
            onClick={() => setActiveSubTab('calculadora_interactiva')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'calculadora_interactiva'
                ? 'bg-[#5d172d] text-white shadow-xs'
                : 'text-[#665d54] hover:text-[#1c1c18] hover:bg-[#ede8e1]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulador Personalizado</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fundamentos')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'fundamentos'
                ? 'bg-[#5d172d] text-white shadow-xs'
                : 'text-[#665d54] hover:text-[#1c1c18] hover:bg-[#ede8e1]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Fundamentos Teóricos</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-2 text-xs">
          <span className="text-[#665d54] font-medium">Respuesta Sistema (R):</span>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={systemResponseTime}
            onChange={(e) => setSystemResponseTime(Number(e.target.value) || 0)}
            className="w-14 px-2 py-1 bg-[#f8f6f2] border border-[rgba(38,33,28,0.2)] rounded text-center font-bold text-[#1c1c18]"
          />
          <span className="text-[#665d54]">seg</span>
        </div>
      </div>

      {/* CONTENT FOR TABS */}

      {/* 1. RESUMEN DEL CURRICULUM */}
      {activeSubTab === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Category breakdown */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[rgba(38,33,28,0.14)] p-6 rounded-xl shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(38,33,28,0.1)] pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#1c1c18] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[#5d172d]" />
                    Tiempo KLM por Módulo del Currículum
                  </h3>
                  <p className="text-xs text-[#665d54] mt-0.5">
                    Proporción de tiempo que consume cada sección al ser completada
                  </p>
                </div>
                <span className="font-bold text-sm text-[#5d172d]">
                  {report.totalEstimatedTimeSec}s Total
                </span>
              </div>

              <div className="space-y-4">
                {Object.entries(report.timeBreakdownByCategory).map(([category, timeSec]) => {
                  const percentage = Math.round(((timeSec as number) / report.totalEstimatedTimeSec) * 100);
                  return (
                    <div key={category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1c1c18]">{category}</span>
                        <span className="text-[#665d54] font-medium font-mono">
                          {timeSec}s ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#f0eae1] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5d172d] rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations based on KLM */}
            <div className="bg-[#fdf9f2] border border-[rgba(38,33,28,0.12)] p-5 rounded-xl space-y-3">
              <h4 className="font-bold text-sm text-[#1c1c18] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5d172d]" />
                Diagnóstico de Usabilidad según GOMS-KLM
              </h4>
              <ul className="text-xs text-[#665d54] space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-[#1c1c18]">Bajo cambio de contexto (Homing H):</strong> El formulario agrupa campos de texto continuos, reduciendo transiciones innecesarias entre teclado y ratón.
                </li>
                <li>
                  <strong className="text-[#1c1c18]">Feedback visual instantáneo:</strong> La actualización en tiempo real del documento elimina tiempos de espera cognitivos (M) de incertidumbre.
                </li>
                <li>
                  <strong className="text-[#1c1c18]">Exportación en 1-Clic:</strong> La descarga directa de PDF requiere un único operador <code className="bg-white px-1 rounded border border-[#ddd]">P + B + R</code>, alcanzando la máxima eficiencia predictiva.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Operators breakdown cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[rgba(38,33,28,0.14)] p-5 rounded-xl shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#1c1c18] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-blue-600" />
                Desglose por Tipo de Operador KLM
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#f8f6f2] border border-[rgba(38,33,28,0.08)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1c1c18]">
                    <Keyboard className="w-3.5 h-3.5 text-emerald-600" />
                    K (Pulsación)
                  </div>
                  <div className="text-xl font-black text-emerald-700 mt-1">
                    {report.timeBreakdownByOperator.K}s
                  </div>
                  <div className="text-[10px] text-[#665d54]">{report.totalOperatorsCount.K} teclas @ 0.2s</div>
                </div>

                <div className="p-3 rounded-lg bg-[#f8f6f2] border border-[rgba(38,33,28,0.08)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1c1c18]">
                    <MousePointer className="w-3.5 h-3.5 text-blue-600" />
                    P (Apuntar)
                  </div>
                  <div className="text-xl font-black text-blue-700 mt-1">
                    {report.timeBreakdownByOperator.P}s
                  </div>
                  <div className="text-[10px] text-[#665d54]">{report.totalOperatorsCount.P} veces @ 1.1s</div>
                </div>

                <div className="p-3 rounded-lg bg-[#f8f6f2] border border-[rgba(38,33,28,0.08)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1c1c18]">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
                    H (Mano/Homing)
                  </div>
                  <div className="text-xl font-black text-amber-700 mt-1">
                    {report.timeBreakdownByOperator.H}s
                  </div>
                  <div className="text-[10px] text-[#665d54]">{report.totalOperatorsCount.H} cambios @ 0.4s</div>
                </div>

                <div className="p-3 rounded-lg bg-[#f8f6f2] border border-[rgba(38,33,28,0.08)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1c1c18]">
                    <Brain className="w-3.5 h-3.5 text-purple-600" />
                    M (Cognición)
                  </div>
                  <div className="text-xl font-black text-purple-700 mt-1">
                    {report.timeBreakdownByOperator.M}s
                  </div>
                  <div className="text-[10px] text-[#665d54]">{report.totalOperatorsCount.M} pausas @ 1.2s</div>
                </div>

                <div className="p-3 rounded-lg bg-[#f8f6f2] border border-[rgba(38,33,28,0.08)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1c1c18]">
                    <Mouse className="w-3.5 h-3.5 text-rose-600" />
                    B (Clic Mouse)
                  </div>
                  <div className="text-xl font-black text-rose-700 mt-1">
                    {report.timeBreakdownByOperator.B}s
                  </div>
                  <div className="text-[10px] text-[#665d54]">{report.totalOperatorsCount.B} clics @ 0.1s</div>
                </div>

                <div className="p-3 rounded-lg bg-[#f8f6f2] border border-[rgba(38,33,28,0.08)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1c1c18]">
                    <MoveVertical className="w-3.5 h-3.5 text-teal-600" />
                    Scrolling
                  </div>
                  <div className="text-xl font-black text-teal-700 mt-1">
                    {report.timeBreakdownByOperator.Scrolling}s
                  </div>
                  <div className="text-[10px] text-[#665d54]">{report.totalOperatorsCount.Scrolling} scrolls @ 3.96s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MATRIZ DE OPERADORES */}
      {activeSubTab === 'matriz' && (
        <div className="bg-white border border-[rgba(38,33,28,0.14)] rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 bg-[#f8f6f2] border-b border-[rgba(38,33,28,0.14)] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#1c1c18]">Tabla Oficial de Operadores KLM (Card, Moran & Newell)</h3>
              <p className="text-xs text-[#665d54]">Valores estándar de tiempo empírico en segundos</p>
            </div>
            <span className="text-xs text-[#5d172d] font-bold bg-[#5d172d]/10 px-3 py-1 rounded-full">
              Currículum Vitae Actual
            </span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#fdf9f2] text-[#1c1c18] font-bold border-b border-[rgba(38,33,28,0.1)]">
              <tr>
                <th className="p-3">Operador</th>
                <th className="p-3">Acción Básica</th>
                <th className="p-3">Descripción de Interacción</th>
                <th className="p-3 text-center">Tiempo (s)</th>
                <th className="p-3 text-center">Frecuencia en CV</th>
                <th className="p-3 text-right">Subtotal (s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(38,33,28,0.08)]">
              {Object.entries(KLM_STANDARD_OPERATORS).map(([key, op]: [string, KlmOperatorDefinition]) => {
                const count = (report.totalOperatorsCount as Record<string, number>)[key] || 0;
                const time = (report.timeBreakdownByOperator as Record<string, number>)[key] || 0;
                return (
                  <tr key={key} className="hover:bg-[#fdf9f2] transition-colors">
                    <td className="p-3 font-bold text-[#5d172d] flex items-center gap-2">
                      {operatorIcons[key]}
                      <span className="text-sm font-mono font-extrabold">{op.code}</span>
                    </td>
                    <td className="p-3 font-bold text-[#1c1c18]">{op.action}</td>
                    <td className="p-3 text-[#665d54] text-[11px]">{op.description}</td>
                    <td className="p-3 text-center font-mono font-bold text-[#1c1c18]">
                      {key === 'R' ? `${systemResponseTime}s` : `${op.timeSec}s`}
                    </td>
                    <td className="p-3 text-center font-mono font-bold bg-[#fdf9f2]/50 text-[#1c1c18]">
                      {count}
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-[#5d172d]">
                      {time.toFixed(2)}s
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-[#26211c] text-white font-bold">
              <tr>
                <td colSpan={4} className="p-3 text-right uppercase tracking-wider text-xs">
                  Tiempo Total de Ejecución GOMS-KLM:
                </td>
                <td className="p-3 text-center font-mono text-amber-300">
                  {totalOpsCount} ops
                </td>
                <td className="p-3 text-right font-mono text-base text-amber-300">
                  {report.totalEstimatedTimeSec}s ({report.totalEstimatedTimeFormatted})
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* 3. DESGLOSE POR SUBTAREA */}
      {activeSubTab === 'subtareas' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[rgba(38,33,28,0.14)] flex items-center justify-between flex-wrap gap-2 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-bold text-[#665d54] flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filtrar Sección:
              </span>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-[#5d172d] text-white'
                    : 'bg-[#f0eae1] text-[#665d54] hover:text-[#1c1c18]'
                }`}
              >
                Todas ({report.steps.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-[#5d172d] text-white'
                      : 'bg-[#f0eae1] text-[#665d54] hover:text-[#1c1c18]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs text-[#665d54]">
              {filteredSteps.length} operaciones registradas
            </span>
          </div>

          <div className="bg-white border border-[rgba(38,33,28,0.14)] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f8f6f2] text-[#1c1c18] font-bold border-b border-[rgba(38,33,28,0.14)]">
                <tr>
                  <th className="p-3">Tarea / Entrada</th>
                  <th className="p-3">Sección</th>
                  <th className="p-3">Contenido Evaluado</th>
                  <th className="p-3 text-center">Fórmula KLM Desglosada</th>
                  <th className="p-3 text-right">Tiempo Estimado (s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(38,33,28,0.08)]">
                {filteredSteps.map((step) => (
                  <tr key={step.id} className="hover:bg-[#fdf9f2] transition-colors">
                    <td className="p-3 font-bold text-[#1c1c18]">{step.taskName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5d172d]/10 text-[#5d172d]">
                        {step.category}
                      </span>
                    </td>
                    <td className="p-3 text-[#665d54] font-mono text-[11px] truncate max-w-[200px]">
                      {step.dataSummary}
                    </td>
                    <td className="p-3 text-center font-mono text-[11px] text-[#333]">
                      {step.explanation}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[#5d172d]">
                      {step.stepTimeSec}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SIMULADOR PERSONALIZADO */}
      {activeSubTab === 'calculadora_interactiva' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-[rgba(38,33,28,0.14)] p-6 rounded-xl shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-base text-[#1c1c18] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#5d172d]" />
                Simulador de Acciones Interactivas
              </h3>
              <p className="text-xs text-[#665d54] mt-1">
                Ajusta la cantidad de operadores para predecir el tiempo de cualquier formulario o flujo de trabajo alternativo:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1c1c18] flex items-center justify-between">
                  <span>Pulsaciones de Tecla (K = 0.2s):</span>
                  <span className="text-[#5d172d]">{customK}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={customK}
                  onChange={(e) => setCustomK(Number(e.target.value))}
                  className="w-full accent-[#5d172d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1c1c18] flex items-center justify-between">
                  <span>Apuntar con Ratón (P = 1.1s):</span>
                  <span className="text-[#5d172d]">{customP}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={customP}
                  onChange={(e) => setCustomP(Number(e.target.value))}
                  className="w-full accent-[#5d172d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1c1c18] flex items-center justify-between">
                  <span>Transiciones Mano (H = 0.4s):</span>
                  <span className="text-[#5d172d]">{customH}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={customH}
                  onChange={(e) => setCustomH(Number(e.target.value))}
                  className="w-full accent-[#5d172d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1c1c18] flex items-center justify-between">
                  <span>Pausas Cognitivas (M = 1.2s):</span>
                  <span className="text-[#5d172d]">{customM}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={customM}
                  onChange={(e) => setCustomM(Number(e.target.value))}
                  className="w-full accent-[#5d172d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1c1c18] flex items-center justify-between">
                  <span>Clics de Mouse (B = 0.1s):</span>
                  <span className="text-[#5d172d]">{customB}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={customB}
                  onChange={(e) => setCustomB(Number(e.target.value))}
                  className="w-full accent-[#5d172d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1c1c18] flex items-center justify-between">
                  <span>Date-Picker (6.81s):</span>
                  <span className="text-[#5d172d]">{customDatePicker}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={customDatePicker}
                  onChange={(e) => setCustomDatePicker(Number(e.target.value))}
                  className="w-full accent-[#5d172d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1c1c18] flex items-center justify-between">
                  <span>Scrolls de Página (3.96s):</span>
                  <span className="text-[#5d172d]">{customScroll}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={customScroll}
                  onChange={(e) => setCustomScroll(Number(e.target.value))}
                  className="w-full accent-[#5d172d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1c1c18] flex items-center justify-between">
                  <span>Arrastres / Dibujo (D = 1.2s):</span>
                  <span className="text-[#5d172d]">{customD}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={customD}
                  onChange={(e) => setCustomD(Number(e.target.value))}
                  className="w-full accent-[#5d172d]"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#26211c] text-white p-6 rounded-xl shadow-md space-y-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Resultado de la Simulación
              </span>
              <div className="text-4xl font-black text-white mt-2">
                {customTotalTime}s
              </div>
              <div className="text-sm text-white/70 mt-1">
                {(customTotalTime / 60).toFixed(1)} minutos de interacción estimada
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between text-white/80">
                <span>Tiempo de Tipeo (K):</span>
                <span className="font-mono font-bold text-white">{(customK * 0.2).toFixed(1)}s</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Tiempo de Apuntado y Clic (P + B):</span>
                <span className="font-mono font-bold text-white">{(customP * 1.1 + customB * 0.1).toFixed(1)}s</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Tiempo Cognitivo (M):</span>
                <span className="font-mono font-bold text-white">{(customM * 1.2).toFixed(1)}s</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Tiempo de Scroll & Date-Picker:</span>
                <span className="font-mono font-bold text-white">{(customScroll * 3.96 + customDatePicker * 6.81).toFixed(1)}s</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCustomK(report.totalOperatorsCount.K);
                setCustomP(report.totalOperatorsCount.P);
                setCustomH(report.totalOperatorsCount.H);
                setCustomM(report.totalOperatorsCount.M);
                setCustomB(report.totalOperatorsCount.B);
                setCustomDatePicker(report.totalOperatorsCount.DatePicker);
                setCustomScroll(report.totalOperatorsCount.Scrolling);
                setCustomD(report.totalOperatorsCount.D);
              }}
              className="w-full py-2.5 bg-[#5d172d] hover:bg-[#7a2e43] text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs uppercase tracking-wider"
            >
              Copiar Datos Actuales del CV
            </button>
          </div>
        </div>
      )}

      {/* 5. FUNDAMENTOS TEORICOS */}
      {activeSubTab === 'fundamentos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-[rgba(38,33,28,0.14)] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-[#5d172d] text-white font-bold flex items-center justify-center mb-3">
                G
              </div>
              <h4 className="font-bold text-[#1c1c18] mb-1 text-sm">GOAL (Metas)</h4>
              <p className="text-xs text-[#665d54] leading-relaxed">
                El estado o resultado final que el usuario busca conseguir en el sistema (ej. Crear, editar y descargar un CV profesional).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[rgba(38,33,28,0.14)] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center mb-3">
                O
              </div>
              <h4 className="font-bold text-[#1c1c18] mb-1 text-sm">OPERATORS (Operadores)</h4>
              <p className="text-xs text-[#665d54] leading-relaxed">
                Acciones elementales perceptuales, motrices o cognitivas que modifican el estado de la tarea (K, P, H, M, B, Date-Picker, Scroll, D, R).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[rgba(38,33,28,0.14)] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-3">
                M
              </div>
              <h4 className="font-bold text-[#1c1c18] mb-1 text-sm">METHODS (Métodos)</h4>
              <p className="text-xs text-[#665d54] leading-relaxed">
                Secuencias de pasos organizados y operadores que permiten alcanzar un objetivo de manera sistemática.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[rgba(38,33,28,0.14)] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center mb-3">
                S
              </div>
              <h4 className="font-bold text-[#1c1c18] mb-1 text-sm">SELECTION RULES (Reglas)</h4>
              <p className="text-xs text-[#665d54] leading-relaxed">
                Condiciones que determinan qué método seleccionar cuando existen múltiples caminos alternativos.
              </p>
            </div>
          </div>

          <div className="bg-[#f8f6f2] p-6 rounded-xl border border-[rgba(38,33,28,0.12)] space-y-4">
            <h4 className="font-bold text-[#1c1c18] text-base">Ecuación Predictiva KLM</h4>
            <p className="text-xs text-[#665d54] leading-relaxed">
              El modelo Keystroke-Level Model predice el tiempo que le toma a un usuario experto ejecutar una tarea rutinaria sin cometer errores:
            </p>
            <div className="bg-white p-4 rounded-lg border border-[rgba(38,33,28,0.15)] font-mono text-center text-xs text-[#5d172d] font-bold shadow-xs overflow-x-auto">
              T_execute = T_K · n_K + T_P · n_P + T_H · n_H + T_M · n_M + T_B · n_B + T_DatePicker · n_DatePicker + T_Scroll · n_Scroll + T_D · n_D + T_R · n_R
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
