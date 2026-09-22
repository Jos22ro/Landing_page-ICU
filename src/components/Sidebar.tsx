import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { NavTab } from '../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, user, logout, setIsNuevoEventoOpen, setIsAjustesOpen, navigate, startLoading } = useBrand();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'colores', label: 'Colores', icon: 'palette' },
    { id: 'tipografia', label: 'Tipografía', icon: 'text_fields' },
    { id: 'paletas', label: 'Paletas', icon: 'color_lens' },
    { id: 'curriculum', label: 'Currículum', icon: 'contact_page' },
    { id: 'klm', label: 'Cálculo KLM', icon: 'calculate' },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-[#f7f3ec] border-b border-[rgba(38,33,28,0.14)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#7a2e43] flex items-center justify-center overflow-hidden border border-[#867275]">
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-[#5d172d] leading-none text-lg">ICU Admin</h1>
            <p className="text-xs text-[#665d54]">Gestión de Marca</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className="text-xs px-2.5 py-1.5 rounded bg-white text-[#5d172d] border border-[#867275]/30 font-semibold"
          >
            Ver Landing
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#5d172d] rounded-lg hover:bg-white/50"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Side Navigation Shell */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#f7f3ec] border-r border-[rgba(38,33,28,0.14)] flex flex-col p-5 z-50 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold text-[#5d172d]">ICU Admin</h1>
          <p className="text-sm text-[#665d54] opacity-70">Gestión de Marca</p>
        </div>

        {/* Main Tabs Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-all ${
                  isActive
                    ? 'bg-[#eee0d5] text-[#6c635a] font-bold shadow-sm'
                    : 'text-[#534245] hover:bg-[#e6e2db] active:scale-95'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* CTA and Footer Actions */}
        <div className="mt-auto space-y-5 pt-4 border-t border-[rgba(38,33,28,0.14)]">
          <button
            onClick={() => setIsNuevoEventoOpen(true)}
            className="w-full bg-[#5d172d] text-white py-3 rounded-lg font-bold shadow-cta transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Nuevo Evento
          </button>

          <div className="space-y-1">
            <button
              onClick={() => startLoading('Cargando experiencia Tangram...', 7200)}
              className="w-full flex items-center gap-3 px-4 py-2 text-[#46383b] hover:bg-[#e6e2db] rounded-lg transition-all text-sm font-medium"
              title="Probar animación Tangram Loader completa"
            >
              <span className="material-symbols-outlined text-base">hourglass_top</span>
              <span>Tangram Loader (3 Figuras)</span>
            </button>
            <button
              onClick={() => setIsAjustesOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2 text-[#534245] hover:bg-[#e6e2db] rounded-lg transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined">settings</span>
              <span>Ajustes</span>
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 text-[#A03434] hover:bg-[#ffdad6] rounded-lg transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 px-2 pt-2 border-t border-[rgba(38,33,28,0.08)]">
            <div className="w-10 h-10 rounded-full bg-[#7a2e43] flex items-center justify-center overflow-hidden border border-[#867275] shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-[#1c1c18] leading-tight truncate">{user.name}</p>
              <p className="text-xs text-[#665d54] truncate">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
