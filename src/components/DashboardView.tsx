import React from 'react';
import { useBrand } from '../context/BrandContext';

export const DashboardView: React.FC = () => {
  const {
    user,
    events,
    activities,
    setActiveTab,
    setIsNuevoEventoOpen,
    colors,
    navigate,
    startLoading,
  } = useBrand();

  const activeEventsCount = events.length;
  const requestsCount = '04';

  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header Section */}
      <header>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#5d172d] mb-2 tracking-tight">
          Bienvenida, {user.name}
        </h2>
        <p className="text-lg text-[#665d54] max-w-2xl leading-relaxed">
          El ecosistema de ICU está operando al máximo rendimiento. Tienes {activeEventsCount} eventos
          activos para este trimestre y {requestsCount} nuevas solicitudes esperando revisión.
        </p>
      </header>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Eventos Activos */}
        <div className="bg-white p-5 rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest text-[#665d54]">Eventos Activos</span>
            <span
              className="material-symbols-outlined text-[#7a2e43]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              event_available
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-[#5d172d]">{activeEventsCount}</p>
        </div>

        {/* Card 2: Nuevas Solicitudes */}
        <div className="bg-white p-5 rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest text-[#665d54]">Nuevas Solicitudes</span>
            <span
              className="material-symbols-outlined text-[#7a2e43]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              mark_email_unread
            </span>
          </div>
          <div className="flex items-end justify-between w-full">
            <p className="text-3xl sm:text-4xl font-bold text-[#5d172d]">{requestsCount}</p>
            <span className="text-[#2E6B4F] text-xs font-bold bg-[#2E6B4F]/10 px-2 py-0.5 rounded-full">
              +2 hoy
            </span>
          </div>
        </div>

        {/* Card 3: Tasa de Conversión */}
        <div className="bg-white p-5 rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest text-[#665d54]">Tasa de Conversión</span>
            <span
              className="material-symbols-outlined text-[#7a2e43]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              trending_up
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-[#5d172d]">84%</p>
        </div>
      </div>

      {/* Main Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Events & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Próximos Eventos Section */}
          <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] overflow-hidden">
            <div className="p-5 border-b border-[rgba(38,33,28,0.14)] flex justify-between items-center">
              <h3 className="text-xl sm:text-2xl font-bold text-[#5d172d]">Próximos Eventos</h3>
              <button
                onClick={() => setIsNuevoEventoOpen(true)}
                className="text-[#5d172d] font-bold text-sm hover:underline flex items-center gap-1"
              >
                <span>Ver todos</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#f7f3ec] border-b border-[rgba(38,33,28,0.14)] text-xs uppercase tracking-widest text-[#665d54]">
                    <th className="px-5 py-3.5 font-normal">Evento</th>
                    <th className="px-5 py-3.5 font-normal">Fecha</th>
                    <th className="px-5 py-3.5 font-normal">Cliente</th>
                    <th className="px-5 py-3.5 font-normal">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(38,33,28,0.14)] text-sm">
                  {events.map((evt) => {
                    let badgeBg = 'bg-[#2E6B4F] text-white';
                    if (evt.status === 'EN MONTAJE') {
                      badgeBg = 'bg-[#7a2e43] text-[#ff9ab0]';
                    } else if (evt.status === 'PENDIENTE') {
                      badgeBg = 'bg-[#eee0d5] text-[#6c635a]';
                    }

                    return (
                      <tr key={evt.id} className="hover:bg-[#fdf9f2] transition-colors">
                        <td className="px-5 py-4 font-bold text-[#1c1c18]">{evt.name}</td>
                        <td className="px-5 py-4 text-[#534245]">{evt.date}</td>
                        <td className="px-5 py-4 text-[#534245]">{evt.client}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-block ${badgeBg}`}
                          >
                            {evt.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Actividad Reciente de Marca */}
          <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] p-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#5d172d] mb-6">
              Actividad Reciente de Marca
            </h3>
            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-[rgba(38,33,28,0.14)]">
              {activities.map((act) => (
                <div key={act.id} className="relative pl-10">
                  <div
                    className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ${
                      act.iconBgClass || 'bg-[#7a2e43] text-[#ff9ab0]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {act.icon}
                    </span>
                  </div>
                  <p className="text-base font-bold text-[#1c1c18]">{act.title}</p>
                  <p className="text-sm text-[#665d54]">
                    Actualizado por {act.author} — {act.timeAgo}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (1/3): Quick Actions & Snapshot */}
        <aside className="space-y-8">
          {/* Acciones Rápidas */}
          <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] p-5">
            <h3 className="text-lg font-bold text-[#5d172d] mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button
                onClick={() => setIsNuevoEventoOpen(true)}
                className="w-full flex items-center gap-4 p-3 rounded-lg border border-[rgba(38,33,28,0.14)] hover:bg-[#f7f3ec] hover:border-[#7a2e43] transition-all group text-left"
              >
                <span className="material-symbols-outlined text-[#5d172d] group-hover:scale-110 transition-transform">
                  add_circle
                </span>
                <span className="text-sm font-medium text-[#1c1c18]">Crear Nuevo Evento</span>
              </button>
              <button
                onClick={() => setActiveTab('colores')}
                className="w-full flex items-center gap-4 p-3 rounded-lg border border-[rgba(38,33,28,0.14)] hover:bg-[#f7f3ec] hover:border-[#7a2e43] transition-all group text-left"
              >
                <span className="material-symbols-outlined text-[#5d172d] group-hover:scale-110 transition-transform">
                  brush
                </span>
                <span className="text-sm font-medium text-[#1c1c18]">Editar Colores</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-4 p-3 rounded-lg border border-[rgba(38,33,28,0.14)] hover:bg-[#f7f3ec] hover:border-[#7a2e43] transition-all group text-left"
              >
                <span className="material-symbols-outlined text-[#5d172d] group-hover:scale-110 transition-transform">
                  visibility
                </span>
                <span className="text-sm font-medium text-[#1c1c18]">Ver Landing Pública</span>
              </button>
              <button
                onClick={() => startLoading('Cargando recursos del sistema...', 7200)}
                className="w-full flex items-center gap-4 p-3 rounded-lg border border-[rgba(38,33,28,0.14)] hover:bg-[#f7f3ec] hover:border-[#7a2e43] transition-all group text-left"
              >
                <span className="material-symbols-outlined text-[#5d172d] group-hover:scale-110 transition-transform">
                  hourglass_top
                </span>
                <span className="text-sm font-medium text-[#1c1c18]">Probar Tangram Loader (3 Figuras)</span>
              </button>
            </div>
          </section>

          {/* Design System Snapshot */}
          <section className="bg-[#7a2e43] rounded-xl shadow-1 overflow-hidden relative group p-6 text-white h-64 flex flex-col justify-end">
            <div className="absolute top-4 right-4 opacity-15">
              <span className="material-symbols-outlined text-7xl">palette</span>
            </div>
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-widest text-[#ff9ab0] mb-1 font-semibold">
                Design System
              </p>
              <h4 className="text-2xl font-bold mb-4 leading-tight">Estado de la Marca</h4>
              <div className="flex gap-2.5 mb-5">
                <div
                  className="w-8 h-8 rounded-full border border-white/30 shadow-sm"
                  style={{ backgroundColor: colors.accent }}
                  title="Acento"
                ></div>
                <div
                  className="w-8 h-8 rounded-full border border-white/30 shadow-sm"
                  style={{ backgroundColor: colors.textMain }}
                  title="Texto"
                ></div>
                <div
                  className="w-8 h-8 rounded-full border border-white/30 shadow-sm"
                  style={{ backgroundColor: colors.bg }}
                  title="Fondo"
                ></div>
                <div
                  className="w-8 h-8 rounded-full border border-white/30 shadow-sm"
                  style={{ backgroundColor: '#ffb1c1' }}
                  title="Destacado"
                ></div>
              </div>
              <button
                onClick={() => setActiveTab('paletas')}
                className="w-full bg-white/10 backdrop-blur-md text-white border border-white/30 py-2.5 rounded-lg font-bold hover:bg-white hover:text-[#5d172d] transition-all text-sm"
              >
                Gestionar Assets
              </button>
            </div>
          </section>

          {/* Quick Support / Quote Box */}
          <div className="p-5 bg-[#eee0d5] rounded-xl border border-[#d9c1c4] italic text-[#6c635a] text-sm leading-relaxed">
            <p>"El diseño es el embajador silencioso de tu marca."</p>
            <p className="mt-2 font-bold not-italic text-[#1c1c18]">— Paul Rand</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
