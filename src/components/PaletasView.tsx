import React, { useState, useEffect } from 'react';
import { useBrand } from '../context/BrandContext';

const ITEMS_PER_PAGE = 6;

export const PaletasView: React.FC = () => {
  const {
    palettes,
    deletePalette,
    usePalette,
    editPalette,
    themeMode,
    setThemeMode,
    activeLightPalette,
    activeDarkPalette,
  } = useBrand();
  const [filterCategory, setFilterCategory] = useState<'all' | 'light' | 'dark'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPalettes = palettes.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchQuery]);

  const totalPages = Math.ceil(filteredPalettes.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredPalettes.length);
  const paginatedPalettes = filteredPalettes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <header className="border-b border-[rgba(38,33,28,0.14)] pb-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1c18] mb-2 tracking-tight">
          Gestión de Paletas
        </h2>
        <p className="text-lg text-[#665d54]">
          Configura y aplica paletas de colores para los Modos Claro y Oscuro de la marca.
        </p>
      </header>

      {/* Selected Mode Palettes Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-[rgba(38,33,28,0.14)] shadow-xs">
        {/* Light Mode Card */}
        <div
          className={`p-4 rounded-lg border transition-all ${
            themeMode === 'light' ? 'border-[#5d172d] bg-[#fdf9f2]' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d97706] text-xl">light_mode</span>
              <span className="font-bold text-sm text-[#1c1c18]">Modo Claro</span>
              {themeMode === 'light' && (
                <span className="text-[10px] bg-[#2E6B4F]/10 text-[#2E6B4F] border border-[#2E6B4F]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Activo
                </span>
              )}
            </div>
            {themeMode !== 'light' && (
              <button
                onClick={() => setThemeMode('light')}
                className="text-xs text-[#5d172d] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Activar Modo Claro
              </button>
            )}
          </div>
          {activeLightPalette ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-[#1c1c18]">{activeLightPalette.name}</p>
                <p className="text-xs text-[#665d54]">Paleta predeterminada para Modo Claro</p>
              </div>
              <div className="flex items-center -space-x-1.5">
                {activeLightPalette.colors.map((c, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#665d54] italic">Ninguna asignada</p>
          )}
        </div>

        {/* Dark Mode Card */}
        <div
          className={`p-4 rounded-lg border transition-all ${
            themeMode === 'dark' ? 'border-[#e2809a] bg-[#1e191b] text-white' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#818cf8] text-xl">dark_mode</span>
              <span className={`font-bold text-sm ${themeMode === 'dark' ? 'text-white' : 'text-[#1c1c18]'}`}>
                Modo Oscuro
              </span>
              {themeMode === 'dark' && (
                <span className="text-[10px] bg-[#2E6B4F]/20 text-[#4ade80] border border-[#2E6B4F]/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Activo
                </span>
              )}
            </div>
            {themeMode !== 'dark' && (
              <button
                onClick={() => setThemeMode('dark')}
                className="text-xs text-[#e2809a] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Activar Modo Oscuro
              </button>
            )}
          </div>
          {activeDarkPalette ? (
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-bold text-base ${themeMode === 'dark' ? 'text-white' : 'text-[#1c1c18]'}`}>
                  {activeDarkPalette.name}
                </p>
                <p className={`text-xs ${themeMode === 'dark' ? 'text-gray-300' : 'text-[#665d54]'}`}>
                  Paleta predeterminada para Modo Oscuro
                </p>
              </div>
              <div className="flex items-center -space-x-1.5">
                {activeDarkPalette.colors.map((c, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#665d54] italic">Ninguna asignada</p>
          )}
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Category Filter Tabs */}
        <div className="flex bg-[#e6e2db] p-1 rounded-lg self-start">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-white text-[#5d172d] shadow-sm'
                : 'text-[#665d54] hover:text-[#1c1c18]'
            }`}
          >
            Todas ({palettes.length})
          </button>
          <button
            onClick={() => setFilterCategory('light')}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filterCategory === 'light'
                ? 'bg-white text-[#5d172d] shadow-sm'
                : 'text-[#665d54] hover:text-[#1c1c18]'
            }`}
          >
            Modo Claro ({palettes.filter((p) => p.category === 'light').length})
          </button>
          <button
            onClick={() => setFilterCategory('dark')}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filterCategory === 'dark'
                ? 'bg-white text-[#5d172d] shadow-sm'
                : 'text-[#665d54] hover:text-[#1c1c18]'
            }`}
          >
            Modo Oscuro ({palettes.filter((p) => p.category === 'dark').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#665d54] text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar paleta por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[rgba(38,33,28,0.14)] rounded-lg pl-10 pr-4 py-2 text-sm text-[#1c1c18] focus:outline-none focus:border-[#5d172d]"
          />
        </div>
      </div>

      {/* Paletas Guardadas Table */}
      <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f3ec] border-b border-[rgba(38,33,28,0.14)] text-xs uppercase tracking-widest text-[#665d54]">
                <th className="px-6 py-4 font-normal">Nombre y Estado</th>
                <th className="px-6 py-4 font-normal">Categoría</th>
                <th className="px-6 py-4 font-normal">Muestra de Colores</th>
                <th className="px-6 py-4 font-normal">Fecha de Carga</th>
                <th className="px-6 py-4 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(38,33,28,0.14)] text-sm">
              {paginatedPalettes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#665d54]">
                    No se encontraron paletas que coincidan con el filtro.
                  </td>
                </tr>
              ) : (
                paginatedPalettes.map((pal) => {
                  const isInUse = pal.category === 'light'
                    ? Boolean(pal.activeLight)
                    : pal.category === 'dark'
                    ? Boolean(pal.activeDark)
                    : Boolean(pal.activeLight || pal.activeDark);
                  const isCurrentInApp = (themeMode === 'light' && pal.activeLight) || (themeMode === 'dark' && pal.activeDark);

                  return (
                    <tr key={pal.id} className="hover:bg-[#fdf9f2] transition-colors group">
                      <td className="px-6 py-4 font-bold text-[#1c1c18] align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>{pal.name}</span>
                          {pal.activeLight && (
                            <span
                              className="bg-[#fef3c7] text-[#b45309] border border-[#fde68a] text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 uppercase tracking-wider shrink-0"
                              title="Paleta asignada para Modo Claro"
                            >
                              Claro
                            </span>
                          )}
                          {pal.activeDark && (
                            <span
                              className="bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe] text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 uppercase tracking-wider shrink-0"
                              title="Paleta asignada para Modo Oscuro"
                            >
                              Oscuro
                            </span>
                          )}
                          {isCurrentInApp && (
                            <span className="bg-[#2E6B4F]/10 text-[#2E6B4F] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#2E6B4F]/20 inline-flex items-center gap-1 uppercase tracking-wider shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B4F] animate-pulse"></span>
                              ACTUAL
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        {pal.category === 'light' ? (
                          <span className="inline-flex items-center px-3 py-1 bg-[#eee0d5] text-[#534245] rounded-full text-xs font-semibold">
                            Modo Claro
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-[#1A1C1E] text-[#D1D2D5] rounded-full text-xs font-semibold">
                            Modo Oscuro
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center -space-x-2">
                          {pal.colors.map((c, idx) => (
                            <div
                              key={idx}
                              className="w-7 h-7 rounded-full border-2 border-white shadow-sm shrink-0"
                              style={{ backgroundColor: c }}
                              title={c}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#665d54] text-xs align-middle whitespace-nowrap">{pal.createdAt}</td>
                      <td className="px-6 py-4 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {isInUse ? (
                            <span className="px-3 py-1.5 bg-[#2E6B4F]/10 text-[#2E6B4F] border border-[#2E6B4F]/20 rounded font-bold text-xs uppercase tracking-wider inline-flex items-center">
                              En Uso
                            </span>
                          ) : (
                            <button
                              onClick={() => usePalette(pal.id)}
                              className="px-3 py-1.5 text-[#5d172d] border border-[rgba(38,33,28,0.2)] rounded font-bold text-xs hover:border-[#5d172d] hover:bg-[#5d172d]/5 transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Aplicar esta paleta"
                            >
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              Aplicar
                            </button>
                          )}
                          <button
                            onClick={() => editPalette(pal.id)}
                            className="px-3 py-1.5 text-[#1c1c18] bg-white border border-[rgba(38,33,28,0.2)] rounded font-bold text-xs hover:border-[#5d172d] hover:text-[#5d172d] hover:bg-[#5d172d]/5 transition-colors inline-flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Editar colores y nombre"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Editar
                          </button>
                          {!isInUse && (
                            <button
                              onClick={() => deletePalette(pal.id)}
                              className="p-1.5 text-[#A03434] hover:bg-[#ffdad6] rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                              title="Eliminar"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        <div className="px-6 py-4 bg-[#f7f3ec] border-t border-[rgba(38,33,28,0.14)] text-xs text-[#665d54] flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>
            {filteredPalettes.length === 0
              ? 'Mostrando 0 paletas'
              : `Mostrando ${startIndex + 1} - ${endIndex} de ${filteredPalettes.length} paletas guardadas`}
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="px-2.5 py-1.5 rounded border border-[rgba(38,33,28,0.2)] bg-white font-bold text-xs hover:bg-[#5d172d]/5 hover:border-[#5d172d] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[rgba(38,33,28,0.2)] transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center"
                title="Página anterior"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
                <span className="hidden sm:inline ml-1">Anterior</span>
              </button>

              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded font-bold text-xs transition-colors cursor-pointer ${
                      pageNum === safeCurrentPage
                        ? 'bg-[#5d172d] text-white'
                        : 'bg-white border border-[rgba(38,33,28,0.2)] text-[#1c1c18] hover:bg-[#5d172d]/5'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="px-2.5 py-1.5 rounded border border-[rgba(38,33,28,0.2)] bg-white font-bold text-xs hover:bg-[#5d172d]/5 hover:border-[#5d172d] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[rgba(38,33,28,0.2)] transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center"
                title="Página siguiente"
              >
                <span className="hidden sm:inline mr-1">Siguiente</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}

          <span className="font-semibold text-[#5d172d]">ICU Brand Design System v2.4</span>
        </div>
      </section>
    </div>
  );
};
