import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Screen,
  MenuItem,
  CartItem,
  SelectedCustomization,
  Order,
  OrderStatus,
  PaymentMethod,
  ToastMessage,
  FeedbackData,
} from '../types';

export interface RegisteredUser {
  fullName: string;
  phoneNumber: string;
  email?: string;
}

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedTable: number;
  setSelectedTable: (table: number) => void;
  branchName: string;
  isWifiConnected: boolean;
  setIsWifiConnected: (connected: boolean) => void;
  hasAcceptedTerms: boolean;
  setHasAcceptedTerms: (accepted: boolean) => void;
  userInfo: { fullName: string; phoneNumber: string; email: string; optInMarketing: boolean };
  setUserInfo: (info: { fullName: string; phoneNumber: string; email: string; optInMarketing: boolean }) => void;
  
  // Registered users database
  registeredUsers: RegisteredUser[];
  registerUser: (user: RegisteredUser) => void;
  findRegisteredUserByPhone: (phone: string) => RegisteredUser | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity: number,
    customizations: SelectedCustomization[],
    specialInstructions: string
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotalItemsCount: number;
  cartSubtotal: number;
  cartTaxes: number;
  cartGrandTotal: number;
  
  // Modal states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedItemForModal: MenuItem | null;
  setSelectedItemForModal: (item: MenuItem | null) => void;
  isSplitBillOpen: boolean;
  setIsSplitBillOpen: (open: boolean) => void;
  
  // Orders
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: () => void;
  advanceOrderStatus: (orderId: string) => void;
  
  // Payment
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  paymentSuccess: boolean;
  setPaymentSuccess: (success: boolean) => void;
  staffRequestSent: string | null;
  setStaffRequestSent: (msg: string | null) => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (msg: string, type?: 'success' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Feedback
  feedback: FeedbackData;
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackData>>;
  isFeedbackSubmitted: boolean;
  setIsFeedbackSubmitted: (submitted: boolean) => void;

  // Change Table Modal
  isChangeTableModalOpen: boolean;
  setIsChangeTableModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('captive');
  const [selectedTable, setSelectedTable] = useState<number>(7);
  const [branchName] = useState<string>('Truffles • Koramangala');
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(true);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    try {
      const saved = localStorage.getItem('truffles_registered_users');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Seed initial demo registered user (e.g. Anu: 6364060137)
    return [
      { fullName: 'Anu', phoneNumber: '6364060137', email: 'anu@example.com' },
      { fullName: 'Priya Sharma', phoneNumber: '9876543210', email: 'priya@example.com' },
    ];
  });

  const registerUser = useCallback((user: RegisteredUser) => {
    setRegisteredUsers((prev) => {
      const existingIdx = prev.findIndex((u) => u.phoneNumber === user.phoneNumber);
      let updated: RegisteredUser[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = user;
      } else {
        updated = [...prev, user];
      }
      try {
        localStorage.setItem('truffles_registered_users', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const findRegisteredUserByPhone = useCallback((phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return registeredUsers.find((u) => u.phoneNumber === cleaned);
  }, [registeredUsers]);

  const [userInfo, setUserInfoState] = useState<{ fullName: string; phoneNumber: string; email: string; optInMarketing: boolean }>(() => {
    try {
      const saved = localStorage.getItem('truffles_user_info');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      fullName: '',
      phoneNumber: '',
      email: '',
      optInMarketing: true,
    };
  });

  const setUserInfo = (info: { fullName: string; phoneNumber: string; email: string; optInMarketing: boolean }) => {
    setUserInfoState(info);
    try {
      localStorage.setItem('truffles_user_info', JSON.stringify(info));
    } catch {
      // ignore
    }

    if (info.phoneNumber && info.fullName) {
      registerUser({
        fullName: info.fullName,
        phoneNumber: info.phoneNumber,
        email: info.email,
      });
    }
  };
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState<boolean>(false);
  const [isChangeTableModalOpen, setIsChangeTableModalOpen] = useState<boolean>(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>('upi');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [staffRequestSent, setStaffRequestSent] = useState<string | null>(null);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 5,
    comment: '',
    photoUrl: undefined,
  });
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState<boolean>(false);

  // Cart calculations
  const cartTotalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartTaxes = Math.round(cartSubtotal * 0.05); // 5% GST
  const cartGrandTotal = cartSubtotal + cartTaxes;

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToasts((prev) => {
      if (prev.some((t) => t.message === message)) {
        return prev;
      }
      const id = Date.now().toString() + Math.random().toString().slice(2, 5);
      setTimeout(() => {
        removeToast(id);
      }, 3200);
      return [...prev, { id, message, type }];
    });
  }, [removeToast]);

  const addToCart = (
    menuItem: MenuItem,
    quantity: number,
    selectedCustomizations: SelectedCustomization[],
    specialInstructions: string
  ) => {
    const customizationTotal = selectedCustomizations.reduce((acc, c) => acc + c.price, 0);
    const unitPrice = menuItem.price + customizationTotal;
    const totalPrice = unitPrice * quantity;

    // Check if identical item + customizations exist
    const custKey = selectedCustomizations
      .map((c) => c.itemId)
      .sort()
      .join(',');
    
    const existingIndex = cart.findIndex((cItem) => {
      const existingCustKey = cItem.selectedCustomizations
        .map((c) => c.itemId)
        .sort()
        .join(',');
      return (
        cItem.menuItem.id === menuItem.id &&
        existingCustKey === custKey &&
        cItem.specialInstructions === specialInstructions
      );
    });

    if (existingIndex > -1) {
      setCart((prev) => {
        const next = [...prev];
        const updatedQuantity = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: updatedQuantity,
          totalPrice: next[existingIndex].unitPrice * updatedQuantity,
        };
        return next;
      });
    } else {
      const newCartItem: CartItem = {
        id: 'cart-' + Date.now() + '-' + Math.random().toString().slice(2, 6),
        menuItem,
        quantity,
        selectedCustomizations,
        specialInstructions,
        unitPrice,
        totalPrice,
      };
      setCart((prev) => [...prev, newCartItem]);
    }

    addToast(`Added ${menuItem.name} to your order`);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Place order logic
  const activeOrder = orders.length > 0 ? orders[orders.length - 1] : null;

  const placeOrder = () => {
    if (cart.length === 0) return;

    const subtotal = cartSubtotal;
    const taxes = cartTaxes;
    const serviceCharge = Math.round(subtotal * 0.05); // 5% service charge
    const discount = 50; // Promo discount
    const total = Math.max(0, subtotal + taxes + serviceCharge - discount);

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `#T${orderNum}`,
      tableNumber: selectedTable,
      branchName,
      items: [...cart],
      subtotal,
      taxes,
      serviceCharge,
      discount,
      total,
      status: 'confirmed',
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedTime: '15–20 min',
    };

    setOrders((prev) => [...prev, newOrder]);
    clearCart();
    setIsCartOpen(false);
    setCurrentScreen('tracking');
    addToast('✓ Order placed! Kitchen notified.', 'success');
  };

  // Simulated status progression for demo
  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const statuses: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'served'];
          const currentIndex = statuses.indexOf(ord.status);
          if (currentIndex < statuses.length - 1) {
            const nextStatus = statuses[currentIndex + 1];
            return { ...ord, status: nextStatus };
          }
        }
        return ord;
      })
    );
  };

  // Automatically simulate status transition for demo realistic feel
  useEffect(() => {
    if (!activeOrder) return;
    if (activeOrder.status === 'confirmed') {
      const timer = setTimeout(() => {
        advanceOrderStatus(activeOrder.id);
        addToast('Kitchen update: Order is now PREPARING 🍳', 'info');
      }, 7000);
      return () => clearTimeout(timer);
    } else if (activeOrder.status === 'preparing') {
      const timer = setTimeout(() => {
        advanceOrderStatus(activeOrder.id);
        addToast('Kitchen update: Order is READY to serve! 🔔', 'success');
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [activeOrder?.status, activeOrder?.id]);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedTable,
        setSelectedTable,
        branchName,
        isWifiConnected,
        setIsWifiConnected,
        hasAcceptedTerms,
        setHasAcceptedTerms,
        userInfo,
        setUserInfo,
        registeredUsers,
        registerUser,
        findRegisteredUserByPhone,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalItemsCount,
        cartSubtotal,
        cartTaxes,
        cartGrandTotal,
        isCartOpen,
        setIsCartOpen,
        selectedItemForModal,
        setSelectedItemForModal,
        isSplitBillOpen,
        setIsSplitBillOpen,
        orders,
        activeOrder,
        placeOrder,
        advanceOrderStatus,
        paymentMethod,
        setPaymentMethod,
        paymentSuccess,
        setPaymentSuccess,
        staffRequestSent,
        setStaffRequestSent,
        toasts,
        addToast,
        removeToast,
        feedback,
        setFeedback,
        isFeedbackSubmitted,
        setIsFeedbackSubmitted,
        isChangeTableModalOpen,
        setIsChangeTableModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
