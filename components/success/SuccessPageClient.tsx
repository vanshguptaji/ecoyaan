"use client";

import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function SuccessPageClient() {
  const { cart, getSelectedAddress, orderPlaced, resetCheckout, getGrandTotal } =
    useCheckout();
  const [grandTotal, setGrandTotal] = useState(0);
  const [show, setShow] = useState(false);

  const shippingAddress = getSelectedAddress();

  useEffect(() => {
    if (cart) {
      setGrandTotal(getGrandTotal());
    }
    // Trigger entrance animation
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, [cart, getGrandTotal]);

  // If someone navigates here directly without an order
  if (!orderPlaced) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
          <span className="text-3xl">🤔</span>
        </div>
        <p className="mb-2 text-lg font-medium text-gray-800">No order found</p>
        <p className="mb-6 text-sm text-gray-500">
          It seems you haven&apos;t placed an order yet.
        </p>
        <Link
          href="/checkout/cart"
          className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
        >
          Go to Cart →
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center transition-all duration-700 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {/* Success icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-100 to-emerald-200 shadow-lg shadow-emerald-100">
        <svg
          className="h-12 w-12 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        Order Placed! 🎉
      </h1>
      <p className="mb-8 max-w-sm text-gray-500">
        Thank you for your purchase. Your sustainable goodies are on their way!
      </p>

      {/* Mini recap */}
      <div className="mb-8 w-full rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm">
        <div className="mb-3 flex justify-between text-sm text-gray-500">
          <span>Order Total</span>
          <span className="text-lg font-bold text-emerald-700">
            {formatCurrency(grandTotal)}
          </span>
        </div>
        {shippingAddress && (
          <>
            <div className="mb-2 border-t border-dashed border-gray-100 pt-3" />
            <div className="text-sm text-gray-500">
              <p className="mb-1 flex items-center gap-2">
                <span className="text-xs">📦</span>
                <span className="font-medium text-gray-800">Delivering to</span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                  {shippingAddress.label}
                </span>
              </p>
              <p className="text-gray-600">
                {shippingAddress.fullName}, {shippingAddress.addressLine}
              </p>
              <p>
                {shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pinCode}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          onClick={() => resetCheckout()}
          className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200"
        >
          Continue Shopping 🛍️
        </Link>
      </div>

      {/* Eco message */}
      <div className="mt-10 rounded-2xl bg-emerald-50 px-6 py-4 text-center">
        <p className="text-sm text-emerald-700">
          🌱 By choosing eco-friendly products, you&apos;re helping reduce waste
          and protect our planet. Thank you!
        </p>
      </div>
    </div>
  );
}
