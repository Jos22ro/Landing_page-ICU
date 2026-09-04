export type NavTab = 'dashboard' | 'colores' | 'tipografia' | 'paletas' | 'curriculum' | 'klm' | 'landing' | 'login' | 'ajustes';

export interface EventItem {
  id: string;
  name: string;
  date: string;
  client: string;
  status: 'CONFIRMADO' | 'EN MONTAJE' | 'PENDIENTE';
}

export interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  author: string;
  timeAgo: string;
  iconBgClass?: string;
}

export interface ColorTokens {
  bg: string;
  surface: string;
  textMain: string;
  accent: string;
  neutral: string;
}

export interface TypographyScales {
  scale1: number; // Escala 1: Titular Hero / Display (H1)
  scale2: number; // Escala 2: Títulos de Sección (H2)
  scale3: number; // Escala 3: Subtítulos, Logo & Tarjetas (H3 / Lead)
  scale4: number; // Escala 4: Párrafos, Formulario & CTA (Body)
  scale5: number; // Escala 5: UI Auxiliar, Badges & Labels (Small)
}

export interface TypographyConfig {
  fontFamily: string;
  headlineSize: number; // Escala 1 in px
  h2Size: number;       // Escala 2 in px
  leadSize: number;     // Escala 3 in px
  bodySize: number;     // Escala 4 in px
  smallSize: number;    // Escala 5 in px
}

export interface PaletteItem {
  id: string;
  name: string;
  category: 'light' | 'dark';
  colors: string[];
  createdAt: string;
  active?: boolean;
  activeLight?: boolean;
  activeDark?: boolean;
}

export interface FontItem {
  id: string;
  name: string;
  styles: string;
  uploadDate: string;
  current?: boolean;
  dataUrl?: string;
  scales?: TypographyScales;
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level?: string;
}

export interface SoftwareCompetencyItem {
  id: string;
  name: string;
  percentage: number; // 0 to 100
}

export interface SoftSkillItem {
  id: string;
  name: string;
  rating: number; // 1 to 5
}

export interface CurriculumData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  photoUrl: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  profileSummary: string;
  experiences: WorkExperienceItem[];
  education: EducationItem[];
  languages: LanguageItem[];
  competencies: SoftwareCompetencyItem[];
  skills: SoftSkillItem[];
}
