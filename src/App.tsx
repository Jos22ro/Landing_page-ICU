import React from 'react';
import { BrandProvider, useBrand } from './context/BrandContext';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ColoresView } from './components/ColoresView';
import { TipografiaView } from './components/TipografiaView';
import { PaletasView } from './components/PaletasView';
import { LandingPublicaView } from './components/LandingPublicaView';
import { LoginView } from './components/LoginView';
import { NuevoEventoModal } from './components/NuevoEventoModal';
import { AjustesModal } from './components/AjustesModal';
import { NotificationToast } from './components/NotificationToast';

const MainContent: React.FC = () => {
  const { activeTab, isLoggedIn, currentPath } = useBrand();

  const isAdminRoute = currentPath === '/admin' || currentPath === '/admin/';

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return <LoginView />;
    }

    return (
      <div className="min-h-screen bg-[#fdf9f2] text-[#1c1c18] font-serif flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-3 sm:p-6 transition-all min-h-screen">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'colores' && <ColoresView />}
          {activeTab === 'tipografia' && <TipografiaView />}
          {activeTab === 'paletas' && <PaletasView />}
        </main>
        <NuevoEventoModal />
        <AjustesModal />
        <NotificationToast />
      </div>
    );
  }

  return <LandingPublicaView />;
};

export default function App() {
  return (
    <BrandProvider>
      <MainContent />
    </BrandProvider>
  );
}
