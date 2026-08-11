import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavTab,
  ColorTokens,
  TypographyConfig,
  EventItem,
  ActivityItem,
  PaletteItem,
  FontItem,
  UserProfile,
} from '../types';
import {
  defaultColors,
  defaultTypography,
  initialEvents,
  initialActivities,
  initialPalettes,
  initialFonts,
  userProfile,
} from '../data/mockData';

interface BrandContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentPath: string;
  navigate: (path: string) => void;
  colors: ColorTokens;
  setColors: React.Dispatch<React.SetStateAction<ColorTokens>>;
  updateColorToken: (key: keyof ColorTokens, value: string) => void;
  resetColors: () => void;
  saveColors: (name?: string, category?: 'light' | 'dark') => void;
  typography: TypographyConfig;
  setTypography: React.Dispatch<React.SetStateAction<TypographyConfig>>;
  updateTypography: (key: keyof TypographyConfig, value: any) => void;
  resetTypography: () => void;
  saveTypography: () => void;
  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id'>) => void;
  activities: ActivityItem[];
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  toggleThemeMode: () => void;
  selectPaletteForMode: (id: string, mode: 'light' | 'dark') => void;
  activeLightPalette: PaletteItem | null;
  activeDarkPalette: PaletteItem | null;
  palettes: PaletteItem[];
  editingPaletteId: string | null;
  editingPalette: PaletteItem | null;
  editPalette: (id: string) => void;
  cancelEditingPalette: () => void;
  addPalette: (name: string, category?: 'light' | 'dark', customColors?: ColorTokens) => void;
  deletePalette: (id: string) => void;
  usePalette: (id: string) => void;
  fonts: FontItem[];
  useFont: (id: string) => void;
  deleteFont: (id: string) => void;
  uploadFont: (fontName: string, dataUrl?: string) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  user: UserProfile;
  isNuevoEventoOpen: boolean;
  setIsNuevoEventoOpen: (open: boolean) => void;
  isAjustesOpen: boolean;
  setIsAjustesOpen: (open: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [colors, setColors] = useState<ColorTokens>(() => {
    const saved = localStorage.getItem('icu_colors');
    return saved ? JSON.parse(saved) : defaultColors;
  });
  const [savedColorsState, setSavedColorsState] = useState<ColorTokens>(colors);

  const [typography, setTypography] = useState<TypographyConfig>(() => {
    const saved = localStorage.getItem('icu_typography');
    return saved ? JSON.parse(saved) : defaultTypography;
  });
  const [savedTypographyState, setSavedTypographyState] = useState<TypographyConfig>(typography);

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('icu_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('icu_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('icu_theme_mode');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  const [palettes, setPalettes] = useState<PaletteItem[]>(() => {
    const saved = localStorage.getItem('icu_palettes');
    let loaded: PaletteItem[] = saved ? JSON.parse(saved) : initialPalettes;

    let hasLight = loaded.some((p) => p.activeLight);
    let hasDark = loaded.some((p) => p.activeDark);

    if (!hasLight || !hasDark) {
      loaded = loaded.map((p) => {
        let activeLight = p.activeLight;
        let activeDark = p.activeDark;
        if (!hasLight && (p.id === 'pal-std' || p.category === 'light')) {
          activeLight = true;
          hasLight = true;
        }
        if (!hasDark && (p.id === 'pal-3' || p.category === 'dark')) {
          activeDark = true;
          hasDark = true;
        }
        return { ...p, activeLight, activeDark };
      });
    }
    return loaded;
  });

  const activeLightPalette = palettes.find((p) => p.activeLight) || palettes.find((p) => p.category === 'light') || null;
  const activeDarkPalette = palettes.find((p) => p.activeDark) || palettes.find((p) => p.category === 'dark') || null;
  const [editingPaletteId, setEditingPaletteId] = useState<string | null>(null);

  const editingPalette = palettes.find((p) => p.id === editingPaletteId) || null;

  const [fonts, setFonts] = useState<FontItem[]>(() => {
    const saved = localStorage.getItem('icu_fonts');
    return saved ? JSON.parse(saved) : initialFonts;
  });

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/admin' || path === '/admin/' || window.location.hash === '#admin') {
        return '/admin';
      }
    }
    return '/';
  });

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    }
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin' || path === '/admin/' || window.location.hash === '#admin') {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('icu_logged_in') === 'true';
  });
  const [isNuevoEventoOpen, setIsNuevoEventoOpen] = useState(false);
  const [isAjustesOpen, setIsAjustesOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Sync Root CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', colors.bg);
    root.style.setProperty('--surface', colors.surface);
    root.style.setProperty('--text-main', colors.textMain);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--neutral', colors.neutral);
    localStorage.setItem('icu_colors', JSON.stringify(colors));
  }, [colors]);

  // Sync Typography
  useEffect(() => {
    localStorage.setItem('icu_typography', JSON.stringify(typography));

    if (typeof document !== 'undefined') {
      let styleEl = document.getElementById('global-typography-style') as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'global-typography-style';
        document.head.appendChild(styleEl);
      }

      const h1Size = typography.headlineSize;
      const h2Size = Math.max(1, Math.round(h1Size * 0.78));
      const h3Size = Math.max(1, Math.round(h1Size * 0.62));
      const h4Size = Math.max(1, Math.round(h1Size * 0.5));
      const h5Size = Math.max(1, Math.round(h1Size * 0.4));
      const h6Size = Math.max(1, Math.round(h1Size * 0.33));
      const leadSize = typography.leadSize;
      const bodySize = typography.bodySize;

      styleEl.textContent = `
        :root {
          --brand-font-family: "${typography.fontFamily}", serif, sans-serif;
          --font-size-h1: ${h1Size}px;
          --font-size-h2: ${h2Size}px;
          --font-size-h3: ${h3Size}px;
          --font-size-h4: ${h4Size}px;
          --font-size-h5: ${h5Size}px;
          --font-size-h6: ${h6Size}px;
          --font-size-lead: ${leadSize}px;
          --font-size-body: ${bodySize}px;
        }

        .landing-page-scope h1,
        .landing-page-scope h2,
        .landing-page-scope h3,
        .landing-page-scope h4,
        .landing-page-scope h5,
        .landing-page-scope h6,
        .landing-page-scope .font-serif {
          font-family: var(--brand-font-family) !important;
        }

        .landing-page-scope h1 {
          font-size: var(--font-size-h1);
        }
        .landing-page-scope h2 {
          font-size: var(--font-size-h2);
        }
        .landing-page-scope h3 {
          font-size: var(--font-size-h3);
        }
        .landing-page-scope h4 {
          font-size: var(--font-size-h4);
        }
        .landing-page-scope h5 {
          font-size: var(--font-size-h5);
        }
        .landing-page-scope h6 {
          font-size: var(--font-size-h6);
        }
        .landing-page-scope .text-lead,
        .landing-page-scope p.lead {
          font-size: var(--font-size-lead);
        }
        .landing-page-scope .text-body-dynamic {
          font-size: var(--font-size-body);
        }

        .landing-page-scope input::placeholder,
        .landing-page-scope textarea::placeholder {
          color: ${colors.textMain} !important;
          opacity: 0.55;
        }
      `;
    }
  }, [typography, colors]);

  // Sync Persistence
  useEffect(() => {
    localStorage.setItem('icu_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('icu_palettes', JSON.stringify(palettes));
  }, [palettes]);

  // Helper to dynamically register font-face in document head & document.fonts
  const registerFontInBrowser = (fontName: string, dataUrl?: string) => {
    if (!dataUrl || typeof document === 'undefined') return;

    const sanitizedId = `font-face-${fontName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    let styleEl = document.getElementById(sanitizedId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = sanitizedId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      @font-face {
        font-family: "${fontName}";
        src: url("${dataUrl}");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;

    if (typeof window !== 'undefined' && 'FontFace' in window) {
      try {
        const fontFace = new FontFace(fontName, `url("${dataUrl}")`);
        fontFace.load().then((loaded) => {
          (document.fonts as any).add(loaded);
        }).catch((err) => {
          console.warn('FontFace API load failed for', fontName, err);
        });
      } catch (err) {
        console.warn('FontFace API error for', fontName, err);
      }
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('icu_fonts', JSON.stringify(fonts));
    } catch (e) {
      console.warn('Unable to save fonts to localStorage:', e);
    }

    // Register all uploaded fonts in document
    fonts.forEach((f) => {
      if (f.dataUrl) {
        registerFontInBrowser(f.name, f.dataUrl);
      }
    });
  }, [fonts]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const updateColorToken = (key: keyof ColorTokens, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const resetColors = () => {
    setColors(savedColorsState);
    showToast('Cambios de color deshechos');
  };

  const editPalette = (id: string) => {
    const target = palettes.find((p) => p.id === id);
    if (target) {
      setEditingPaletteId(id);
      if (target.colors.length >= 5) {
        setColors({
          accent: target.colors[0],
          bg: target.colors[1],
          surface: target.colors[2],
          textMain: target.colors[3],
          neutral: target.colors[4],
        });
      } else if (target.colors.length >= 3) {
        setColors({
          accent: target.colors[0] || colors.accent,
          bg: target.colors[1] || colors.bg,
          surface: target.colors[2] || '#ffffff',
          textMain: target.colors[3] || colors.textMain,
          neutral: target.colors[4] || colors.neutral,
        });
      }
      setActiveTab('colores');
      showToast(`Modo edición activado para '${target.name}'`);
    }
  };

  const cancelEditingPalette = () => {
    setEditingPaletteId(null);
    showToast('Edición de paleta cancelada');
  };

  const saveColors = (name?: string, category?: 'light' | 'dark') => {
    setSavedColorsState(colors);
    const palName = name?.trim() || 'Paleta Principal ICU';
    const palCat = category || 'light';
    const isLight = palCat === 'light';

    if (editingPaletteId) {
      const existing = palettes.find((p) => p.id === editingPaletteId);
      if (existing) {
        setPalettes((prev) =>
          prev.map((p) => {
            const isEditingTarget = p.id === editingPaletteId;
            if (isLight) {
              return {
                ...p,
                ...(isEditingTarget
                  ? {
                      name: palName,
                      category: palCat,
                      colors: [colors.accent, colors.bg, colors.surface, colors.textMain, colors.neutral],
                      active: true,
                      activeLight: true,
                    }
                  : {
                      activeLight: false,
                      active: false,
                    }),
              };
            } else {
              return {
                ...p,
                ...(isEditingTarget
                  ? {
                      name: palName,
                      category: palCat,
                      colors: [colors.accent, colors.bg, colors.surface, colors.textMain, colors.neutral],
                      active: true,
                      activeDark: true,
                    }
                  : {
                      activeDark: false,
                      active: false,
                    }),
              };
            }
          })
        );
        showToast(`Paleta '${palName}' actualizada exitosamente`);
        addActivity('palette', `Paleta '${palName}' actualizada`, userProfile.name);
        setEditingPaletteId(null);
        return;
      }
    }

    addPalette(palName, palCat, colors);
    showToast(`Colores guardados como '${palName}' (${palCat === 'dark' ? 'Modo Oscuro' : 'Modo Claro'})`);
    addActivity('palette', `Paleta '${palName}' guardada`, userProfile.name);
  };

  const updateTypography = (key: keyof TypographyConfig, value: any) => {
    setTypography((prev) => ({ ...prev, [key]: value }));
  };

  const resetTypography = () => {
    setTypography(savedTypographyState);
    showToast('Cambios tipográficos deshechos');
  };

  const saveTypography = () => {
    setSavedTypographyState(typography);
    showToast('Escala tipográfica guardada exitosamente');
    addActivity('text_fields', `Escala tipográfica actualizada (${typography.headlineSize}px)`, userProfile.name);
  };

  const addEvent = (newEventData: Omit<EventItem, 'id'>) => {
    const newEvt: EventItem = {
      id: Date.now().toString(),
      ...newEventData,
    };
    setEvents((prev) => [newEvt, ...prev]);
    showToast(`Evento '${newEventData.name}' creado exitosamente`);
    addActivity('event_available', `Nuevo evento '${newEventData.name}' creado`, userProfile.name);
  };

  const addActivity = (icon: string, title: string, author: string) => {
    const newAct: ActivityItem = {
      id: Date.now().toString(),
      icon,
      title,
      author,
      timeAgo: 'hace un momento',
      iconBgClass: 'bg-primary-container text-on-primary-container',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const addPalette = (name: string, category: 'light' | 'dark' = 'light', customColors?: ColorTokens) => {
    if (!name.trim()) return;
    const targetColors = customColors || colors;
    const isLight = category === 'light';
    const newPal: PaletteItem = {
      id: Date.now().toString(),
      name: name.trim(),
      category,
      colors: [targetColors.accent, targetColors.bg, targetColors.surface, targetColors.textMain, targetColors.neutral],
      createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      active: true,
      activeLight: isLight,
      activeDark: !isLight,
    };
    setPalettes((prev) => [
      newPal,
      ...prev.map((p) => ({
        ...p,
        active: false,
        activeLight: isLight ? false : p.activeLight,
        activeDark: !isLight ? false : p.activeDark,
      })),
    ]);
  };

  const deletePalette = (id: string) => {
    if (editingPaletteId === id) {
      setEditingPaletteId(null);
    }
    setPalettes((prev) => prev.filter((p) => p.id !== id));
    showToast('Paleta eliminada');
  };

  const applyPaletteColors = (palette: PaletteItem) => {
    if (palette.colors.length >= 5) {
      setColors({
        accent: palette.colors[0],
        bg: palette.colors[1],
        surface: palette.colors[2],
        textMain: palette.colors[3],
        neutral: palette.colors[4],
      });
    } else if (palette.colors.length >= 3) {
      setColors({
        accent: palette.colors[0],
        bg: palette.colors[1],
        surface: palette.colors[2] || '#ffffff',
        textMain: palette.colors[3] || palette.colors[0],
        neutral: palette.colors[4] || '#e6e2db',
      });
    }
  };

  const selectPaletteForMode = (id: string, mode: 'light' | 'dark') => {
    const target = palettes.find((p) => p.id === id);
    if (!target) return;

    setPalettes((prev) =>
      prev.map((p) => {
        const isTarget = p.id === id;
        if (mode === 'light') {
          return {
            ...p,
            activeLight: p.category === 'light' ? isTarget : p.activeLight,
            active: themeMode === 'light' ? isTarget : (p.activeDark && themeMode === 'dark'),
          };
        } else {
          return {
            ...p,
            activeDark: p.category === 'dark' ? isTarget : p.activeDark,
            active: themeMode === 'dark' ? isTarget : (p.activeLight && themeMode === 'light'),
          };
        }
      })
    );

    if (themeMode === mode) {
      applyPaletteColors(target);
      showToast(`Paleta '${target.name}' asignada y aplicada para Modo ${mode === 'light' ? 'Claro' : 'Oscuro'}`);
    } else {
      showToast(`Paleta '${target.name}' asignada como predeterminada para Modo ${mode === 'light' ? 'Claro' : 'Oscuro'}`);
    }

    addActivity('palette', `Paleta '${target.name}' asignada a Modo ${mode === 'light' ? 'Claro' : 'Oscuro'}`, userProfile.name);
  };

  const setThemeMode = (newMode: 'light' | 'dark') => {
    setThemeModeState(newMode);
    localStorage.setItem('icu_theme_mode', newMode);

    const target = palettes.find((p) =>
      newMode === 'light' ? p.activeLight : p.activeDark
    ) || palettes.find((p) => p.category === newMode) || palettes[0];

    if (target) {
      setPalettes((prev) =>
        prev.map((p) => ({
          ...p,
          active: p.id === target.id,
        }))
      );
      applyPaletteColors(target);
      showToast(`Modo ${newMode === 'light' ? 'Claro' : 'Oscuro'} activado ('${target.name}')`);
      addActivity('palette', `Cambio a Modo ${newMode === 'light' ? 'Claro' : 'Oscuro'}`, userProfile.name);
    }
  };

  const toggleThemeMode = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
  };

  const usePalette = (id: string) => {
    const target = palettes.find((p) => p.id === id);
    if (!target) return;

    const mode = target.category || 'light';
    setThemeModeState(mode);
    localStorage.setItem('icu_theme_mode', mode);

    setPalettes((prev) =>
      prev.map((p) => {
        const isTarget = p.id === id;
        if (mode === 'light') {
          return {
            ...p,
            active: isTarget,
            activeLight: p.category === 'light' ? isTarget : p.activeLight,
          };
        } else {
          return {
            ...p,
            active: isTarget,
            activeDark: p.category === 'dark' ? isTarget : p.activeDark,
          };
        }
      })
    );

    applyPaletteColors(target);
    showToast(`Paleta '${target.name}' activada (${mode === 'light' ? 'Modo Claro' : 'Modo Oscuro'})`);
    addActivity('palette', `Paleta '${target.name}' aplicada`, userProfile.name);
  };

  const useFont = (id: string) => {
    setFonts((prev) =>
      prev.map((f) => ({
        ...f,
        current: f.id === id,
      }))
    );
    const selected = fonts.find((f) => f.id === id);
    if (selected) {
      if (selected.dataUrl) {
        registerFontInBrowser(selected.name, selected.dataUrl);
      }
      setTypography((prev) => ({
        ...prev,
        fontFamily: selected.name,
      }));
      showToast(`Fuente '${selected.name}' activada`);
      addActivity('text_fields', `Fuente '${selected.name}' establecida como actual`, userProfile.name);
    }
  };

  const deleteFont = (id: string) => {
    setFonts((prev) => prev.filter((f) => f.id !== id));
    showToast('Fuente eliminada');
  };

  const uploadFont = (fontName: string, dataUrl?: string) => {
    if (dataUrl) {
      registerFontInBrowser(fontName, dataUrl);
    }

    const newFont: FontItem = {
      id: Date.now().toString(),
      name: fontName,
      styles: 'Fuente personalizada (.ttf/.otf)',
      uploadDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      current: true,
      dataUrl,
    };
    setFonts((prev) => [newFont, ...prev.map((f) => ({ ...f, current: false }))]);
    setTypography((prev) => ({
      ...prev,
      fontFamily: fontName,
    }));
    showToast(`Fuente '${fontName}' cargada y activada`);
    addActivity('text_fields', `Nueva fuente '${fontName}' cargada`, userProfile.name);
  };

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('icu_logged_in', 'true');
    setActiveTab('dashboard');
    navigate('/admin');
    showToast('Sesión iniciada correctamente');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('icu_logged_in');
    navigate('/admin');
    showToast('Sesión cerrada');
  };

  return (
    <BrandContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentPath,
        navigate,
        colors,
        setColors,
        updateColorToken,
        resetColors,
        saveColors,
        typography,
        setTypography,
        updateTypography,
        resetTypography,
        saveTypography,
        events,
        addEvent,
        activities,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        selectPaletteForMode,
        activeLightPalette,
        activeDarkPalette,
        palettes,
        editingPaletteId,
        editingPalette,
        editPalette,
        cancelEditingPalette,
        addPalette,
        deletePalette,
        usePalette,
        fonts,
        useFont,
        deleteFont,
        uploadFont,
        isLoggedIn,
        login,
        logout,
        user: userProfile,
        isNuevoEventoOpen,
        setIsNuevoEventoOpen,
        isAjustesOpen,
        setIsAjustesOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
