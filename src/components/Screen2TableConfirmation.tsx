import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, MapPin, Utensils, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

export const Screen2TableConfirmation: React.FC = () => {
  const {
    setCurrentScreen,
    selectedTable,
    branchName,
    setIsChangeTableModalOpen,
    userInfo,
  } = useApp();

  const firstName = userInfo.fullName.split(' ')[0] || 'Guest';

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between p-4 sm:p-6 text-[#2D2D2D] relative overflow-hidden">
      {/* Decorative Food Hero background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-72 bg-[#800020]/5 blur-2xl -z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md mx-auto w-full my-auto py-6 flex flex-col items-center text-center">
        {/* Wi-Fi Connected Pill */}
        <div className="inline-flex items-center gap-2 bg-[#F0EEE6] text-[#5C574E] px-4 py-1.5 rounded-full text-xs font-bold border border-[#E5E2D9] shadow-2xs mb-4 animate-fade-in">
          <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse"></div>
          <Wifi className="w-3.5 h-3.5 text-[#5C574E]" />
          <span>Wi-Fi Connected • Truffles-Free-WiFi</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E5E2D9] w-full flex flex-col items-center relative overflow-hidden">
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-2 bg-[#800020]" />

          <div className="w-16 h-16 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center mb-3 mt-1 shadow-2xs">
            <Utensils className="w-8 h-8" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-1">
            Welcome, {firstName}!
          </h1>

          <p className="text-xs uppercase font-bold tracking-widest text-[#800020] mb-5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
            <span>Instant Table Ordering</span>
          </p>

          {/* Welcome Voucher Unlocked Banner */}
          <div className="w-full bg-[#FDF0F2] border border-[#F5D0D6] rounded-2xl p-3.5 mb-5 text-left flex items-center gap-3">
            <div className="text-xl">🎁</div>
            <div>
              <div className="text-xs font-extrabold text-[#800020]">
                Surprise Welcome Voucher Unlocked!
              </div>
              <div className="text-[11px] text-[#8A8475]">
                Enjoy 15% OFF on your Table {selectedTable} order automatically.
              </div>
            </div>
          </div>

          {/* Table Confirmation Box */}
          <div className="w-full bg-[#F5F3EF] p-5 rounded-2xl border border-[#E5E2D9] mb-5 flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-[#8A8475] uppercase tracking-wider">
              You're ordering from
            </span>
            <span className="text-4xl sm:text-5xl font-black text-[#800020] my-1 tracking-tight">
              TABLE {selectedTable}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#5C574E] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#800020]" />
              <span>{branchName}</span>
            </div>
          </div>

          <p className="text-sm text-[#8A8475] leading-relaxed mb-6 max-w-xs">
            Browse the menu and order whenever you're ready. We'll bring everything fresh to your table.
          </p>

          {/* CTAs */}
          <div className="w-full space-y-3">
            <button
              onClick={() => setCurrentScreen('menu')}
              className="w-full py-4 px-6 rounded-2xl bg-[#800020] text-white font-bold text-sm tracking-wide hover:bg-[#600018] active:scale-98 transition-all shadow-md shadow-[#800020]/20 flex items-center justify-center gap-2 group"
            >
              <span>START ORDERING</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsChangeTableModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl text-[#5C574E] font-semibold text-xs hover:bg-[#F0EEE6] hover:text-[#1A1A1A] transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8A8475]" />
              <span>Not at Table {selectedTable}? Change Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Note */}
      <div className="max-w-md mx-auto w-full text-center text-xs text-[#8A8475] py-2">
        <span>Press Start Ordering to view burgers, sizzlers, pasta & shakes</span>
      </div>
    </div>
  );
};
