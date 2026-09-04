import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { AlertCircle, CheckCircle2, Calendar, User, Tag } from 'lucide-react';
import { validateNotEmpty, validatePeriod, formatPeriod } from '../utils/validation';

export const NuevoEventoModal: React.FC = () => {
  const { isNuevoEventoOpen, setIsNuevoEventoOpen, addEvent, showToast } = useBrand();

  const [name, setName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState<'CONFIRMADO' | 'EN MONTAJE' | 'PENDIENTE'>('CONFIRMADO');
  const [touched, setTouched] = useState({ name: false, client: false, dateFrom: false, dateTo: false });

  if (!isNuevoEventoOpen) return null;

  // Validaciones
  const nameError = validateNotEmpty(name, 'El nombre del evento').error;
  const clientError = validateNotEmpty(client, 'El cliente u organización').error;

  const periodValidation = validatePeriod(dateFrom, dateTo, {
    allowFuture: true,
    maxSpanYears: 100,
  });
  const dateFromError = !dateFrom.trim() ? "La fecha 'Desde' no puede estar vacía" : null;
  const dateToError = !dateTo.trim() ? "La fecha 'Hasta' no puede estar vacía" : null;
  const periodError = periodValidation.error;

  const hasErrors = Boolean(nameError || clientError || periodError || dateFromError || dateToError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, client: true, dateFrom: true, dateTo: true });

    if (!hasErrors) {
      const formattedDate = dateFrom.trim() === dateTo.trim()
        ? dateFrom.trim()
        : formatPeriod(dateFrom, dateTo);

      addEvent({
        name: name.trim(),
        date: formattedDate,
        client: client.trim(),
        status,
      });
      showToast('Evento registrado exitosamente');
      setName('');
      setDateFrom('');
      setDateTo('');
      setClient('');
      setStatus('CONFIRMADO');
      setTouched({ name: false, client: false, dateFrom: false, dateTo: false });
      setIsNuevoEventoOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[rgba(38,33,28,0.14)] space-y-6">
        <div className="flex justify-between items-center border-b border-[rgba(38,33,28,0.14)] pb-4">
          <div>
            <h3 className="text-xl font-bold text-[#5d172d] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Nuevo Evento</span>
            </h3>
            <p className="text-xs text-[#665d54] mt-0.5">
              Completa los datos requeridos para programar el evento en el cronograma.
            </p>
          </div>
          <button
            onClick={() => setIsNuevoEventoOpen(false)}
            className="text-[#665d54] hover:text-[#1c1c18] p-1.5 rounded-lg hover:bg-[#f7f3ec] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          {/* Nombre del Evento */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1 flex items-center justify-between">
              <span>Nombre del Evento *</span>
              {touched.name && nameError && (
                <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> Requerido
                </span>
              )}
            </label>
            <input
              type="text"
              placeholder="p.ej. Gala Benéfica Aura 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, name: true }))}
              className={`w-full rounded-lg p-3 text-sm transition-all ${
                touched.name && nameError
                  ? 'border border-rose-500 bg-rose-50/40 focus:ring-1 focus:ring-rose-500'
                  : 'bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] focus:bg-white focus:border-[#5d172d]'
              }`}
            />
            {touched.name && nameError && (
              <p className="text-xs text-rose-600 mt-1">{nameError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cliente */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1 flex items-center justify-between">
                <span>Cliente / Entidad *</span>
                {touched.client && clientError && (
                  <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> Requerido
                  </span>
                )}
              </label>
              <input
                type="text"
                placeholder="p.ej. Fundación Elipsis"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, client: true }))}
                className={`w-full rounded-lg p-3 text-sm transition-all ${
                  touched.client && clientError
                    ? 'border border-rose-500 bg-rose-50/40 focus:ring-1 focus:ring-rose-500'
                    : 'bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] focus:bg-white focus:border-[#5d172d]'
                }`}
              />
              {touched.client && clientError && (
                <p className="text-xs text-rose-600 mt-1">{clientError}</p>
              )}
            </div>

            {/* Fechas de Período (Desde - Hasta) */}
            <div className="sm:col-span-2 space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#534245]">
                  Período del Evento (Desde - Hasta) *
                </label>
                {(touched.dateFrom || touched.dateTo) && periodError && (
                  <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> {periodError}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#665d54] font-medium mb-1">Fecha Inicio (Desde) *</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, dateFrom: true }))}
                    className={`w-full rounded-lg p-2.5 text-sm transition-all ${
                      touched.dateFrom && (dateFromError || periodError)
                        ? 'border border-rose-500 bg-rose-50/40 focus:ring-1 focus:ring-rose-500'
                        : 'bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] focus:bg-white focus:border-[#5d172d]'
                    }`}
                  />
                  {touched.dateFrom && dateFromError && (
                    <p className="text-xs text-rose-600 mt-1">{dateFromError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] text-[#665d54] font-medium mb-1">Fecha Culminación (Hasta) *</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, dateTo: true }))}
                    className={`w-full rounded-lg p-2.5 text-sm transition-all ${
                      touched.dateTo && (dateToError || periodError)
                        ? 'border border-rose-500 bg-rose-50/40 focus:ring-1 focus:ring-rose-500'
                        : 'bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] focus:bg-white focus:border-[#5d172d]'
                    }`}
                  />
                  {touched.dateTo && dateToError && (
                    <p className="text-xs text-rose-600 mt-1">{dateToError}</p>
                  )}
                </div>
              </div>
              {(touched.dateFrom || touched.dateTo) && periodError && !dateFromError && !dateToError && (
                <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {periodError}
                </p>
              )}
            </div>
          </div>

          {/* Estado Inicial */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1">
              Estado Inicial
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] rounded-lg p-3 text-sm focus:outline-none focus:border-[#5d172d]"
            >
              <option value="CONFIRMADO">CONFIRMADO</option>
              <option value="EN MONTAJE">EN MONTAJE</option>
              <option value="PENDIENTE">PENDIENTE</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[rgba(38,33,28,0.14)]">
            <button
              type="button"
              onClick={() => setIsNuevoEventoOpen(false)}
              className="px-4 py-2.5 rounded-lg border border-[rgba(38,33,28,0.14)] text-xs font-bold uppercase tracking-wider text-[#665d54] hover:bg-[#f7f3ec] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#5d172d] text-white text-xs font-bold uppercase tracking-wider shadow-cta hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Evento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
