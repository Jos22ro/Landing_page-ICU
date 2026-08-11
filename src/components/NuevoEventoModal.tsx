import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';

export const NuevoEventoModal: React.FC = () => {
  const { isNuevoEventoOpen, setIsNuevoEventoOpen, addEvent } = useBrand();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState<'CONFIRMADO' | 'EN MONTAJE' | 'PENDIENTE'>('CONFIRMADO');

  if (!isNuevoEventoOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && client.trim()) {
      addEvent({
        name: name.trim(),
        date: date || 'Próximamente',
        client: client.trim(),
        status,
      });
      setName('');
      setDate('');
      setClient('');
      setStatus('CONFIRMADO');
      setIsNuevoEventoOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[rgba(38,33,28,0.14)] space-y-6">
        <div className="flex justify-between items-center border-b border-[rgba(38,33,28,0.14)] pb-4">
          <h3 className="text-xl font-bold text-[#5d172d]">Nuevo Evento</h3>
          <button
            onClick={() => setIsNuevoEventoOpen(false)}
            className="text-[#665d54] hover:text-[#1c1c18] p-1 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1">
              Nombre del Evento
            </label>
            <input
              type="text"
              required
              placeholder="p.ej. Gala Benéfica Aura 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] rounded-lg p-3 text-sm focus:outline-none focus:border-[#5d172d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1">
                Cliente / Organización
              </label>
              <input
                type="text"
                required
                placeholder="p.ej. Fundación Elipsis"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] rounded-lg p-3 text-sm focus:outline-none focus:border-[#5d172d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1">
                Fecha
              </label>
              <input
                type="text"
                placeholder="Oct 24, 2024"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] rounded-lg p-3 text-sm focus:outline-none focus:border-[#5d172d]"
              />
            </div>
          </div>

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
              className="px-5 py-2.5 rounded-lg border border-[rgba(38,33,28,0.14)] text-xs font-bold uppercase tracking-wider text-[#665d54]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#5d172d] text-white text-xs font-bold uppercase tracking-wider shadow-cta hover:opacity-90"
            >
              Crear Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
