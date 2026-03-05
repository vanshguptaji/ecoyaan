"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import CartItemCard from "@/components/cart/CartItemCard";
import OrderSummaryBox from "@/components/cart/OrderSummaryBox";
import StepIndicator from "@/components/ui/StepIndicator";

interface CartPageClientProps {
  products: Product[];
}

/**
 * Client component that reads cart from Context (persisted in localStorage).
 * Also receives SSR-fetched products for a "You might also like" section.
 */
export default function CartPageClient({ products }: CartPageClientProps) {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    addToCart,
    getCartCount,
  } = useCheckout();

  const items = cart?.cartItems ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
  const shippingFee = cart?.shipping_fee ?? 50;
  const discount = cart?.discount_applied ?? 0;
  const grandTotal = subtotal + shippingFee - discount;

  // Products not already in cart — for recommendations
  const recommendations = products.filter(
    (p) => !items.some((i) => i.product_id === p.product_id)
  );

  // ─── Empty cart state ───
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <StepIndicator currentStep={1} />
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 text-6xl">🛒</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>
          <p className="mb-6 text-gray-500">
            Looks like you haven&apos;t added any eco-friendly goodies yet.
          </p>
          <Link
            href="/shop"
            className="rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Browse Products →
          </Link>
        </div>

        {/* Quick-add recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Popular Picks 🌱
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.slice(0, 3).map((p) => (
                <div
                  key={p.product_id}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={p.image}
                      alt={p.product_name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 leading-snug">
                      {p.product_name}
                    </p>
                    <p className="text-xs font-bold text-gray-600">
                      {formatCurrency(p.product_price)}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="shrink-0 cursor-pointer rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Cart with items ───
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <StepIndicator currentStep={1} />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Your Cart{" "}
          <span className="text-base font-normal text-gray-400">
            ({getCartCount()} {getCartCount() === 1 ? "item" : "items"})
          </span>
        </h1>
        <Link
          href="/shop"
          className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
        >
          ← Continue Shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Items list */}
        <div className="space-y-4 lg:col-span-3">
          {items.map((item) => (
            <CartItemCard
              key={item.product_id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-2">
          <OrderSummaryBox
            subtotal={subtotal}
            shippingFee={shippingFee}
            discount={discount}
            grandTotal={grandTotal}
          />

          <button
            onClick={() => router.push("/checkout/shipping")}
            className="mt-4 w-full cursor-pointer rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>

      {/* You might also like */}
      {recommendations.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            You might also like 🌿
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, 3).map((p) => (
              <div
                key={p.product_id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={p.image}
                    alt={p.product_name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 leading-snug">
                    {p.product_name}
                  </p>
                  <p className="text-xs font-bold text-gray-600">
                    {formatCurrency(p.product_price)}
                  </p>
                </div>
                <button
                  onClick={() => addToCart(p)}
                  className="shrink-0 cursor-pointer rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
