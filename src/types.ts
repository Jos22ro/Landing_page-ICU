export type NavTab = 'dashboard' | 'colores' | 'tipografia' | 'paletas' | 'landing' | 'login' | 'ajustes';

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

export interface TypographyConfig {
  fontFamily: string;
  headlineSize: number; // in px
  leadSize: number; // in px
  bodySize: number; // in px
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
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
}
