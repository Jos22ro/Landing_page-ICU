import {
  EventItem,
  ActivityItem,
  ColorTokens,
  TypographyConfig,
  PaletteItem,
  FontItem,
  UserProfile,
  CurriculumData,
} from '../types';

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
  headlineSize: 56,
  h2Size: 36,
  leadSize: 22,
  bodySize: 16,
  smallSize: 12,
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
    scales: {
      scale1: 56,
      scale2: 36,
      scale3: 22,
      scale4: 16,
      scale5: 12,
    },
  },
  {
    id: 'font-2',
    name: 'Playfair Display',
    styles: 'Regular, Bold',
    uploadDate: '12 Oct 2023',
    current: false,
    scales: {
      scale1: 52,
      scale2: 34,
      scale3: 20,
      scale4: 15,
      scale5: 11,
    },
  },
  {
    id: 'font-3',
    name: 'Montserrat',
    styles: 'Regular, SemiBold',
    uploadDate: '28 Nov 2023',
    current: false,
    scales: {
      scale1: 46,
      scale2: 30,
      scale3: 19,
      scale4: 15,
      scale5: 12,
    },
  },
];

export const userProfile: UserProfile = {
  name: 'Adriana',
  role: 'Creative Director',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCNN3N9bNENjkHFM7XOPk08itzUnUD4Dn3UgnL-VZR_3II4f6Fpd77Mbl1gFMmGy9oDXISHnxCUKGxiP3_CrSijPfSekbzfXj5wyYabtX2V7vTnnQKvRyPvOtaFAI8nIxTWsl813tfiVOpI-gwwvHcrbYUsxExLcBfr3KlrzxEFNPrHeS2qn9bEpgO_M3RzEKAWcH5NooJlaSUjQwbwJfrwYB5D5zmmO3s6-yZOB1EKugiaAGgl3Y',
};

export const defaultCurriculumData: CurriculumData = {
  firstName: 'Alejandro',
  lastName: 'Torres',
  jobTitle: 'Programador web',
  photoUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  phone: '+34-91-1234-567',
  email: 'hola@unsitiogenial.es',
  website: 'www.unsitiogenial.es',
  address: 'Calle Cualquiera 123, Cualquier Lugar.',
  profileSummary:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue. Consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo.',
  experiences: [
    {
      id: 'exp-1',
      company: 'Multinacional González',
      period: '2019 - 2023',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet dui elit quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.',
    },
    {
      id: 'exp-2',
      company: 'Álvarez y asociados',
      period: '2015 - 2019',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet dui elit quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.',
    },
    {
      id: 'exp-3',
      company: 'Industrias Ariova',
      period: '2014 - 2015',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet dui elit quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.',
    },
    {
      id: 'exp-4',
      company: 'Rimberio y asociados',
      period: '2012 - 2014',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet dui elit quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Universidad Ensigna',
      degree: 'Ingeniería en sistemas',
      period: '2018 - 2023',
    },
    {
      id: 'edu-2',
      institution: 'Universidad Ensigna',
      degree: 'Programación web',
      period: '2012 - 2018',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'Español', level: 'Nativo' },
    { id: 'lang-2', name: 'Portugués', level: 'Intermedio' },
    { id: 'lang-3', name: 'Ingles', level: 'Avanzado' },
  ],
  competencies: [
    { id: 'comp-1', name: 'Software 01', percentage: 100 },
    { id: 'comp-2', name: 'Software 02', percentage: 75 },
    { id: 'comp-3', name: 'Software 03', percentage: 75 },
    { id: 'comp-4', name: 'Software 04', percentage: 75 },
    { id: 'comp-5', name: 'Software 05', percentage: 50 },
  ],
  skills: [
    { id: 'skill-1', name: 'Liderazgo', rating: 5 },
    { id: 'skill-2', name: 'Creatividad', rating: 4 },
    { id: 'skill-3', name: 'Análisis crítico', rating: 4 },
    { id: 'skill-4', name: 'Eficiencia', rating: 5 },
  ],
};
