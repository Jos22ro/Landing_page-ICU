import { EventItem, ActivityItem, ColorTokens, TypographyConfig, PaletteItem, FontItem, UserProfile } from '../types';

export const initialEvents: EventItem[] = [
  {
    id: '1',
    name: "Gala Benéfica 'Aura'",
    date: 'Oct 24, 2024',
    client: 'Fundación Elipsis',
    status: 'CONFIRMADO',
  },
  {
    id: '2',
    name: 'Lanzamiento Colección PV25',
    date: 'Nov 02, 2024',
    client: 'Moda Vanguardia',
    status: 'EN MONTAJE',
  },
  {
    id: '3',
    name: 'Cumbre Tech Latam',
    date: 'Nov 15, 2024',
    client: 'Innovate Corp',
    status: 'PENDIENTE',
  },
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    icon: 'palette',
    title: "Paleta 'Primavera' aplicada",
    author: 'Adriana',
    timeAgo: 'hace 2 horas',
    iconBgClass: 'bg-primary-container text-on-primary-container',
  },
  {
    id: 'act-2',
    icon: 'text_fields',
    title: "Nueva fuente 'Fraunces' cargada",
    author: 'Sistema',
    timeAgo: 'hace 5 horas',
    iconBgClass: 'bg-surface-container-highest text-on-surface',
  },
  {
    id: 'act-3',
    icon: 'verified',
    title: 'Manual de Identidad v2.1 aprobado',
    author: 'Dirección',
    timeAgo: 'ayer',
    iconBgClass: 'bg-surface-container-highest text-on-surface',
  },
];

export const defaultColors: ColorTokens = {
  bg: '#fdf9f2',
  surface: '#ffffff',
  textMain: '#1c1c18',
  accent: '#5d172d',
  neutral: '#e6e2db',
};

export const defaultTypography: TypographyConfig = {
  fontFamily: 'Fraunces',
  headlineSize: 64,
  leadSize: 19,
  bodySize: 17,
};

export const initialPalettes: PaletteItem[] = [
  {
    id: 'pal-std',
    name: 'Estándar ICU',
    category: 'light',
    colors: ['#5d172d', '#fdf9f2', '#ffffff', '#1c1c18', '#e6e2db'],
    createdAt: '01 Ene 2024',
    active: true,
    activeLight: true,
  },
  {
    id: 'pal-1',
    name: 'Clásica',
    category: 'light',
    colors: ['#534245', '#f5f0eb', '#ffffff', '#1c1c18', '#d9c1c4'],
    createdAt: '12 Oct 2023',
    active: false,
  },
  {
    id: 'pal-2',
    name: 'Primavera',
    category: 'light',
    colors: ['#7a2e43', '#fdf9f2', '#ffffff', '#2E6B4F', '#ffb1c1'],
    createdAt: '05 Mar 2024',
    active: false,
  },
  {
    id: 'pal-3',
    name: 'Noche de gala',
    category: 'dark',
    colors: ['#e2809a', '#1e191b', '#2a2326', '#fdf9f2', '#534245'],
    createdAt: '28 Nov 2023',
    active: false,
    activeDark: true,
  },
  {
    id: 'pal-4',
    name: 'Medianoche',
    category: 'dark',
    colors: ['#4A90E2', '#121316', '#1e2024', '#fdf9f2', '#363a40'],
    createdAt: '15 May 2024',
    active: false,
  },
];

export const initialFonts: FontItem[] = [
  {
    id: 'font-1',
    name: 'Fraunces',
    styles: 'Regular, Bold, Italic',
    uploadDate: '05 Mar 2024',
    current: true,
  },
  {
    id: 'font-2',
    name: 'Playfair Display',
    styles: 'Regular, Bold',
    uploadDate: '12 Oct 2023',
    current: false,
  },
  {
    id: 'font-3',
    name: 'Montserrat',
    styles: 'Regular',
    uploadDate: '28 Nov 2023',
    current: false,
  },
];

export const userProfile: UserProfile = {
  name: 'Adriana',
  role: 'Creative Director',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCNN3N9bNENjkHFM7XOPk08itzUnUD4Dn3UgnL-VZR_3II4f6Fpd77Mbl1gFMmGy9oDXISHnxCUKGxiP3_CrSijPfSekbzfXj5wyYabtX2V7vTnnQKvRyPvOtaFAI8nIxTWsl813tfiVOpI-gwwvHcrbYUsxExLcBfr3KlrzxEFNPrHeS2qn9bEpgO_M3RzEKAWcH5NooJlaSUjQwbwJfrwYB5D5zmmO3s6-yZOB1EKugiaAGgl3Y',
};
