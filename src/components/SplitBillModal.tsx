import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Users, Calculator, Check } from 'lucide-react';

export const SplitBillModal: React.FC = () => {
  const { isSplitBillOpen, setIsSplitBillOpen, activeOrder, orders } = useApp();
  const [peopleCount, setPeopleCount] = useState<number>(2);

  if (!isSplitBillOpen) return null;

  // Total bill amount calculation from active or all orders
  const totalAmount = orders.length > 0
    ? orders.reduce((sum, o) => sum + o.total, 0)
    : (activeOrder ? activeOrder.total : 1011);

  const amountPerPerson = Math.ceil(totalAmount / Math.max(1, peopleCount));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E2D9] flex flex-col gap-5 relative">
        <button
          onClick={() => setIsSplitBillOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#8A8475] hover:text-[#1A1A1A] rounded-full hover:bg-[#F0EEE6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#800020]/10 text-[#800020] rounded-2xl border border-[#800020]/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">Split Bill</h3>
            <p className="text-xs text-[#8A8475]">Calculate share per diner</p>
          </div>
        </div>

        <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E2D9] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#8A8475] uppercase">Total Bill Amount</span>
          <span className="text-xl font-black text-[#1A1A1A]">₹{totalAmount.toLocaleString()}</span>
        </div>

        <div>
          <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider block mb-2">
            Number of Diners
          </label>
          <div className="flex items-center justify-between gap-3 bg-[#F5F3EF] p-2 rounded-xl border border-[#E5E2D9]">
            <button
              onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-lg bg-white border border-[#E5E2D9] text-[#2D2D2D] font-bold text-lg hover:bg-[#FAF9F6] transition-colors flex items-center justify-center shadow-xs"
            >
              −
            </button>
            <div className="flex items-center gap-2 font-bold text-[#1A1A1A] text-lg">
              <Users className="w-5 h-5 text-[#800020]" />
              <span>{peopleCount} {peopleCount === 1 ? 'person' : 'people'}</span>
            </div>
            <button
              onClick={() => setPeopleCount((p) => Math.min(10, p + 1))}
              className="w-10 h-10 rounded-lg bg-white border border-[#E5E2D9] text-[#2D2D2D] font-bold text-lg hover:bg-[#FAF9F6] transition-colors flex items-center justify-center shadow-xs"
            >
              +
            </button>
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="flex gap-2">
          {[2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setPeopleCount(num)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                peopleCount === num
                  ? 'bg-[#800020] text-white border-[#800020]'
                  : 'bg-[#FAF9F6] text-[#2D2D2D] border-[#E5E2D9] hover:bg-[#F0EEE6]'
              }`}
            >
              {num} Diners
            </button>
          ))}
        </div>

        {/* Share Result */}
        <div className="bg-[#FAF9F6] border border-[#E5E2D9] p-4 rounded-xl text-center flex flex-col gap-1">
          <span className="text-xs font-semibold text-[#8A8475]">Each Person Pays</span>
          <span className="text-2xl font-black text-[#800020]">₹{amountPerPerson.toLocaleString()}</span>
          <span className="text-[11px] text-[#8A8475]">
            Equal split among {peopleCount} people (incl. taxes)
          </span>
        </div>

        <button
          onClick={() => setIsSplitBillOpen(false)}
          className="w-full py-3 rounded-xl bg-[#800020] text-white font-bold hover:bg-[#600018] transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};
