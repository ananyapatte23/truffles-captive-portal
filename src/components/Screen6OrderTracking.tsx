import React from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import {
  CheckCircle2,
  Clock,
  Utensils,
  PlusCircle,
  Receipt,
  FastForward,
  Sparkles,
  ChefHat,
  BellRing,
  Smile,
} from 'lucide-react';

export const Screen6OrderTracking: React.FC = () => {
  const {
    activeOrder,
    orders,
    selectedTable,
    branchName,
    setCurrentScreen,
    advanceOrderStatus,
  } = useApp();

  const currentOrder = activeOrder || (orders.length > 0 ? orders[orders.length - 1] : null);

  if (!currentOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#8B1D24] flex items-center justify-center">
          <Utensils className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">No active orders</h2>
        <p className="text-xs text-stone-500 max-w-xs">
          You haven't placed an order yet for Table {selectedTable}. Browse the menu to order!
        </p>
        <button
          onClick={() => setCurrentScreen('menu')}
          className="py-3 px-6 bg-[#8B1D24] text-white rounded-2xl font-bold text-xs hover:bg-[#72171d] shadow-md"
        >
          EXPLORE MENU
        </button>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; subtext: string; icon: React.ReactNode }[] = [
    {
      key: 'confirmed',
      label: 'CONFIRMED',
      subtext: 'Your order has reached the kitchen.',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      key: 'preparing',
      label: 'PREPARING',
      subtext: 'Your food is being prepared by our chefs.',
      icon: <ChefHat className="w-5 h-5" />,
    },
    {
      key: 'ready',
      label: 'READY',
      subtext: 'Your order is ready to be served.',
      icon: <BellRing className="w-5 h-5" />,
    },
    {
      key: 'served',
      label: 'SERVED',
      subtext: 'Enjoy your meal at Truffles!',
      icon: <Smile className="w-5 h-5" />,
    },
  ];

  const statusOrder: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'served'];
  const currentIndex = statusOrder.indexOf(currentOrder.status);

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6">
      {/* Header Info Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E2D9] shadow-sm space-y-4 text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#800020]" />

        <div className="inline-flex items-center gap-1.5 bg-[#800020]/10 text-[#800020] px-3 py-1 rounded-full text-xs font-bold border border-[#800020]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
          <span>Live Kitchen Status</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            Order {currentOrder.id}
          </h1>
          <p className="text-xs font-semibold text-[#8A8475] mt-1">
            Table {selectedTable} • {branchName} • Placed at {currentOrder.placedAt}
          </p>
        </div>

        {/* Estimated Prep Time Box */}
        <div className="bg-[#F5F3EF] p-4 rounded-2xl border border-[#E5E2D9] flex items-center justify-center gap-3 max-w-xs mx-auto">
          <Clock className="w-5 h-5 text-[#800020] animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-[#8A8475] block">
              Estimated Prep Time
            </span>
            <span className="text-lg font-black text-[#1A1A1A]">{currentOrder.estimatedTime}</span>
          </div>
        </div>

        {/* Stakeholder Demo Fast-Forward Button */}
        <div className="pt-2 border-t border-[#F0EEE6]">
          <button
            onClick={() => advanceOrderStatus(currentOrder.id)}
            disabled={currentOrder.status === 'served'}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2D2D2D] bg-[#F0EEE6] hover:bg-[#E5E2D9] border border-[#E5E2D9] px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            title="Demo control to simulate kitchen status progression"
          >
            <FastForward className="w-3.5 h-3.5 text-[#800020]" />
            <span>Simulate Kitchen Next Step ({currentOrder.status.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Visual Timeline Component */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E2D9] shadow-sm space-y-6">
        <h2 className="text-xs font-black uppercase tracking-wider text-[#8A8475]">
          Order Progress Timeline
        </h2>

        <div className="space-y-6 relative pl-2">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="flex items-start gap-4 relative">
                {/* Connecting Line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 -bottom-6 w-0.5 transition-colors ${
                      idx < currentIndex ? 'bg-[#800020]' : 'bg-[#E5E2D9]'
                    }`}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-[#800020] text-white shadow-md ring-4 ring-[#800020]/20 scale-110'
                      : isCompleted
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-[#FAF9F6] text-[#8A8475] border border-[#E5E2D9]'
                  }`}
                >
                  {step.icon}
                </div>

                {/* Step Text */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-[#800020]'
                          : isCompleted
                          ? 'text-[#4CAF50]'
                          : 'text-[#8A8475]'
                      }`}
                    >
                      {step.label}
                    </h3>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase bg-[#800020]/10 text-[#800020] px-2 py-0.2 rounded-full animate-pulse border border-[#800020]/20">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8A8475] mt-0.5">{step.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ordered Items Summary */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E2D9] shadow-2xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#8A8475]">
          Items in this order
        </h3>

        <div className="divide-y divide-[#F0EEE6]">
          {currentOrder.items.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2D2D2D] bg-[#F5F3EF] border border-[#E5E2D9] px-2 py-1 rounded">
                  {item.quantity}x
                </span>
                <div>
                  <span className="font-bold text-[#1A1A1A]">{item.menuItem.name}</span>
                  {item.selectedCustomizations.length > 0 && (
                    <div className="text-[11px] text-[#8A8475]">
                      {item.selectedCustomizations.map((c) => c.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <span className="font-bold text-[#1A1A1A]">₹{item.totalPrice}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Bottom CTAs */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E2D9] p-4 shadow-xl z-20">
        <div className="max-w-2xl mx-auto flex gap-3">
          {/* Order More Button */}
          <button
            onClick={() => setCurrentScreen('menu')}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#F5F3EF] hover:bg-[#E5E2D9] text-[#2D2D2D] font-bold text-xs tracking-wide transition-all border border-[#E5E2D9] flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#800020]" />
            <span>ORDER MORE</span>
          </button>

          {/* View Bill Button */}
          <button
            onClick={() => setCurrentScreen('bill')}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#800020] hover:bg-[#600018] text-white font-bold text-xs tracking-wide shadow-md shadow-[#800020]/20 transition-all flex items-center justify-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            <span>VIEW BILL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
