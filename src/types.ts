export type Screen =
  | 'captive'
  | 'landing'
  | 'menu'
  | 'tracking'
  | 'bill'
  | 'feedback';

export type FoodTypeFilter = 'all' | 'veg' | 'non-veg';
export type SortOption = 'popular' | 'price-low' | 'price-high' | 'rating';

export interface CustomizationOptionItem {
  id: string;
  name: string;
  price: number; // 0 for free options
}

export interface CustomizationOptionGroup {
  id: string;
  title: string;
  type: 'checkbox' | 'radio';
  items: CustomizationOptionItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isVeg: boolean;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  image: string;
  customizationGroups?: CustomizationOptionGroup[];
}

export interface SelectedCustomization {
  groupId: string;
  itemId: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // Unique cart item ID
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  specialInstructions: string;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'served';

export interface Order {
  id: string;
  tableNumber: number;
  branchName: string;
  items: CartItem[];
  subtotal: number;
  taxes: number; // GST
  serviceCharge: number;
  discount: number;
  total: number;
  status: OrderStatus;
  placedAt: string;
  estimatedTime: string;
}

export type PaymentMethod = 'upi' | 'card' | 'cash';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info';
}

export interface FeedbackData {
  rating: number;
  comment: string;
  photoUrl?: string;
  submittedAt?: string;
}
