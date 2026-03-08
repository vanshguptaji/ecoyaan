"use client";

import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";

export default function Header() {
  const { getCartCount } = useCheckout();
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/shop" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-lg text-white shadow-md shadow-emerald-200 transition group-hover:shadow-lg group-hover:shadow-emerald-200">
            🌿
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Ecoyaan
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link
            href="/shop"
            className="hidden transition hover:text-emerald-600 sm:inline"
          >
            Shop
          </Link>
          <Link
            href="/checkout/cart"
            className="relative flex items-center gap-1.5 rounded-xl bg-gray-50 px-3.5 py-2 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
