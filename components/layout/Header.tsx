"use client";

import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";

export default function Header() {
  const { getCartCount } = useCheckout();
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/shop" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-emerald-700">
            🌿 Ecoyaan
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium text-gray-600">
          <Link
            href="/shop"
            className="hidden transition hover:text-emerald-600 sm:inline"
          >
            Shop
          </Link>
          <Link
            href="/checkout/cart"
            className="relative flex items-center gap-1.5 transition hover:text-emerald-600"
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
              <span className="absolute -right-2.5 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
