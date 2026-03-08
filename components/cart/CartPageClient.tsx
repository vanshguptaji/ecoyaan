"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { formatCurrency } from "@/lib/utils";
import { mockProducts } from "@/lib/mock-data";
import CartItemCard from "@/components/cart/CartItemCard";
import OrderSummaryBox from "@/components/cart/OrderSummaryBox";
import StepIndicator from "@/components/ui/StepIndicator";

/**
 * Client component that reads cart from Context (persisted in localStorage).
 * Products are imported directly from mock data — no API calls.
 */
export default function CartPageClient() {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    addToCart,
    getCartCount,
  } = useCheckout();

  const products = mockProducts;
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
        <div className="flex flex-col items-center py-16 text-center animate-fade-in-up">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
            <span className="text-5xl">🛒</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>
          <p className="mb-8 max-w-sm text-gray-500">
            Looks like you haven&apos;t added any eco-friendly goodies yet.
            Start shopping to make a difference!
          </p>
          <Link
            href="/shop"
            className="rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200"
          >
            Browse Products →
          </Link>
        </div>

        {/* Quick-add recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-8 animate-fade-in-up">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Popular Picks 🌱
            </h2>
            <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.slice(0, 3).map((p) => (
                <div
                  key={p.product_id}
                  className="card-lift flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50">
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
                    <p className="text-xs font-bold text-emerald-700">
                      {formatCurrency(p.product_price)}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="shrink-0 cursor-pointer rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
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
    <div className="mx-auto max-w-4xl px-4 pb-32 pt-8 sm:px-6">
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
          className="flex items-center gap-1 rounded-xl bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Continue Shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Items list */}
        <div className="stagger-children space-y-4 lg:col-span-3">
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
          <div className="sticky top-20">
            <OrderSummaryBox
              subtotal={subtotal}
              shippingFee={shippingFee}
              discount={discount}
              grandTotal={grandTotal}
            />

            {/* Trust badges */}
            <div className="mt-4 flex items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-3 text-center">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-base">🔒</span>
                <span className="text-[10px] text-gray-400">Secure</span>
              </div>
              <div className="h-6 w-px bg-gray-100" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-base">🚚</span>
                <span className="text-[10px] text-gray-400">Fast Ship</span>
              </div>
              <div className="h-6 w-px bg-gray-100" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-base">🌱</span>
                <span className="text-[10px] text-gray-400">Eco-Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You might also like */}
      {recommendations.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            You might also like 🌿
          </h2>
          <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, 3).map((p) => (
              <div
                key={p.product_id}
                className="card-lift flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50">
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
                  <p className="text-xs font-bold text-emerald-700">
                    {formatCurrency(p.product_price)}
                  </p>
                </div>
                <button
                  onClick={() => addToCart(p)}
                  className="shrink-0 cursor-pointer rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Sticky bottom action bar ─── */}
      <div className="sticky-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-3.5 sm:px-6">
          {/* Top row: summary info */}
          <div className="mb-2.5 flex items-center gap-2 text-xs text-gray-500">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 text-[10px]">🛒</span>
            <span>{getCartCount()} {getCartCount() === 1 ? "item" : "items"}</span>
            <span className="text-gray-200">|</span>
            <span className="font-semibold text-emerald-700">{formatCurrency(grandTotal)}</span>
          </div>
          {/* Bottom row: navigation buttons */}
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/shop"
              className="cursor-pointer flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back to Shop</span>
              <span className="sm:hidden">Shop</span>
            </Link>
            <button
              onClick={() => router.push("/checkout/shipping")}
              className="cursor-pointer flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-[0.97]"
            >
              Proceed to Checkout
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
