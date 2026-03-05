// ─── Product Catalog Types ───

export interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  image: string;
  description: string;
  category: string;
}

// ─── Cart & Product Types ───

export interface CartItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image: string;
}

export interface CartData {
  cartItems: CartItem[];
  shipping_fee: number;
  discount_applied: number;
}

// ─── Shipping Address Types ───

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
}

// ─── Checkout Context Types ───

export interface CheckoutState {
  cart: CartData | null;
  shippingAddress: ShippingAddress | null;
  orderPlaced: boolean;
}

export interface CheckoutContextType extends CheckoutState {
  setCart: (cart: CartData) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  placeOrder: () => void;
  resetCheckout: () => void;
  getSubtotal: () => number;
  getGrandTotal: () => number;
  getCartCount: () => number;
}
