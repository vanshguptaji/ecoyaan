"use client";

import Image from "next/image";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCheckout } from "@/context/CheckoutContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useCheckout();
  const [added, setAdded] = useState(false);

  const inCart = cart?.cartItems.find(
    (item) => item.product_id === product.product_id
  );

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.product_name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold leading-snug text-gray-800 sm:text-base">
          {product.product_name}
        </h3>
        <p className="line-clamp-2 text-xs text-gray-500 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.product_price)}
          </span>

          <button
            onClick={handleAdd}
            className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition active:scale-95 ${
              added
                ? "bg-emerald-100 text-emerald-700"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
            }`}
          >
            {added ? "✓ Added!" : inCart ? `Add More (${inCart.quantity})` : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
