import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';

export const LoginView: React.FC = () => {
  const { login, navigate, colors } = useBrand();
  const [email, setEmail] = useState('adriana@icueventos.com');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      login();
    } else {
      setError('Por favor completa las credenciales');
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
          <div className="p-3 bg-[#ffdad6] text-[#A03434] rounded-lg text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#665d54] text-lg">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] rounded-lg pl-10 pr-4 py-3 text-sm text-[#1c1c18] focus:outline-none focus:border-[#5d172d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#534245] mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#665d54] text-lg">
                lock
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f7f3ec] border border-[rgba(38,33,28,0.14)] rounded-lg pl-10 pr-4 py-3 text-sm text-[#1c1c18] focus:outline-none focus:border-[#5d172d]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest text-white shadow-cta transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2"
            style={{ backgroundColor: colors.accent }}
          >
            <span className="material-symbols-outlined text-base">login</span>
            <span>Entrar al Panel Admin</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[rgba(38,33,28,0.14)] text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#5d172d] font-bold hover:underline inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Volver a la Landing Pública</span>
          </button>
        </div>
      </div>
    </div>
  );
};
