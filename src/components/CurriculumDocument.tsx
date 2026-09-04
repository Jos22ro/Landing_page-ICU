import React from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import { CurriculumData } from '../types';

export interface CurriculumThemeConfig {
  id: string;
  name: string;
  headerBg: string;
  headerTextColor: string;
  headerSubtextColor: string;
  accentColor: string;
  bodyBg: string;
  bodyTextColor: string;
  bodyMutedColor: string;
  borderDividerColor: string;
  dotInactiveColor: string;
  progressTrackColor: string;
}

export const curriculumThemes: Record<string, CurriculumThemeConfig> = {
  classic_pdf: {
    id: 'classic_pdf',
    name: 'Clásico PDF (Carmesí & Carbón)',
    headerBg: '#222222',
    headerTextColor: '#ffffff',
    headerSubtextColor: '#e5e7eb',
    accentColor: '#932239',
    bodyBg: '#ffffff',
    bodyTextColor: '#1f2937',
    bodyMutedColor: '#4b5563',
    borderDividerColor: '#e5e7eb',
    dotInactiveColor: '#d1d5db',
    progressTrackColor: '#e5e7eb',
  },
  icu_brand: {
    id: 'icu_brand',
    name: 'Marca ICU Oficial (#5D172D)',
    headerBg: '#26211c',
    headerTextColor: '#ffffff',
    headerSubtextColor: '#f3eee8',
    accentColor: '#5d172d',
    bodyBg: '#ffffff',
    bodyTextColor: '#1c1c18',
    bodyMutedColor: '#665d54',
    borderDividerColor: '#ede8e1',
    dotInactiveColor: '#dcd6ce',
    progressTrackColor: '#ede8e1',
  },
  executive_navy: {
    id: 'executive_navy',
    name: 'Azul Ejecutivo',
    headerBg: '#0f172a',
    headerTextColor: '#ffffff',
    headerSubtextColor: '#cbd5e1',
    accentColor: '#1d4ed8',
    bodyBg: '#ffffff',
    bodyTextColor: '#0f172a',
    bodyMutedColor: '#475569',
    borderDividerColor: '#e2e8f0',
    dotInactiveColor: '#cbd5e1',
    progressTrackColor: '#e2e8f0',
  },
  emerald_prestige: {
    id: 'emerald_prestige',
    name: 'Esmeralda Profesional',
    headerBg: '#06281e',
    headerTextColor: '#ffffff',
    headerSubtextColor: '#d1fae5',
    accentColor: '#059669',
    bodyBg: '#ffffff',
    bodyTextColor: '#06281e',
    bodyMutedColor: '#374151',
    borderDividerColor: '#e5e7eb',
    dotInactiveColor: '#d1d5db',
    progressTrackColor: '#e5e7eb',
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monocromo Minimalista',
    headerBg: '#18181b',
    headerTextColor: '#ffffff',
    headerSubtextColor: '#d4d4d8',
    accentColor: '#3f3f46',
    bodyBg: '#ffffff',
    bodyTextColor: '#18181b',
    bodyMutedColor: '#52525b',
    borderDividerColor: '#e4e4e7',
    dotInactiveColor: '#e4e4e7',
    progressTrackColor: '#f4f4f5',
  },
};

interface CurriculumDocumentProps {
  data: CurriculumData;
  themeKey?: string;
  customAccentColor?: string;
}

