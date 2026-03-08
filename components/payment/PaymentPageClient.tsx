"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { formatCurrency } from "@/lib/utils";
import StepIndicator from "@/components/ui/StepIndicator";
import OrderSummaryBox from "@/components/cart/OrderSummaryBox";

export default function PaymentPageClient() {
  const router = useRouter();
  const { cart, getSelectedAddress, placeOrder, getSubtotal, getGrandTotal } =
    useCheckout();
  const [processing, setProcessing] = useState(false);

  const shippingAddress = getSelectedAddress();

  // Guard: redirect if data is missing
  if (!cart || cart.cartItems.length === 0 || !shippingAddress) {
    if (typeof window !== "undefined") {
      router.replace("/checkout/cart");
    }
    return null;
  }

  const subtotal = getSubtotal();
  const grandTotal = getGrandTotal();

  async function handlePay() {
    setProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    placeOrder();
    router.push("/checkout/success");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-8 sm:px-6">
      <StepIndicator currentStep={3} />

      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Review & Pay
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Verify your order details before placing it.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Shipping details recap */}
        <div className="card-lift rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-xs">
              📦
            </span>
            Shipping To
          </h2>
          <div className="space-y-1 text-sm text-gray-500">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                {shippingAddress.label}
              </span>
              <span className="font-semibold text-gray-900">
                {shippingAddress.fullName}
              </span>
            </div>
            <p>{shippingAddress.addressLine}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} –{" "}
              {shippingAddress.pinCode}
            </p>
            <p className="text-xs text-gray-400">
              {shippingAddress.phone} · {shippingAddress.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/checkout/shipping")}
            className="mt-3 cursor-pointer text-xs font-medium text-emerald-600 transition hover:text-emerald-700"
          >
            Change address →
          </button>
        </div>

        {/* Order summary */}
        <OrderSummaryBox
          subtotal={subtotal}
          shippingFee={cart.shipping_fee}
          discount={cart.discount_applied}
          grandTotal={grandTotal}
        />
      </div>

      {/* Items list */}
      <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-xs">
            🛍️
          </span>
          Items ({cart.cartItems.length})
        </h2>
        <ul className="divide-y divide-gray-100">
          {cart.cartItems.map((item) => (
            <li
              key={item.product_id}
              className="flex justify-between py-3 text-sm"
            >
              <span className="text-gray-700">
                {item.product_name}{" "}
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                  × {item.quantity}
                </span>
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(item.product_price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Sticky bottom action bar ─── */}
      <div className="sticky-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-3.5 sm:px-6">
          {/* Top row: amount info */}
          <div className="mb-2.5 flex items-center gap-2 text-xs text-gray-500">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 text-[10px]">💳</span>
            <span>Amount to pay</span>
            <span className="text-sm font-bold text-emerald-700">
              {formatCurrency(grandTotal)}
            </span>
          </div>
          {/* Bottom row: navigation buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => router.push("/checkout/shipping")}
              className="cursor-pointer flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Shipping
            </button>
            <button
              onClick={handlePay}
              disabled={processing}
              className="cursor-pointer flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Processing…
                </span>
              ) : (
                <>
                  🔒 Pay Securely
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
