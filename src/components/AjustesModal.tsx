import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';

export const AjustesModal: React.FC = () => {
  const { isAjustesOpen, setIsAjustesOpen, user, showToast } = useBrand();
  const [agencyName, setAgencyName] = useState('ICU Agencia de Eventos');
  const [version, setVersion] = useState('v2.4 (2025)');

  if (!isAjustesOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Ajustes de marca actualizados');
    setIsAjustesOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[rgba(38,33,28,0.14)] space-y-6">
        <div className="flex justify-between items-center border-b border-[rgba(38,33,28,0.14)] pb-4">
          <h3 className="text-xl font-bold text-[#5d172d] flex items-center gap-2">
            <span className="material-symbols-outlined">settings</span>
            <span>Ajustes del Sistema</span>
          </h3>
          <button
            onClick={() => setIsAjustesOpen(false)}
            className="text-[#665d54] hover:text-[#1c1c18] p-1 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 font-sans text-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1">
              Nombre de la Agencia
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] rounded-lg p-3 focus:outline-none focus:border-[#5d172d]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1">
              Usuario Activo
            </label>
            <div className="flex items-center gap-3 p-3 bg-[#f7f3ec] rounded-lg border border-[rgba(38,33,28,0.14)]">
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-bold text-[#1c1c18]">{user.name}</p>
                <p className="text-xs text-[#665d54]">{user.role}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1">
              Versión de Identidad
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] rounded-lg p-3 focus:outline-none focus:border-[#5d172d]"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[rgba(38,33,28,0.14)]">
            <button
              type="button"
              onClick={() => setIsAjustesOpen(false)}
              className="px-5 py-2.5 rounded-lg border border-[rgba(38,33,28,0.14)] text-xs font-bold uppercase tracking-wider text-[#665d54]"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#5d172d] text-white text-xs font-bold uppercase tracking-wider shadow-cta hover:opacity-90"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
