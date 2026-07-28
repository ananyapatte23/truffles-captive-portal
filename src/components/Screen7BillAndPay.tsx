import React from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import {
  Receipt,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  Users,
  Utensils,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const Screen7BillAndPay: React.FC = () => {
  const {
    activeOrder,
    orders,
    selectedTable,
    branchName,
    paymentMethod,
    setPaymentMethod,
    paymentSuccess,
    setPaymentSuccess,
    staffRequestSent,
    setStaffRequestSent,
    setIsSplitBillOpen,
    setCurrentScreen,
    addToast,
  } = useApp();

  // Combine items across all active orders or use active order
  const allOrders = orders.length > 0 ? orders : activeOrder ? [activeOrder] : [];

  // Fallback demo order items if no order exists yet
  const displayOrder = allOrders.length > 0 ? allOrders[allOrders.length - 1] : null;

  const subtotal = allOrders.reduce((sum, o) => sum + o.subtotal, 0) || 1010;
  const cgst = Math.round((subtotal * 0.025) * 100) / 100 || 25.25;
  const sgst = Math.round((subtotal * 0.025) * 100) / 100 || 25.25;
  const serviceCharge = Math.round((subtotal * 0.05) * 100) / 100 || 50.50;
  const discount = 100;
  const totalAmount = Math.max(0, Math.round((subtotal + cgst + sgst + serviceCharge - discount) * 100) / 100) || 1011;

  const handleSimulatePaymentSuccess = () => {
    setPaymentSuccess(true);
    addToast('✓ Payment Successful! Thank you for dining with Truffles.', 'success');
  };

  const handleStaffRequest = (type: 'card' | 'cash') => {
    const msg = type === 'card' ? '✓ Request sent! Staff is bringing card machine to Table ' + selectedTable : '✓ Staff notified! Bill & assistance requested for Table ' + selectedTable;
    setStaffRequestSent(msg);
    addToast(msg, 'success');
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6">
      {/* Header Info Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E2D9] shadow-sm space-y-4 text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#800020]" />

        <div className="inline-flex items-center gap-1.5 bg-[#800020]/10 text-[#800020] px-3 py-1 rounded-full text-xs font-bold border border-[#800020]/20">
          <Receipt className="w-3.5 h-3.5" />
          <span>Dine-In Itemized Invoice</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            TRUFFLES
          </h1>
          <p className="text-xs font-semibold text-[#8A8475] mt-1">
            Table {selectedTable} • {branchName} • Order {displayOrder ? displayOrder.id : '#T1042'}
          </p>
        </div>

        {/* Split Bill Trigger */}
        <button
          onClick={() => setIsSplitBillOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F3EF] hover:bg-[#E5E2D9] text-[#2D2D2D] border border-[#E5E2D9] rounded-2xl text-xs font-bold transition-all shadow-2xs"
        >
          <Users className="w-4 h-4 text-[#800020]" />
          <span>SPLIT BILL WITH FRIENDS</span>
        </button>
      </div>

      {/* Itemized Bill Details */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E2D9] shadow-sm space-y-5">
        <h2 className="text-xs font-black uppercase tracking-wider text-[#8A8475] flex items-center justify-between">
          <span>Order Summary</span>
          <Utensils className="w-4 h-4 text-[#8A8475]" />
        </h2>

        {/* Items List */}
        <div className="divide-y divide-[#F0EEE6]">
          {allOrders.length > 0 ? (
            allOrders.flatMap((ord) =>
              ord.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1A1A]">{item.menuItem.name} × {item.quantity}</span>
                  </div>
                  <span className="font-bold text-[#1A1A1A]">₹{item.totalPrice}</span>
                </div>
              ))
            )
          ) : (
            <>
              <div className="py-2.5 flex items-center justify-between text-xs">
                <span>Classic Truffles Burger × 2</span>
                <span className="font-bold text-[#1A1A1A]">₹590</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-xs">
                <span>Loaded Fries × 1</span>
                <span className="font-bold text-[#1A1A1A]">₹225</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-xs">
                <span>Chocolate Brownie Sundae × 1</span>
                <span className="font-bold text-[#1A1A1A]">₹195</span>
              </div>
            </>
          )}
        </div>

        {/* Financial Breakdown */}
        <div className="bg-[#F5F3EF] p-4 rounded-2xl border border-[#E5E2D9] space-y-2 text-xs">
          <div className="flex justify-between text-[#8A8475]">
            <span>Subtotal</span>
            <span className="font-medium text-[#2D2D2D]">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#8A8475]">
            <span>CGST (2.5%)</span>
            <span className="font-medium text-[#2D2D2D]">₹{cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#8A8475]">
            <span>SGST (2.5%)</span>
            <span className="font-medium text-[#2D2D2D]">₹{sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#8A8475]">
            <span>Service Charge (5%)</span>
            <span className="font-medium text-[#2D2D2D]">₹{serviceCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#4CAF50] font-bold">
            <span>Special Truffles Discount</span>
            <span>− ₹{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#1A1A1A] font-black text-lg pt-2 border-t border-[#E5E2D9]">
            <span>TOTAL BILL</span>
            <span className="text-[#800020]">₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selector or Success State */}
      {!paymentSuccess ? (
        <div className="bg-white p-6 rounded-3xl border border-[#E5E2D9] shadow-sm space-y-5">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#8A8475]">
            How would you like to pay?
          </h2>

          {/* Payment Method Tabs */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setPaymentMethod('upi');
                setStaffRequestSent(null);
              }}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'upi'
                  ? 'bg-[#800020] text-white border-[#800020] shadow-md'
                  : 'bg-[#FAF9F6] text-[#2D2D2D] border-[#E5E2D9] hover:bg-[#F0EEE6]'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span>UPI</span>
            </button>

            <button
              onClick={() => {
                setPaymentMethod('card');
                setStaffRequestSent(null);
              }}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'card'
                  ? 'bg-[#800020] text-white border-[#800020] shadow-md'
                  : 'bg-[#FAF9F6] text-[#2D2D2D] border-[#E5E2D9] hover:bg-[#F0EEE6]'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>CARD</span>
            </button>

            <button
              onClick={() => {
                setPaymentMethod('cash');
                setStaffRequestSent(null);
              }}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'cash'
                  ? 'bg-[#800020] text-white border-[#800020] shadow-md'
                  : 'bg-[#FAF9F6] text-[#2D2D2D] border-[#E5E2D9] hover:bg-[#F0EEE6]'
              }`}
            >
              <Banknote className="w-5 h-5" />
              <span>CASH</span>
            </button>
          </div>

          {/* Method Specific Display */}
          <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#E5E2D9] text-center space-y-4">
            {paymentMethod === 'upi' && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs font-bold text-[#2D2D2D]">Scan QR Code to pay with any UPI App</p>

                {/* Styled Demo QR Code graphic */}
                <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E2D9] shadow-sm flex flex-col items-center gap-2">
                  <div className="w-40 h-40 bg-[#1A1A1A] p-2 rounded-xl flex items-center justify-center relative">
                    <QrCode className="w-full h-full text-white" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-1 rounded-md text-[10px] font-black text-[#800020] border border-[#800020]/30 shadow-sm">
                        TRUFFLES
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-black text-[#800020]">₹{totalAmount.toLocaleString()}</span>
                  <span className="text-[10px] text-[#8A8475]">GPay • PhonePe • Paytm • BHIM</span>
                </div>

                <button
                  onClick={handleSimulatePaymentSuccess}
                  className="w-full py-3.5 rounded-xl bg-[#4CAF50] hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I'VE PAID</span>
                </button>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <p className="text-xs text-[#8A8475] leading-relaxed">
                  Please pay at the counter or request the card machine at Table {selectedTable}.
                </p>

                {staffRequestSent ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                    {staffRequestSent}
                  </div>
                ) : (
                  <button
                    onClick={() => handleStaffRequest('card')}
                    className="w-full py-3.5 rounded-xl bg-[#800020] text-white font-bold text-xs hover:bg-[#600018] shadow-md transition-all"
                  >
                    REQUEST CARD MACHINE
                  </button>
                )}

                <button
                  onClick={handleSimulatePaymentSuccess}
                  className="w-full py-2.5 rounded-xl bg-[#F0EEE6] hover:bg-[#E5E2D9] text-[#2D2D2D] font-bold text-xs transition-all mt-2"
                >
                  Simulate Card Payment Completed
                </button>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="space-y-3">
                <p className="text-xs text-[#8A8475] leading-relaxed">
                  Pay with cash at the counter or request waiter assistance for Table {selectedTable}.
                </p>

                {staffRequestSent ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                    {staffRequestSent}
                  </div>
                ) : (
                  <button
                    onClick={() => handleStaffRequest('cash')}
                    className="w-full py-3.5 rounded-xl bg-[#800020] text-white font-bold text-xs hover:bg-[#600018] shadow-md transition-all"
                  >
                    REQUEST BILL
                  </button>
                )}

                <button
                  onClick={handleSimulatePaymentSuccess}
                  className="w-full py-2.5 rounded-xl bg-[#F0EEE6] hover:bg-[#E5E2D9] text-[#2D2D2D] font-bold text-xs transition-all mt-2"
                >
                  Simulate Cash Payment Received
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Payment Success Banner */
        <div className="bg-[#FAF9F6] border-2 border-[#4CAF50] p-6 rounded-3xl text-center space-y-4 shadow-lg animate-fade-in">
          <div className="w-16 h-16 bg-[#4CAF50] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-[#1A1A1A]">✓ Payment Successful</h2>

          <p className="text-xs text-[#8A8475] max-w-xs mx-auto">
            Thank you for dining with us at Truffles Table {selectedTable}. Digital receipt generated.
          </p>

          <button
            onClick={() => setCurrentScreen('feedback')}
            className="w-full py-4 rounded-2xl bg-[#800020] hover:bg-[#600018] text-white font-bold text-sm tracking-wide shadow-md shadow-[#800020]/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>RATE YOUR EXPERIENCE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Security badge */}
      <div className="text-center text-xs text-stone-400 flex items-center justify-center gap-1.5 py-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Encrypted Restaurant Payment Interface</span>
      </div>
    </div>
  );
};