export const CurriculumDocument: React.FC<CurriculumDocumentProps> = ({
  data,
  themeKey = 'classic_pdf',
  customAccentColor,
}) => {
  const baseTheme = curriculumThemes[themeKey] || curriculumThemes.classic_pdf;
  const theme: CurriculumThemeConfig = {
    ...baseTheme,
    accentColor: customAccentColor || baseTheme.accentColor,
  };

  return (
    <div
      id="cv-print-document"
      className="w-[210mm] min-h-[297mm] h-[297mm] mx-auto bg-white shadow-2xl relative overflow-hidden flex flex-col font-sans text-left select-text box-border"
      style={{
        width: '210mm',
        height: '297mm',
        maxHeight: '297mm',
        backgroundColor: theme.bodyBg,
        color: theme.bodyTextColor,
      }}
    >
      {/* HEADER SECTION (Flexbox layout: Photo on left, Name/Details on right) */}
      <header
        className="px-9 pt-7 pb-6 relative z-10 shrink-0 flex flex-row items-center gap-6"
        style={{
          backgroundColor: theme.headerBg,
          color: theme.headerTextColor,
        }}
      >
        {/* Profile Photo (Arch / Rounded Top Frame) */}
        <div className="shrink-0">
          <div
            className="w-[108px] h-[126px] rounded-t-[44px] rounded-b-[4px] overflow-hidden border-[3px] shadow-md flex items-center justify-center"
            style={{ borderColor: '#ffffff', backgroundColor: '#333333' }}
          >
            <img
              src={data.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'}
              alt={`${data.firstName} ${data.lastName}`}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
              }}
            />
          </div>
        </div>

        {/* Name & Job Title & 2-Col Flexbox Info */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          {/* Full Name */}
          <h1 className="text-[26px] leading-tight font-serif tracking-tight text-white uppercase flex flex-row items-baseline gap-2 flex-wrap">
            <span className="font-normal">{data.firstName || 'NOMBRE'}</span>
            <span className="font-extrabold">{data.lastName || 'APELLIDO'}</span>
          </h1>

          {/* Job Title in Accent Color */}
          <div
            className="text-[12px] font-bold tracking-[0.16em] uppercase mt-0.5 mb-3"
            style={{ color: theme.accentColor }}
          >
            {data.jobTitle || 'TÍTULO PROFESIONAL'}
          </div>

          {/* Header Sub-row: Left (Mi Perfil) / Right (Contact List) using Flexbox */}
          <div
            className="flex flex-row items-start justify-between gap-5 pt-2.5 border-t"
            style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            {/* Profile Summary (Flex child ~60%) */}
            <div className="flex-1 flex flex-col pr-2">
              <div className="flex flex-row items-center gap-1.5 mb-1">
                <span
                  className="w-2 h-2 rounded-[1px] shrink-0"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-white">
                  Mi Perfil
                </h2>
              </div>
              <p
                className="text-[9px] leading-[1.4] text-justify line-clamp-4"
                style={{ color: theme.headerSubtextColor }}
              >
                {data.profileSummary ||
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue. Consectetur adipiscing elit.'}
              </p>
            </div>

            {/* Contact Icons List (Flex child ~40%) */}
            <div className="w-[190px] shrink-0 flex flex-col justify-center gap-1.5 pl-1">
              {/* Phone */}
              {data.phone && (
                <div className="flex flex-row items-center gap-2">
                  <span
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 text-white shadow-xs"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Phone size={10} strokeWidth={2.5} />
                  </span>
                  <span
                    className="text-[9px] font-medium tracking-tight truncate"
                    style={{ color: theme.headerSubtextColor }}
                  >
                    {data.phone}
                  </span>
                </div>
              )}

              {/* Email */}
              {data.email && (
                <div className="flex flex-row items-center gap-2">
                  <span
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 text-white shadow-xs"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Mail size={10} strokeWidth={2.5} />
                  </span>
                  <span
                    className="text-[9px] font-medium tracking-tight truncate"
                    style={{ color: theme.headerSubtextColor }}
                  >
                    {data.email}
                  </span>
                </div>
              )}

              {/* Website */}
              {data.website && (
                <div className="flex flex-row items-center gap-2">
                  <span
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 text-white shadow-xs"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Globe size={10} strokeWidth={2.5} />
                  </span>
                  <span
                    className="text-[9px] font-medium tracking-tight truncate"
                    style={{ color: theme.headerSubtextColor }}
                  >
                    {data.website}
                  </span>
                </div>
              )}

              {/* Address */}
              {data.address && (
                <div className="flex flex-row items-center gap-2">
                  <span
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 text-white shadow-xs"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <MapPin size={10} strokeWidth={2.5} />
                  </span>
                  <span
                    className="text-[9px] font-medium tracking-tight truncate"
                    style={{ color: theme.headerSubtextColor }}
                  >
                    {data.address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* BODY CONTENT: Compact, proportional flexbox without excessive spacing */}
      <main className="flex-1 px-9 py-5 flex flex-row gap-8 items-start overflow-hidden">
        {/* LEFT COLUMN: Experiencia Laboral followed naturally by Formación Académica */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Experiencia Laboral */}
          {data.experiences && data.experiences.length > 0 && (
            <div className="flex flex-col">
              {/* Section Heading */}
              <div
                className="flex flex-row items-center gap-2 pb-1 mb-2.5 border-b"
                style={{ borderColor: theme.borderDividerColor }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-[1px] shrink-0"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <h2
                  className="text-[12px] font-extrabold uppercase tracking-[0.16em]"
                  style={{ color: theme.bodyTextColor }}
                >
                  Experiencia Laboral
                </h2>
              </div>

              {/* Experience List */}
              <div className="flex flex-col gap-2.5">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 flex flex-col gap-0.5">
                    {/* Square bullet */}
                    <span
                      className="absolute left-0 top-1 w-2 h-2 rounded-[1px]"
                      style={{ backgroundColor: theme.accentColor }}
                    />

                    {/* Company & Period Flex Row */}
                    <div className="flex flex-row items-baseline justify-between gap-2">
                      <h3
                        className="text-[10px] font-extrabold uppercase tracking-tight"
                        style={{ color: '#111827' }}
                      >
                        {exp.company}
                      </h3>
                      <span
                        className="text-[9px] font-bold tracking-tight shrink-0"
                        style={{ color: theme.accentColor }}
                      >
                        {exp.period}
                      </span>
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <p
                        className="text-[8.5px] leading-[1.35] text-justify"
                        style={{ color: theme.bodyMutedColor }}
                      >
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formación Académica */}
          {data.education && data.education.length > 0 && (
            <div className="flex flex-col">
              {/* Section Heading */}
              <div
                className="flex flex-row items-center gap-2 pb-1 mb-2.5 border-b"
                style={{ borderColor: theme.borderDividerColor }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-[1px] shrink-0"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <h2
                  className="text-[12px] font-extrabold uppercase tracking-[0.16em]"
                  style={{ color: theme.bodyTextColor }}
                >
                  Formación Académica
                </h2>
              </div>

              {/* Education List */}
              <div className="flex flex-col gap-2.5">
                {data.education.map((edu) => (
                  <div key={edu.id} className="relative pl-4 flex flex-col gap-0.5">
                    {/* Square bullet */}
                    <span
                      className="absolute left-0 top-1 w-2 h-2 rounded-[1px]"
                      style={{ backgroundColor: theme.accentColor }}
                    />

                    {/* Institution & Period Flex Row */}
                    <div className="flex flex-row items-baseline justify-between gap-2">
                      <h3
                        className="text-[10px] font-extrabold uppercase tracking-tight"
                        style={{ color: '#111827' }}
                      >
                        {edu.institution}
                      </h3>
                      <span
                        className="text-[9px] font-bold tracking-tight shrink-0"
                        style={{ color: theme.accentColor }}
                      >
                        {edu.period}
                      </span>
                    </div>

                    {/* Degree */}
                    {edu.degree && (
                      <p
                        className="text-[8.5px] font-medium"
                        style={{ color: theme.bodyMutedColor }}
                      >
                        {edu.degree}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Idiomas, Competencias, Habilidades with natural spacing */}
        <div
          className="w-[230px] shrink-0 pl-6 border-l flex flex-col gap-5"
          style={{ borderColor: theme.borderDividerColor }}
        >
          {/* Idiomas */}
          {data.languages && data.languages.length > 0 && (
            <div className="flex flex-col">
              {/* Section Heading */}
              <div
                className="flex flex-row items-center gap-2 pb-1 mb-2 border-b"
                style={{ borderColor: theme.borderDividerColor }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-[1px] shrink-0"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <h2
                  className="text-[12px] font-extrabold uppercase tracking-[0.16em]"
                  style={{ color: theme.bodyTextColor }}
                >
                  Idiomas
                </h2>
              </div>

              <div className="flex flex-col gap-1.5">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="flex flex-row items-center justify-between text-[9.5px]">
                    <div className="flex flex-row items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-[1px] shrink-0"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                      <span
                        className="font-bold"
                        style={{ color: '#111827' }}
                      >
                        {lang.name}
                      </span>
                    </div>
                    {lang.level && (
                      <span
                        className="text-[8.5px] font-medium"
                        style={{ color: '#6b7280' }}
                      >
                        {lang.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competencias */}
          {data.competencies && data.competencies.length > 0 && (
            <div className="flex flex-col">
              {/* Section Heading */}
              <div
                className="flex flex-row items-center gap-2 pb-1 mb-2 border-b"
                style={{ borderColor: theme.borderDividerColor }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-[1px] shrink-0"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <h2
                  className="text-[12px] font-extrabold uppercase tracking-[0.16em]"
                  style={{ color: theme.bodyTextColor }}
                >
                  Competencias
                </h2>
              </div>

              <div className="flex flex-col gap-2">
                {data.competencies.map((comp) => (
                  <div key={comp.id} className="flex flex-col gap-0.5">
                    <div
                      className="flex flex-row justify-between items-center text-[9px] font-bold"
                      style={{ color: '#111827' }}
                    >
                      <span>{comp.name}</span>
                      <span
                        className="text-[8.5px] font-extrabold"
                        style={{ color: theme.accentColor }}
                      >
                        {comp.percentage}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div
                      className="w-full h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: theme.progressTrackColor }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(Math.max(comp.percentage, 0), 100)}%`,
                          backgroundColor: theme.accentColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Habilidades */}
          {data.skills && data.skills.length > 0 && (
            <div className="flex flex-col">
              {/* Section Heading */}
              <div
                className="flex flex-row items-center gap-2 pb-1 mb-2 border-b"
                style={{ borderColor: theme.borderDividerColor }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-[1px] shrink-0"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <h2
                  className="text-[12px] font-extrabold uppercase tracking-[0.16em]"
                  style={{ color: theme.bodyTextColor }}
                >
                  Habilidades
                </h2>
              </div>

              <div className="flex flex-col gap-1.5">
                {data.skills.map((skill) => (
                  <div key={skill.id} className="flex flex-row items-center justify-between">
                    <span
                      className="text-[9.5px] font-bold truncate pr-2"
                      style={{ color: '#111827' }}
                    >
                      {skill.name}
                    </span>
                    {/* 5 Dots flex row */}
                    <div className="flex flex-row items-center gap-1 shrink-0">
                      {[1, 2, 3, 4, 5].map((dot) => {
                        const isFilled = dot <= skill.rating;
                        return (
                          <span
                            key={dot}
                            className="w-2 h-2 rounded-full transition-all"
                            style={{
                              backgroundColor: isFilled ? theme.accentColor : theme.dotInactiveColor,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Decorative Bottom Subtle Stripe in Accent Color */}
      <footer
        className="h-2 w-full shrink-0 mt-auto"
        style={{ backgroundColor: theme.accentColor }}
      />
    </div>
  );
};
