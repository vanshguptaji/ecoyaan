"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { formatCurrency } from "@/lib/utils";
import StepIndicator from "@/components/ui/StepIndicator";
import OrderSummaryBox from "@/components/cart/OrderSummaryBox";

export default function PaymentPageClient() {
  const router = useRouter();
  const { cart, shippingAddress, placeOrder, getSubtotal, getGrandTotal } =
    useCheckout();
  const [processing, setProcessing] = useState(false);

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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <StepIndicator currentStep={3} />

      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Review & Pay
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shipping details recap */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Shipping To
          </h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-medium text-gray-900">
              {shippingAddress.fullName}
            </p>
            <p>{shippingAddress.email}</p>
            <p>{shippingAddress.phone}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} –{" "}
              {shippingAddress.pinCode}
            </p>
          </div>
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
      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
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
                <span className="text-gray-400">× {item.quantity}</span>
              </span>
              <span className="font-medium text-gray-900">
                {formatCurrency(item.product_price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          onClick={handlePay}
          disabled={processing}
          className="cursor-pointer rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
            "🔒 Pay Securely"
          )}
        </button>
      </div>
    </div>
  );
}
