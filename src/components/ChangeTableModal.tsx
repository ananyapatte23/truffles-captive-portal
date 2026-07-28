import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Utensils, Check } from 'lucide-react';

export const ChangeTableModal: React.FC = () => {
  const {
    isChangeTableModalOpen,
    setIsChangeTableModalOpen,
    selectedTable,
    setSelectedTable,
    addToast,
    branchName,
  } = useApp();

  const [tempTable, setTempTable] = useState<number>(selectedTable);

  if (!isChangeTableModalOpen) return null;

  const handleConfirm = () => {
    setSelectedTable(tempTable);
    setIsChangeTableModalOpen(false);
    addToast(`Table updated to Table ${tempTable}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E2D9] flex flex-col gap-5 relative">
        <button
          onClick={() => setIsChangeTableModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#8A8475] hover:text-[#1A1A1A] rounded-full hover:bg-[#F0EEE6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#800020]/10 text-[#800020] rounded-2xl border border-[#800020]/20">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">Select Your Table</h3>
            <p className="text-xs text-[#8A8475]">{branchName}</p>
          </div>
        </div>

        <p className="text-sm text-[#8A8475]">
          Where are you seated in the restaurant right now?
        </p>

        {/* Table Selector Grid 1 to 12 */}
        <div className="grid grid-cols-4 gap-2.5 my-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((tableNum) => {
            const isSelected = tempTable === tableNum;
            return (
              <button
                key={tableNum}
                onClick={() => setTempTable(tableNum)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-[#800020] text-white border-[#800020] shadow-md ring-2 ring-[#800020]/20'
                    : 'bg-[#FAF9F6] text-[#2D2D2D] border-[#E5E2D9] hover:bg-[#F0EEE6]'
                }`}
              >
                <span className="text-[10px] uppercase font-normal opacity-80">Table</span>
                <span className="text-base">{tableNum}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setIsChangeTableModalOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl border border-[#E5E2D9] text-[#2D2D2D] font-semibold hover:bg-[#FAF9F6] transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-[#800020] text-white font-bold hover:bg-[#600018] transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Table</span>
          </button>
        </div>
      </div>
    </div>
  );
};
