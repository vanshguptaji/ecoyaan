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
  id: string;
  label: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  pinCode: string;
  city: string;
  state: string;
}

// ─── Checkout Context Types ───

export interface CheckoutState {
  cart: CartData | null;
  savedAddresses: ShippingAddress[];
  selectedAddressId: string | null;
  orderPlaced: boolean;
}

export interface CheckoutContextType extends CheckoutState {
  setCart: (cart: CartData) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  addAddress: (address: ShippingAddress) => void;
  updateAddress: (address: ShippingAddress) => void;
  deleteAddress: (addressId: string) => void;
  selectAddress: (addressId: string) => void;
  getSelectedAddress: () => ShippingAddress | null;
  placeOrder: () => void;
  resetCheckout: () => void;
  getSubtotal: () => number;
  getGrandTotal: () => number;
  getCartCount: () => number;
}
