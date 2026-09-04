import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { AlertCircle, CheckCircle2, Lock, Mail, ArrowLeft } from 'lucide-react';
import { validateEmail } from '../utils/validation';

export const LoginView: React.FC = () => {
  const { login, navigate, colors } = useBrand();
  const [email, setEmail] = useState('adriana@icueventos.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Validaciones
  const emailValidation = validateEmail(email);
  const emailError = emailValidation.error;

  const passwordError = !password.trim()
    ? 'La contraseña es obligatoria'
    : password.length < 6
    ? 'La contraseña debe tener al menos 6 caracteres'
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!emailError && !passwordError) {
      setError(null);
      login();
    } else {
      setError('Por favor corrige los campos señalados antes de ingresar');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-1 border border-[rgba(38,33,28,0.14)] space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white font-serif font-bold text-3xl shadow-cta"
            style={{ backgroundColor: colors.accent }}
          >
            ICU
          </div>
          <h1 className="text-2xl font-bold font-serif text-[#1c1c18] pt-2">
            Panel de Administración
          </h1>
          <p className="text-xs text-[#665d54] uppercase tracking-widest font-semibold">
            Gestión de Marca & Eventos
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1.5 flex items-center justify-between">
              <span>Correo Electrónico *</span>
              {touched.email && emailError && (
                <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> Inválido
                </span>
              )}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#665d54] text-lg">
                mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                className={`w-full rounded-lg pl-10 pr-4 py-3 text-sm text-[#1c1c18] transition-all ${
                  touched.email && emailError
                    ? 'bg-rose-50/40 border border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] focus:outline-none focus:border-[#5d172d] focus:bg-white'
                }`}
                placeholder="admin@icueventos.com"
              />
            </div>
            {touched.email && emailError && (
              <p className="text-xs text-rose-600 mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1.5 flex items-center justify-between">
              <span>Contraseña *</span>
              {touched.password && passwordError && (
                <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> Requerida
                </span>
              )}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#665d54] text-lg">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                className={`w-full rounded-lg pl-10 pr-4 py-3 text-sm text-[#1c1c18] transition-all ${
                  touched.password && passwordError
                    ? 'bg-rose-50/40 border border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] focus:outline-none focus:border-[#5d172d] focus:bg-white'
                }`}
                placeholder="••••••••"
              />
            </div>
            {touched.password && passwordError && (
              <p className="text-xs text-rose-600 mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest text-white shadow-cta transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: colors.accent }}
          >
            <span className="material-symbols-outlined text-base">login</span>
            <span>Entrar al Panel Admin</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[rgba(38,33,28,0.14)] text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#5d172d] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la vista pública de marca</span>
          </button>
        </div>
      </div>
    </div>
  );
};
