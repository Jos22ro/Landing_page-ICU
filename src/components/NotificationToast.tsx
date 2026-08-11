import React from 'react';
import { useBrand } from '../context/BrandContext';

export const NotificationToast: React.FC = () => {
  const { toast } = useBrand();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-[#5d172d] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-white/20 flex items-center gap-3 text-sm font-bold font-sans">
        <span className="material-symbols-outlined text-[#ff9ab0] text-xl">check_circle</span>
        <span>{toast}</span>
      </div>
    </div>
  );
};
