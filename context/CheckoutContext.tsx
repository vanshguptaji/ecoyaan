"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import {
  CartData,
  Product,
  ShippingAddress,
  CheckoutState,
  CheckoutContextType,
} from "@/types";

const DEFAULT_SHIPPING_FEE = 50;
const CART_STORAGE_KEY = "ecoyaan_cart";
const ADDRESS_STORAGE_KEY = "ecoyaan_address";

// ─── localStorage helpers (safe for SSR) ───

function loadFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveToStorage<T>(key: string, value: T | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Storage full or blocked — silently ignore
  }
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutState>({
    cart: null,
    shippingAddress: null,
    orderPlaced: false,
  });

  const [hydrated, setHydrated] = useState(false);

  // ─── Hydrate from localStorage on first client render ───
  useEffect(() => {
    const savedCart = loadFromStorage<CartData>(CART_STORAGE_KEY);
    const savedAddress = loadFromStorage<ShippingAddress>(ADDRESS_STORAGE_KEY);

    setState((prev) => ({
      ...prev,
      cart: savedCart,
      shippingAddress: savedAddress,
    }));
    setHydrated(true);
  }, []);

  // ─── Persist cart to localStorage on every change (after hydration) ───
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(CART_STORAGE_KEY, state.cart);
  }, [state.cart, hydrated]);

  // ─── Persist shipping address to localStorage ───
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(ADDRESS_STORAGE_KEY, state.shippingAddress);
  }, [state.shippingAddress, hydrated]);

  const setCart = useCallback((cart: CartData) => {
    setState((prev) => ({ ...prev, cart }));
  }, []);

  /** Add a product to the cart (or increment its quantity if already present). */
  const addToCart = useCallback((product: Product) => {
    setState((prev) => {
      const cart = prev.cart ?? {
        cartItems: [],
        shipping_fee: DEFAULT_SHIPPING_FEE,
        discount_applied: 0,
      };

      const existing = cart.cartItems.find(
        (item) => item.product_id === product.product_id
      );

      const updatedItems = existing
        ? cart.cartItems.map((item) =>
            item.product_id === product.product_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...cart.cartItems,
            {
              product_id: product.product_id,
              product_name: product.product_name,
              product_price: product.product_price,
              quantity: 1,
              image: product.image,
            },
          ];

      return {
        ...prev,
        cart: { ...cart, cartItems: updatedItems },
      };
    });
  }, []);

  /** Remove an item entirely from the cart. */
  const removeFromCart = useCallback((productId: number) => {
    setState((prev) => {
      if (!prev.cart) return prev;
      const updatedItems = prev.cart.cartItems.filter(
        (item) => item.product_id !== productId
      );
      // If cart becomes empty, keep the shell so shipping_fee etc. persist
      return {
        ...prev,
        cart: { ...prev.cart, cartItems: updatedItems },
      };
    });
  }, []);

  /** Update quantity of an item. If quantity <= 0, remove it. */
  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      setState((prev) => {
        if (!prev.cart) return prev;
        if (quantity <= 0) {
          return {
            ...prev,
            cart: {
              ...prev.cart,
              cartItems: prev.cart.cartItems.filter(
                (item) => item.product_id !== productId
              ),
            },
          };
        }
        return {
          ...prev,
          cart: {
            ...prev.cart,
            cartItems: prev.cart.cartItems.map((item) =>
              item.product_id === productId ? { ...item, quantity } : item
            ),
          },
        };
      });
    },
    []
  );

  const setShippingAddress = useCallback((address: ShippingAddress) => {
    setState((prev) => ({ ...prev, shippingAddress: address }));
  }, []);

  const placeOrder = useCallback(() => {
    setState((prev) => ({ ...prev, orderPlaced: true }));
  }, []);

  /** Reset everything and clear localStorage. */
  const resetCheckout = useCallback(() => {
    setState({ cart: null, shippingAddress: null, orderPlaced: false });
    saveToStorage(CART_STORAGE_KEY, null);
    saveToStorage(ADDRESS_STORAGE_KEY, null);
  }, []);

  const getSubtotal = useCallback(() => {
    if (!state.cart) return 0;
    return state.cart.cartItems.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    );
  }, [state.cart]);

  const getGrandTotal = useCallback(() => {
    if (!state.cart) return 0;
    const subtotal = state.cart.cartItems.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    );
    return subtotal + state.cart.shipping_fee - state.cart.discount_applied;
  }, [state.cart]);

  const getCartCount = useCallback(() => {
    if (!state.cart) return 0;
    return state.cart.cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }, [state.cart]);

  return (
    <CheckoutContext.Provider
      value={{
        ...state,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        setShippingAddress,
        placeOrder,
        resetCheckout,
        getSubtotal,
        getGrandTotal,
        getCartCount,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout(): CheckoutContextType {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
