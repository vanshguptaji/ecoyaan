"use client";

import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";
import { mockProducts } from "@/lib/mock-data";
import ProductCard from "@/components/shop/ProductCard";

/**
 * Client component for the shop page.
 * Products are imported directly from mock data — no API calls.
 */
export default function ShopPageClient() {
  const { getCartCount } = useCheckout();
  const cartCount = getCartCount();
  const products = mockProducts;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shop Sustainable 🌿
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-500">
          Every product is eco-friendly, ethically sourced, and designed to
          reduce your carbon footprint. Add items to your cart and check out
          when you&apos;re ready!
        </p>
      </div>

      {/* Product Grid */}
      <div className="stagger-children grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <div className="sticky-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 px-4 py-3.5 backdrop-blur-lg sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              🛒{" "}
              <span className="font-bold text-emerald-700">{cartCount}</span>{" "}
              {cartCount === 1 ? "item" : "items"} in your cart
            </p>
            <Link
              href="/checkout/cart"
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200"
            >
              View Cart →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
