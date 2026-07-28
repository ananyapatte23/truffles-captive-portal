import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { ChangeTableModal } from './components/ChangeTableModal';
import { SplitBillModal } from './components/SplitBillModal';
import { Screen1CaptivePortal } from './components/Screen1CaptivePortal';
import { Screen2TableConfirmation } from './components/Screen2TableConfirmation';
import { Screen3MenuBrowser } from './components/Screen3MenuBrowser';
import { Screen4ItemDetailModal } from './components/Screen4ItemDetailModal';
import { Screen5CartDrawer } from './components/Screen5CartDrawer';
import { Screen6OrderTracking } from './components/Screen6OrderTracking';
import { Screen7BillAndPay } from './components/Screen7BillAndPay';
import { Screen8Feedback } from './components/Screen8Feedback';

const MainContent: React.FC = () => {
  const { currentScreen } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2D2D2D] font-sans antialiased selection:bg-[#800020] selection:text-white">
      <Header />
      <ToastContainer />
      <ChangeTableModal />
      <SplitBillModal />
      <Screen4ItemDetailModal />
      <Screen5CartDrawer />

      <main className="transition-all duration-300">
        {currentScreen === 'captive' && <Screen1CaptivePortal />}
        {currentScreen === 'landing' && <Screen2TableConfirmation />}
        {currentScreen === 'menu' && <Screen3MenuBrowser />}
        {currentScreen === 'tracking' && <Screen6OrderTracking />}
        {currentScreen === 'bill' && <Screen7BillAndPay />}
        {currentScreen === 'feedback' && <Screen8Feedback />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
