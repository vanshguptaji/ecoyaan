"use client";

import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function SuccessPageClient() {
  const { cart, shippingAddress, orderPlaced, resetCheckout, getGrandTotal } =
    useCheckout();
  const [grandTotal, setGrandTotal] = useState(0);
  const [show, setShow] = useState(false);

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
        <p className="mb-4 text-gray-500">No order found.</p>
        <Link
          href="/checkout/cart"
          className="text-emerald-600 underline hover:text-emerald-700"
        >
          Go to Cart
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
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <svg
          className="h-10 w-10 text-emerald-600"
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
        Order Successful! 🎉
      </h1>
      <p className="mb-6 text-gray-500">
        Thank you for your purchase. Your sustainable goodies are on their way!
      </p>

      {/* Mini recap */}
      <div className="mb-8 w-full rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm">
        <div className="mb-3 flex justify-between text-sm text-gray-600">
          <span>Order Total</span>
          <span className="font-bold text-gray-900">
            {formatCurrency(grandTotal)}
          </span>
        </div>
        {shippingAddress && (
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-800">Delivering to</p>
            <p>
              {shippingAddress.fullName}, {shippingAddress.city},{" "}
              {shippingAddress.state} – {shippingAddress.pinCode}
            </p>
          </div>
        )}
      </div>

      <Link
        href="/"
        onClick={() => resetCheckout()}
        className="rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
