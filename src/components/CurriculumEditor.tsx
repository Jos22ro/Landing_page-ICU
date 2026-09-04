import React, { useRef, useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { WorkExperienceItem, EducationItem, LanguageItem, SoftwareCompetencyItem, SoftSkillItem } from '../types';
import {
  validateEmail,
  validateNotEmpty,
  validatePeriod,
  parsePeriod,
  formatPeriod,
  validatePhone,
  validateUrl,
  validateMinLength,
} from '../utils/validation';

interface CurriculumEditorProps {
  compact?: boolean;
}

export const CurriculumEditor: React.FC<CurriculumEditorProps> = ({ compact = false }) => {
  const {
    curriculumData,
    updateCurriculumField,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    addCompetency,
    updateCompetency,
    deleteCompetency,
    addSkill,
    updateSkill,
    deleteSkill,
    showToast,
  } = useBrand();

  const [activeTabSection, setActiveTabSection] = useState<'all' | 'personal' | 'experience' | 'education' | 'skills'>(
    compact ? 'personal' : 'all'
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // VALIDACIONES EN TIEMPO REAL
  const emailVal = validateEmail(curriculumData.email);
  const firstNameVal = validateNotEmpty(curriculumData.firstName, 'El nombre');
  const lastNameVal = validateNotEmpty(curriculumData.lastName, 'El apellido');
  const jobTitleVal = validateNotEmpty(curriculumData.jobTitle, 'El cargo');

  const phoneEmpty = validateNotEmpty(curriculumData.phone, 'El teléfono');
  const phoneVal = !phoneEmpty.isValid ? phoneEmpty : validatePhone(curriculumData.phone);

  const websiteEmpty = validateNotEmpty(curriculumData.website, 'El sitio web');
  const websiteVal = !websiteEmpty.isValid ? websiteEmpty : validateUrl(curriculumData.website);

  const addressVal = validateNotEmpty(curriculumData.address, 'La dirección');

  const profileEmpty = validateNotEmpty(curriculumData.profileSummary, 'El resumen de perfil');
  const profileSummaryVal = !profileEmpty.isValid
    ? profileEmpty
    : validateMinLength(curriculumData.profileSummary, 20, 'El resumen de perfil');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          updateCurriculumField('photoUrl', result);
          showToast('Fotografía de perfil actualizada');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Por favor arrastra un archivo de imagen válido');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          updateCurriculumField('photoUrl', result);
          showToast('Fotografía de perfil actualizada');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section navigation tabs */}
      <div className="flex bg-[#e6e2db] p-1 rounded-lg overflow-x-auto gap-1">
        <button
          type="button"
          onClick={() => setActiveTabSection('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTabSection === 'all'
              ? 'bg-white text-[#5d172d] shadow-sm'
              : 'text-[#665d54] hover:text-[#1c1c18]'
          }`}
        >
          Todas
        </button>
        <button
          type="button"
          onClick={() => setActiveTabSection('personal')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTabSection === 'personal'
              ? 'bg-white text-[#5d172d] shadow-sm'
              : 'text-[#665d54] hover:text-[#1c1c18]'
          }`}
        >
          1. Perfil & Contacto
        </button>
        <button
          type="button"
          onClick={() => setActiveTabSection('experience')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTabSection === 'experience'
              ? 'bg-white text-[#5d172d] shadow-sm'
              : 'text-[#665d54] hover:text-[#1c1c18]'
          }`}
        >
          2. Experiencia ({curriculumData.experiences.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTabSection('education')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTabSection === 'education'
              ? 'bg-white text-[#5d172d] shadow-sm'
              : 'text-[#665d54] hover:text-[#1c1c18]'
          }`}
        >
          3. Formación ({curriculumData.education.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTabSection('skills')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTabSection === 'skills'
              ? 'bg-white text-[#5d172d] shadow-sm'
              : 'text-[#665d54] hover:text-[#1c1c18]'
          }`}
        >
          4. Habilidades
        </button>
      </div>

      {/* SECTION 1: Personal Data & Photo & Contact */}
      {(activeTabSection === 'all' || activeTabSection === 'personal') && (
        <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[rgba(38,33,28,0.1)] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#5d172d]/10 text-[#5d172d] flex items-center justify-center font-bold text-xs">
                1
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1c1c18]">Datos Personales & Fotografía</h3>
                <p className="text-xs text-[#665d54]">Cabecera principal del currículum.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Photo Upload Area */}
            <div className="md:col-span-1 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all border-[rgba(38,33,28,0.2)] bg-[#fdf9f2]/50 hover:bg-[#fdf9f2]">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`w-full flex flex-col items-center text-center ${isDragOver ? 'scale-105 opacity-80' : ''}`}
              >
                <div className="relative w-28 h-32 mb-3 rounded-t-full rounded-b-md overflow-hidden border-2 border-[#5d172d] shadow-md bg-[#26211c] group">
                  <img
                    src={curriculumData.photoUrl || 'https://via.placeholder.com/150'}
                    alt="Foto de Perfil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
                    }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl">photo_camera</span>
                    <span className="text-[9px] font-bold mt-0.5">Cambiar Foto</span>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="space-y-1.5 w-full">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-1.5 px-2.5 bg-white border border-[rgba(38,33,28,0.2)] text-[#5d172d] rounded-lg font-bold text-xs hover:bg-[#5d172d]/5 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    <span>Cargar Imagen</span>
                  </button>
                  <p className="text-[10px] text-[#665d54]">O arrastra un archivo</p>

                  <div className="pt-1 text-left w-full">
                    <label className="text-[10px] font-semibold text-[#665d54] block mb-0.5">O URL web:</label>
                    <input
                      type="text"
                      value={curriculumData.photoUrl}
                      onChange={(e) => updateCurriculumField('photoUrl', e.target.value)}
                      placeholder="https://ejemplo.com/foto.jpg"
                      className="w-full text-xs px-2 py-1 rounded border border-[rgba(38,33,28,0.14)] bg-white focus:outline-none focus:border-[#5d172d]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Fields */}
            <div className="md:col-span-2 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#665d54]">
                      Nombre *
                    </label>
                    <span className="text-[10px] font-mono text-[#665d54]">
                      {(curriculumData.firstName || '').length}/30 max
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={30}
                    value={curriculumData.firstName}
                    onChange={(e) => updateCurriculumField('firstName', e.target.value)}
                    placeholder="Ej. Alejandro"
                    className={`w-full px-3 py-2 rounded-lg border text-sm text-[#1c1c18] bg-white focus:outline-none font-serif font-medium ${
                      !firstNameVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                    }`}
                  />
                  {!firstNameVal.isValid && (
                    <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
                      {firstNameVal.error}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#665d54]">
                      Apellido *
                    </label>
                    <span className="text-[10px] font-mono text-[#665d54]">
                      {(curriculumData.lastName || '').length}/30 max
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={30}
                    value={curriculumData.lastName}
                    onChange={(e) => updateCurriculumField('lastName', e.target.value)}
                    placeholder="Ej. Torres"
                    className={`w-full px-3 py-2 rounded-lg border text-sm text-[#1c1c18] bg-white focus:outline-none font-serif font-bold ${
                      !lastNameVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                    }`}
                  />
                  {!lastNameVal.isValid && (
                    <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
                      {lastNameVal.error}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#665d54]">
                    Cargo / Especialidad Profesional *
                  </label>
                  <span className="text-[10px] font-mono text-[#665d54]">
                    {(curriculumData.jobTitle || '').length}/40 max
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={40}
                  value={curriculumData.jobTitle}
                  onChange={(e) => updateCurriculumField('jobTitle', e.target.value)}
                  placeholder="Ej. Programador web"
                  className={`w-full px-3 py-2 rounded-lg border text-sm font-bold bg-white focus:outline-none ${
                    !jobTitleVal.isValid
                      ? 'border-rose-400 focus:border-rose-600 text-rose-700 bg-rose-50/20'
                      : 'border-[rgba(38,33,28,0.14)] text-[#5d172d] focus:border-[#5d172d]'
                  }`}
                />
                {!jobTitleVal.isValid && (
                  <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
                    {jobTitleVal.error}
                  </span>
                )}
              </div>

              {/* Contact Information */}
              <div className="pt-2 border-t border-[rgba(38,33,28,0.08)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs text-[#665d54] font-medium">
                        <span className="material-symbols-outlined text-xs align-middle mr-1 text-[#5d172d]">call</span>
                        Teléfono *
                      </label>
                      <span className="text-[10px] font-mono text-[#665d54]">
                        {(curriculumData.phone || '').length}/25 max
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={25}
                      value={curriculumData.phone}
                      onChange={(e) => updateCurriculumField('phone', e.target.value)}
                      placeholder="+34-91-1234-567"
                      className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white focus:outline-none ${
                        !phoneVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                      }`}
                    />
                    {!phoneVal.isValid && (
                      <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
                        {phoneVal.error}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs text-[#665d54] font-medium">
                        <span className="material-symbols-outlined text-xs align-middle mr-1 text-[#5d172d]">mail</span>
                        Email (@) *
                      </label>
                      <span className="text-[10px] font-mono text-[#665d54]">
                        {(curriculumData.email || '').length}/40 max
                      </span>
                    </div>
                    <input
                      type="email"
                      maxLength={40}
                      value={curriculumData.email}
                      onChange={(e) => updateCurriculumField('email', e.target.value)}
                      placeholder="hola@unsitiogenial.es"
                      className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white focus:outline-none ${
                        !emailVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                      }`}
                    />
                    {!emailVal.isValid && (
                      <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
                        {emailVal.error}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs text-[#665d54] font-medium">
                        <span className="material-symbols-outlined text-xs align-middle mr-1 text-[#5d172d]">language</span>
                        Sitio Web *
                      </label>
                      <span className="text-[10px] font-mono text-[#665d54]">
                        {(curriculumData.website || '').length}/40 max
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={40}
                      value={curriculumData.website}
                      onChange={(e) => updateCurriculumField('website', e.target.value)}
                      placeholder="www.unsitiogenial.es"
                      className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white focus:outline-none ${
                        !websiteVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                      }`}
                    />
                    {!websiteVal.isValid && (
                      <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
                        {websiteVal.error}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs text-[#665d54] font-medium">
                        <span className="material-symbols-outlined text-xs align-middle mr-1 text-[#5d172d]">location_on</span>
                        Dirección *
                      </label>
                      <span className="text-[10px] font-mono text-[#665d54]">
                        {(curriculumData.address || '').length}/60 max
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={60}
                      value={curriculumData.address}
                      onChange={(e) => updateCurriculumField('address', e.target.value)}
                      placeholder="Calle Cualquiera 123"
                      className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white focus:outline-none ${
                        !addressVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                      }`}
                    />
                    {!addressVal.isValid && (
                      <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
                        {addressVal.error}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="pt-3 border-t border-[rgba(38,33,28,0.08)]">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#665d54]">
                Mi Perfil (Resumen) *
              </label>
              <span className="text-[10px] font-mono font-bold text-[#5d172d]">
                {(curriculumData.profileSummary || '').length}/240 max
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={240}
              value={curriculumData.profileSummary}
              onChange={(e) => updateCurriculumField('profileSummary', e.target.value)}
              placeholder="Escribe una breve descripción de tu trayectoria..."
              className={`w-full p-2.5 rounded-lg border text-xs text-[#1c1c18] bg-white focus:outline-none leading-relaxed ${
                !profileSummaryVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
              }`}
            />
            {!profileSummaryVal.isValid && (
              <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
                {profileSummaryVal.error}
              </span>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: Work Experience */}
      {(activeTabSection === 'all' || activeTabSection === 'experience') && (
        <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(38,33,28,0.1)] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#5d172d]/10 text-[#5d172d] flex items-center justify-center font-bold text-xs">
                2
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1c1c18]">Experiencia Laboral</h3>
                <p className="text-xs text-[#665d54]">Empleos y responsabilidades.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => addWorkExperience()}
              className="px-2.5 py-1.5 bg-[#5d172d] text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Añadir</span>
            </button>
          </div>

          <div className="space-y-3">
            {curriculumData.experiences.map((exp: WorkExperienceItem, index: number) => {
              const { desde, hasta } = parsePeriod(exp.period);
              const pVal = validatePeriod(desde, hasta);
              const companyVal = validateNotEmpty(exp.company, 'La empresa');
              const descEmpty = validateNotEmpty(exp.description, 'La descripción');
              const descVal = !descEmpty.isValid ? descEmpty : validateMinLength(exp.description, 10, 'La descripción');

              return (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-xl border border-[rgba(38,33,28,0.14)] bg-[#fdf9f2]/40 hover:bg-white transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#665d54] uppercase tracking-wider">
                        #{index + 1}
                      </span>
                      {(!companyVal.isValid || !descVal.isValid || !pVal.isValid) && (
                        <span className="text-[10px] text-rose-600 bg-rose-100 font-bold px-1.5 py-0.5 rounded">
                          Incompleto o período inválido
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteWorkExperience(exp.id)}
                      className="p-1 text-[#A03434] hover:bg-[#ffdad6] rounded transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="block text-[11px] font-medium text-[#665d54]">Empresa *</label>
                        <span className="text-[9px] font-mono text-[#665d54]">{(exp.company || '').length}/35 max</span>
                      </div>
                      <input
                        type="text"
                        maxLength={35}
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                        placeholder="Empresa"
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold bg-white focus:outline-none ${
                          !companyVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                        }`}
                      />
                      {!companyVal.isValid && (
                        <span className="text-[9px] text-rose-600 font-medium">{companyVal.error}</span>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="block text-[11px] font-medium text-[#665d54]">
                          Período (Desde - Hasta) *
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <input
                            type="text"
                            maxLength={15}
                            value={desde}
                            onChange={(e) => {
                              const newDesde = e.target.value;
                              updateWorkExperience(exp.id, { period: formatPeriod(newDesde, hasta) });
                            }}
                            placeholder="Desde (Ej. 2019)"
                            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white focus:outline-none ${
                              !desde.trim() || pVal.error ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                            }`}
                          />
                          {!desde.trim() && (
                            <span className="text-[9px] text-rose-600 font-medium">Requerido</span>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            maxLength={15}
                            value={hasta}
                            onChange={(e) => {
                              const newHasta = e.target.value;
                              updateWorkExperience(exp.id, { period: formatPeriod(desde, newHasta) });
                            }}
                            placeholder="Hasta (Ej. 2023 o Presente)"
                            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white focus:outline-none ${
                              !hasta.trim() || pVal.error ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                            }`}
                          />
                          {!hasta.trim() && (
                            <span className="text-[9px] text-rose-600 font-medium">Requerido</span>
                          )}
                        </div>
                      </div>
                      {pVal.error && (
                        <div className="mt-1 text-[10px] text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <span className="material-symbols-outlined text-[12px] shrink-0">warning</span>
                          <span>{pVal.error}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[11px] font-medium text-[#665d54]">Descripción *</label>
                      <span className="text-[9px] font-mono font-bold text-[#5d172d]">{(exp.description || '').length}/154 max</span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={154}
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(exp.id, { description: e.target.value })}
                      placeholder="Responsabilidades y logros..."
                      className={`w-full p-2 rounded-lg border text-xs text-[#1c1c18] bg-white focus:outline-none ${
                        !descVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                      }`}
                    />
                    {!descVal.isValid && (
                      <span className="text-[9px] text-rose-600 font-medium">{descVal.error}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: Education */}
      {(activeTabSection === 'all' || activeTabSection === 'education') && (
        <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(38,33,28,0.1)] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#5d172d]/10 text-[#5d172d] flex items-center justify-center font-bold text-xs">
                3
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1c1c18]">Formación Académica</h3>
                <p className="text-xs text-[#665d54]">Títulos y estudios.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => addEducation()}
              className="px-2.5 py-1.5 bg-[#5d172d] text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Añadir</span>
            </button>
          </div>

          <div className="space-y-3">
            {curriculumData.education.map((edu: EducationItem, index: number) => {
              const { desde, hasta } = parsePeriod(edu.period);
              const pVal = validatePeriod(desde, hasta);
              const instVal = validateNotEmpty(edu.institution, 'La institución');
              const degreeVal = validateNotEmpty(edu.degree, 'El título');

              return (
                <div
                  key={edu.id}
                  className="p-3.5 rounded-xl border border-[rgba(38,33,28,0.14)] bg-[#fdf9f2]/40 hover:bg-white transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#665d54] uppercase tracking-wider">
                        #{index + 1}
                      </span>
                      {(!instVal.isValid || !degreeVal.isValid || !pVal.isValid) && (
                        <span className="text-[10px] text-rose-600 bg-rose-100 font-bold px-1.5 py-0.5 rounded">
                          Incompleto o período inválido
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteEducation(edu.id)}
                      className="p-1 text-[#A03434] hover:bg-[#ffdad6] rounded transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="block text-[11px] font-medium text-[#665d54]">Institución *</label>
                        <span className="text-[9px] font-mono text-[#665d54]">{(edu.institution || '').length}/35 max</span>
                      </div>
                      <input
                        type="text"
                        maxLength={35}
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        placeholder="Universidad"
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold bg-white focus:outline-none ${
                          !instVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                        }`}
                      />
                      {!instVal.isValid && (
                        <span className="text-[9px] text-rose-600 font-medium">{instVal.error}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="block text-[11px] font-medium text-[#665d54]">Título / Carrera *</label>
                        <span className="text-[9px] font-mono text-[#665d54]">{(edu.degree || '').length}/40 max</span>
                      </div>
                      <input
                        type="text"
                        maxLength={40}
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="Carrera"
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white focus:outline-none ${
                          !degreeVal.isValid ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                        }`}
                      />
                      {!degreeVal.isValid && (
                        <span className="text-[9px] text-rose-600 font-medium">{degreeVal.error}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="block text-[11px] font-medium text-[#665d54]">
                          Período (Desde - Hasta) *
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <input
                            type="text"
                            maxLength={15}
                            value={desde}
                            onChange={(e) => {
                              const newDesde = e.target.value;
                              updateEducation(edu.id, { period: formatPeriod(newDesde, hasta) });
                            }}
                            placeholder="Desde (2018)"
                            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white focus:outline-none ${
                              !desde.trim() || pVal.error ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                            }`}
                          />
                          {!desde.trim() && (
                            <span className="text-[9px] text-rose-600 font-medium">Requerido</span>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            maxLength={15}
                            value={hasta}
                            onChange={(e) => {
                              const newHasta = e.target.value;
                              updateEducation(edu.id, { period: formatPeriod(desde, newHasta) });
                            }}
                            placeholder="Hasta (2023)"
                            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white focus:outline-none ${
                              !hasta.trim() || pVal.error ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                            }`}
                          />
                          {!hasta.trim() && (
                            <span className="text-[9px] text-rose-600 font-medium">Requerido</span>
                          )}
                        </div>
                      </div>
                      {pVal.error && (
                        <div className="mt-1 text-[10px] text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <span className="material-symbols-outlined text-[12px] shrink-0">warning</span>
                          <span>{pVal.error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 4: Languages, Competencies & Skills */}
      {(activeTabSection === 'all' || activeTabSection === 'skills') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Languages */}
          <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[rgba(38,33,28,0.1)] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1c18]">Idiomas</h3>
              <button
                type="button"
                onClick={() => addLanguage()}
                className="px-2 py-0.5 bg-[#5d172d] text-white rounded text-[10px] font-bold"
              >
                + Añadir
              </button>
            </div>
            <div className="space-y-2">
              {curriculumData.languages.map((lang: LanguageItem) => {
                const isNameEmpty = !lang.name.trim();
                const isLevelEmpty = !lang.level.trim();
                return (
                  <div key={lang.id} className="bg-[#fdf9f2]/50 p-1.5 rounded border border-[rgba(38,33,28,0.1)] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={20}
                        value={lang.name}
                        onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                        placeholder="Idioma *"
                        className={`w-full text-xs font-semibold px-1.5 py-0.5 bg-white border rounded focus:outline-none ${
                          isNameEmpty ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                        }`}
                      />
                      <input
                        type="text"
                        maxLength={20}
                        value={lang.level}
                        onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}
                        placeholder="Nivel *"
                        className={`w-24 text-[11px] px-1.5 py-0.5 bg-white border rounded focus:outline-none ${
                          isLevelEmpty ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => deleteLanguage(lang.id)}
                        className="text-[#A03434] hover:bg-[#ffdad6] p-0.5 rounded cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                    {(isNameEmpty || isLevelEmpty) && (
                      <span className="text-[9px] text-rose-600 font-medium block">
                        Campo(s) requerido(s) sin rellenar
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Competencies */}
          <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[rgba(38,33,28,0.1)] pb-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1c18]">Competencias</h3>
                <span className="text-[9px] text-[#665d54]">Escala de 25 en 25 (hasta 100%)</span>
              </div>
              <button
                type="button"
                onClick={() => addCompetency()}
                className="px-2 py-0.5 bg-[#5d172d] text-white rounded text-[10px] font-bold"
              >
                + Añadir
              </button>
            </div>
            <div className="space-y-2.5">
              {curriculumData.competencies.map((comp: SoftwareCompetencyItem) => {
                const isNameEmpty = !comp.name.trim();
                return (
                  <div key={comp.id} className="bg-[#fdf9f2]/50 p-2 rounded border border-[rgba(38,33,28,0.1)] space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <input
                        type="text"
                        maxLength={25}
                        value={comp.name}
                        onChange={(e) => updateCompetency(comp.id, { name: e.target.value })}
                        placeholder="Software *"
                        className={`w-full text-xs font-semibold px-1.5 py-0.5 bg-white border rounded focus:outline-none ${
                          isNameEmpty ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                        }`}
                      />
                      <span className="text-[10px] font-bold text-[#5d172d] shrink-0 font-mono">{comp.percentage}%</span>
                      <button
                        type="button"
                        onClick={() => deleteCompetency(comp.id)}
                        className="text-[#A03434] hover:bg-[#ffdad6] p-0.5 rounded cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>

                    {isNameEmpty && (
                      <span className="text-[9px] text-rose-600 font-medium block">
                        Nombre de software requerido
                      </span>
                    )}

                    <div className="space-y-1">
                      <input
                        type="range"
                        min="25"
                        max="100"
                        step="25"
                        value={comp.percentage}
                        onChange={(e) => updateCompetency(comp.id, { percentage: Number(e.target.value) })}
                        className="w-full accent-[#5d172d] cursor-pointer h-1.5"
                      />
                      <div className="flex justify-between items-center text-[9px] font-mono text-[#665d54] px-0.5">
                        {[25, 50, 75, 100].map((stepVal) => (
                          <button
                            key={stepVal}
                            type="button"
                            onClick={() => updateCompetency(comp.id, { percentage: stepVal })}
                            className={`px-1 py-0.2 rounded text-[8px] font-bold cursor-pointer transition-colors ${
                              comp.percentage === stepVal
                                ? 'bg-[#5d172d] text-white'
                                : 'text-[#665d54] hover:bg-[#f7f3ec]'
                            }`}
                          >
                            {stepVal}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Skills */}
          <section className="bg-white rounded-xl shadow-1 border border-[rgba(38,33,28,0.14)] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[rgba(38,33,28,0.1)] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1c18]">Habilidades</h3>
              <button
                type="button"
                onClick={() => addSkill()}
                className="px-2 py-0.5 bg-[#5d172d] text-white rounded text-[10px] font-bold"
              >
                + Añadir
              </button>
            </div>
            <div className="space-y-2">
              {curriculumData.skills.map((skill: SoftSkillItem) => {
                const isNameEmpty = !skill.name.trim();
                return (
                  <div key={skill.id} className="bg-[#fdf9f2]/50 p-2 rounded border border-[rgba(38,33,28,0.1)] space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <input
                        type="text"
                        maxLength={25}
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                        placeholder="Habilidad *"
                        className={`w-full text-xs font-semibold px-1.5 py-0.5 bg-white border rounded focus:outline-none ${
                          isNameEmpty ? 'border-rose-400 focus:border-rose-600 bg-rose-50/20' : 'border-[rgba(38,33,28,0.14)] focus:border-[#5d172d]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => deleteSkill(skill.id)}
                        className="text-[#A03434] hover:bg-[#ffdad6] p-0.5 rounded cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                    {isNameEmpty && (
                      <span className="text-[9px] text-rose-600 font-medium block">
                        Nombre de habilidad requerido
                      </span>
                    )}
                    <div className="flex items-center justify-end gap-1 pt-0.5">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <button
                          key={dot}
                          type="button"
                          onClick={() => updateSkill(skill.id, { rating: dot })}
                          className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                            dot <= skill.rating ? 'bg-[#5d172d]' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
