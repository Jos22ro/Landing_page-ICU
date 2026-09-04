import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { Settings, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AjustesModal: React.FC = () => {
  const { isAjustesOpen, setIsAjustesOpen, user, showToast } = useBrand();
  const [agencyName, setAgencyName] = useState('ICU Agencia de Eventos');
  const [version, setVersion] = useState('v2.4 (2025)');
  const [touched, setTouched] = useState({ agencyName: false, version: false });

  if (!isAjustesOpen) return null;

  // Validaciones
  const agencyNameError = !agencyName.trim()
    ? 'El nombre de la agencia es obligatorio'
    : agencyName.trim().length < 3
    ? 'Debe tener al menos 3 caracteres'
    : null;

  const versionError = !version.trim()
    ? 'La versión de identidad es obligatoria'
    : version.trim().length < 2
    ? 'Debe tener al menos 2 caracteres'
    : null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ agencyName: true, version: true });

    if (!agencyNameError && !versionError) {
      showToast('Ajustes de marca actualizados');
      setIsAjustesOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[rgba(38,33,28,0.14)] space-y-6">
        <div className="flex justify-between items-center border-b border-[rgba(38,33,28,0.14)] pb-4">
          <h3 className="text-xl font-bold text-[#5d172d] flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <span>Ajustes del Sistema</span>
          </h3>
          <button
            onClick={() => setIsAjustesOpen(false)}
            className="text-[#665d54] hover:text-[#1c1c18] p-1.5 rounded-lg hover:bg-[#f7f3ec] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 font-sans text-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1 flex items-center justify-between">
              <span>Nombre de la Agencia *</span>
              {touched.agencyName && agencyNameError && (
                <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> Requerido
                </span>
              )}
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, agencyName: true }))}
              className={`w-full rounded-lg p-3 transition-all ${
                touched.agencyName && agencyNameError
                  ? 'border border-rose-500 bg-rose-50/40 focus:ring-1 focus:ring-rose-500'
                  : 'bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] focus:outline-none focus:border-[#5d172d] focus:bg-white'
              }`}
            />
            {touched.agencyName && agencyNameError && (
              <p className="text-xs text-rose-600 mt-1">{agencyNameError}</p>
            )}
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
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1 flex items-center justify-between">
              <span>Versión de Identidad *</span>
              {touched.version && versionError && (
                <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> Requerido
                </span>
              )}
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, version: true }))}
              className={`w-full rounded-lg p-3 transition-all ${
                touched.version && versionError
                  ? 'border border-rose-500 bg-rose-50/40 focus:ring-1 focus:ring-rose-500'
                  : 'bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] focus:outline-none focus:border-[#5d172d] focus:bg-white'
              }`}
            />
            {touched.version && versionError && (
              <p className="text-xs text-rose-600 mt-1">{versionError}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[rgba(38,33,28,0.14)]">
            <button
              type="button"
              onClick={() => setIsAjustesOpen(false)}
              className="px-5 py-2.5 rounded-lg border border-[rgba(38,33,28,0.14)] text-xs font-bold uppercase tracking-wider text-[#665d54] hover:bg-[#f7f3ec] cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#5d172d] text-white text-xs font-bold uppercase tracking-wider shadow-cta hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
