import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, ShoppingBag, Utensils, Receipt, Sparkles, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    selectedTable,
    branchName,
    isWifiConnected,
    cartTotalItemsCount,
    setIsCartOpen,
    setIsChangeTableModalOpen,
    orders,
  } = useApp();

  // Don't render full header on captive portal or table confirmation screen
  if (currentScreen === 'captive' || currentScreen === 'landing') {
    return null;
  }

  const activeOrdersCount = orders.filter((o) => o.status !== 'served').length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E2D9] transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Location */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('menu')}
            className="text-left group flex items-center gap-3"
          >
            <div className="bg-[#800020] text-white font-bold px-3 py-1 rounded text-lg tracking-tight shadow-xs">
              TRUFFLES
            </div>
            <div className="h-6 w-px bg-[#E5E2D9] hidden sm:block"></div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8475] font-semibold">
                Branch
              </span>
              <span className="text-xs font-bold leading-tight text-[#2D2D2D] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#800020]" />
                {branchName}
              </span>
            </div>
          </button>
        </div>

        {/* Table Badge & Wi-Fi indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Table Selector Chip */}
          <button
            onClick={() => setIsChangeTableModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#F5F3EF] hover:bg-[#E5E2D9] text-[#2D2D2D] px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-[#E5E2D9] shadow-2xs active:scale-95"
            title="Change Table"
          >
            <Utensils className="w-3.5 h-3.5 text-[#800020]" />
            <span>Table {selectedTable}</span>
            <span className="text-[10px] text-[#8A8475] font-normal">Edit</span>
          </button>

          {/* Wi-Fi Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#F0EEE6] rounded-full border border-[#E5E2D9]">
            <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-[#5C574E]">
              Wi-Fi Connected
            </span>
          </div>

          {/* Nav Quick Actions */}
          <div className="flex items-center gap-1.5">
            {/* Active Order Tracker Button */}
            {orders.length > 0 && (
              <button
                onClick={() => setCurrentScreen('tracking')}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  currentScreen === 'tracking'
                    ? 'bg-[#800020] text-white shadow-xs'
                    : 'bg-[#F5F3EF] text-[#2D2D2D] border border-[#E5E2D9] hover:bg-[#E5E2D9]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden xs:inline">Tracking</span>
                {activeOrdersCount > 0 && (
                  <span className="bg-[#800020] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border border-white/20">
                    {activeOrdersCount}
                  </span>
                )}
              </button>
            )}

            {/* Bill Button */}
            {orders.length > 0 && (
              <button
                onClick={() => setCurrentScreen('bill')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  currentScreen === 'bill'
                    ? 'bg-[#800020] text-white'
                    : 'bg-[#F5F3EF] text-[#2D2D2D] border border-[#E5E2D9] hover:bg-[#E5E2D9]'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bill</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2 rounded-full bg-[#800020] text-white hover:bg-[#600018] transition-all shadow-sm active:scale-95 ml-1"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartTotalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FFC107] text-[#1A1A1A] font-black text-[11px] h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-scale-up">
                  {cartTotalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
