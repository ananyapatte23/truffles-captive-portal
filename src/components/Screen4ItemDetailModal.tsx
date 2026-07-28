import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SelectedCustomization } from '../types';
import { X, Star, Plus, Minus, MessageSquare, Check, Sparkles } from 'lucide-react';

export const Screen4ItemDetailModal: React.FC = () => {
  const { selectedItemForModal, setSelectedItemForModal, addToCart } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomization[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Reset local customization state when modal item changes
  useEffect(() => {
    setQuantity(1);
    setSelectedCustomizations([]);
    setSpecialInstructions('');
  }, [selectedItemForModal?.id]);

  if (!selectedItemForModal) return null;

  const item = selectedItemForModal;

  const handleCustomizationToggle = (
    groupId: string,
    itemId: string,
    name: string,
    price: number,
    type: 'checkbox' | 'radio'
  ) => {
    setSelectedCustomizations((prev) => {
      if (type === 'radio') {
        const filtered = prev.filter((c) => c.groupId !== groupId);
        return [...filtered, { groupId, itemId, name, price }];
      } else {
        const exists = prev.some((c) => c.groupId === groupId && c.itemId === itemId);
        if (exists) {
          return prev.filter((c) => !(c.groupId === groupId && c.itemId === itemId));
        } else {
          return [...prev, { groupId, itemId, name, price }];
        }
      }
    });
  };

  const customizationTotal = selectedCustomizations.reduce((sum, c) => sum + c.price, 0);
  const unitPrice = item.price + customizationTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedCustomizations, specialInstructions);
    setSelectedItemForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/65 backdrop-blur-xs animate-fade-in">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200/80 max-h-[90vh] flex flex-col relative overflow-hidden animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setSelectedItemForModal(null)}
          className="absolute top-3 right-3 z-20 p-2 bg-stone-900/60 hover:bg-stone-900/80 text-white rounded-full transition-all backdrop-blur-md shadow-md"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pb-24">
          {/* Dish Hero Image */}
          <div className="relative h-56 sm:h-64 w-full bg-stone-100 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />

            {/* Floating Badges */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Veg / Non-Veg Tag */}
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded border-2 bg-white ${
                    item.isVeg ? 'border-emerald-600' : 'border-red-600'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                  />
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  {item.isVeg ? 'Vegetarian' : 'Non-Veg'}
                </span>
              </div>

              {item.isBestSeller && (
                <span className="bg-amber-400 text-stone-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Best Seller
                </span>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-5 sm:p-6 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-3 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">{item.name}</h2>
                <span className="text-xl font-black text-[#800020] shrink-0">₹{item.price}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs text-[#8A8475] mb-3">
                <div className="flex items-center gap-1 bg-[#FAF9F6] text-[#2D2D2D] px-2 py-0.5 rounded font-bold border border-[#E5E2D9]">
                  <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                  <span>{item.rating}</span>
                </div>
                <span>({item.reviewCount} customer reviews)</span>
              </div>

              <p className="text-sm text-[#8A8475] leading-relaxed">{item.description}</p>
            </div>

            {/* Customization Options */}
            {item.customizationGroups && item.customizationGroups.length > 0 && (
              <div className="space-y-5 border-t border-[#E5E2D9] pt-5">
                {item.customizationGroups.map((group) => (
                  <div key={group.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
                        {group.title}
                      </h3>
                      <span className="text-[11px] text-[#8A8475]">
                        {group.type === 'radio' ? 'Select 1 option' : 'Optional'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.items.map((opt) => {
                        const isSelected = selectedCustomizations.some(
                          (c) => c.groupId === group.id && c.itemId === opt.id
                        );
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#800020]/10 border-[#800020] text-[#1A1A1A] shadow-2xs'
                                : 'bg-[#FAF9F6] border-[#E5E2D9] hover:bg-[#F0EEE6] text-[#2D2D2D]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 flex items-center justify-center border transition-colors ${
                                  group.type === 'radio' ? 'rounded-full' : 'rounded'
                                } ${
                                  isSelected
                                    ? 'bg-[#800020] border-[#800020] text-white'
                                    : 'border-[#E5E2D9] bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <span className="text-sm font-semibold">{opt.name}</span>
                            </div>

                            <span className="text-xs font-bold text-[#8A8475]">
                              {opt.price > 0 ? `+ ₹${opt.price}` : 'Free'}
                            </span>

                            <input
                              type={group.type}
                              name={group.id}
                              checked={isSelected}
                              onChange={() =>
                                handleCustomizationToggle(
                                  group.id,
                                  opt.id,
                                  opt.name,
                                  opt.price,
                                  group.type
                                )
                              }
                              className="sr-only"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Special Instructions */}
            <div className="border-t border-[#E5E2D9] pt-5 space-y-2">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
                <MessageSquare className="w-4 h-4 text-[#8A8475]" />
                <span>Special Instructions</span>
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Anything we should know? E.g. less spicy, extra crispy, no onions..."
                rows={2}
                className="w-full p-3 rounded-xl border border-[#E5E2D9] bg-[#FAF9F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:bg-white transition-all text-[#2D2D2D] placeholder:text-[#8A8475]"
              />
            </div>
          </div>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E2D9] p-4 flex items-center gap-3 shadow-lg">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#F5F3EF] rounded-xl border border-[#E5E2D9] p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-lg bg-white text-[#2D2D2D] font-bold flex items-center justify-center hover:bg-[#FAF9F6] disabled:opacity-40 transition-colors shadow-2xs border border-[#E5E2D9]"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold text-[#1A1A1A] text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-lg bg-white text-[#2D2D2D] font-bold flex items-center justify-center hover:bg-[#FAF9F6] transition-colors shadow-2xs border border-[#E5E2D9]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-5 rounded-xl bg-[#800020] hover:bg-[#600018] text-white font-bold text-sm tracking-wide shadow-md shadow-[#800020]/20 active:scale-98 transition-all flex items-center justify-between"
          >
            <span>ADD TO CART</span>
            <span className="font-black">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
