import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Utensils,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const Screen5CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartTaxes,
    cartGrandTotal,
    selectedTable,
    placeOrder,
    setCurrentScreen,
  } = useApp();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!isCartOpen) return null;

  const handleConfirmOrder = () => {
    setShowConfirmModal(false);
    placeOrder();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      {/* Drawer Container */}
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col relative animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E2D9] bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#800020]/10 text-[#800020] rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A]">Your Order</h2>
              <div className="flex items-center gap-1.5 text-xs text-[#8A8475] font-semibold">
                <Utensils className="w-3.5 h-3.5 text-[#800020]" />
                <span>Ordering for Table {selectedTable}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#8A8475] hover:text-[#1A1A1A] rounded-full hover:bg-[#F0EEE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF9F6]">
          {cart.length > 0 ? (
            cart.map((cartItem) => (
              <div
                key={cartItem.id}
                className="bg-white p-3.5 rounded-2xl border border-[#E5E2D9] space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded border bg-white ${
                          cartItem.menuItem.isVeg ? 'border-[#4CAF50]' : 'border-red-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cartItem.menuItem.isVeg ? 'bg-[#4CAF50]' : 'bg-red-600'
                          }`}
                        />
                      </span>
                      <h3 className="font-bold text-[#1A1A1A] text-sm">{cartItem.menuItem.name}</h3>
                    </div>

                    {/* Selected Customizations list */}
                    {cartItem.selectedCustomizations.length > 0 && (
                      <p className="text-xs text-[#8A8475] font-medium pl-5 mb-1">
                        {cartItem.selectedCustomizations.map((c) => c.name).join(' • ')}
                      </p>
                    )}

                    {/* Special Notes */}
                    {cartItem.specialInstructions && (
                      <p className="text-[11px] text-[#800020] italic pl-5">
                        Note: "{cartItem.specialInstructions}"
                      </p>
                    )}
                  </div>

                  <span className="font-black text-[#1A1A1A] text-sm shrink-0">
                    ₹{cartItem.totalPrice}
                  </span>
                </div>

                {/* Controls Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-[#F0EEE6]">
                  <button
                    onClick={() => removeFromCart(cartItem.id)}
                    className="flex items-center gap-1 text-xs text-[#8A8475] hover:text-red-700 font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>

                  <div className="flex items-center gap-2 bg-[#F5F3EF] rounded-xl border border-[#E5E2D9] p-1">
                    <button
                      onClick={() => updateCartQuantity(cartItem.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white text-[#2D2D2D] font-bold flex items-center justify-center hover:bg-[#FAF9F6] border border-[#E5E2D9] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-[#1A1A1A] text-xs">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(cartItem.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white text-[#2D2D2D] font-bold flex items-center justify-center hover:bg-[#FAF9F6] border border-[#E5E2D9] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty Cart State */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
              <div className="w-20 h-20 rounded-full bg-[#800020]/10 text-[#800020] flex items-center justify-center">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">Your cart is empty</h3>
              <p className="text-xs text-[#8A8475] max-w-xs leading-relaxed">
                Looks like you haven't picked your favourites yet. Explore our Truffles burgers, pasta, and thick shakes!
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentScreen('menu');
                }}
                className="mt-2 py-3 px-6 bg-[#800020] text-white rounded-xl font-bold text-xs hover:bg-[#600018] transition-colors"
              >
                EXPLORE MENU
              </button>
            </div>
          )}
        </div>

        {/* Price Breakdown & Checkout Bar */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E5E2D9] bg-white space-y-4 shadow-lg">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#8A8475]">
                <span>Subtotal</span>
                <span className="font-medium text-[#2D2D2D]">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-[#8A8475]">
                <span>GST (5%)</span>
                <span className="font-medium text-[#2D2D2D]">₹{cartTaxes}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A] font-black text-base pt-2 border-t border-[#F0EEE6]">
                <span>Total Bill</span>
                <span className="text-[#800020]">₹{cartGrandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full py-2 text-center text-xs font-semibold text-[#800020] hover:bg-[#800020]/5 rounded-xl border border-[#800020] transition-colors"
            >
              + ADD MORE ITEMS
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-4 rounded-2xl bg-[#800020] text-white font-bold text-sm tracking-wide hover:bg-[#600018] transition-all shadow-md shadow-[#800020]/20 active:scale-98 flex items-center justify-between px-6"
            >
              <span>PLACE ORDER</span>
              <div className="flex items-center gap-1.5">
                <span>₹{cartGrandTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-100 flex flex-col gap-4 text-center">
            <div className="w-14 h-14 bg-red-50 text-[#8B1D24] rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-stone-900">Place this order?</h3>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-1 text-xs">
              <div className="font-bold text-[#8B1D24]">Table {selectedTable}</div>
              <div className="text-stone-600">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} items • ₹{cartGrandTotal} Total
              </div>
            </div>

            <p className="text-xs text-stone-500">
              Your order will be sent directly to the kitchen for Table {selectedTable}.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50"
              >
                GO BACK
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 py-3 rounded-xl bg-[#8B1D24] text-white font-bold text-xs hover:bg-[#72171d] flex items-center justify-center gap-1 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRM ORDER</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
