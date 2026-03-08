import Image from "next/image";
import { CartItem as CartItemType } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface CartItemCardProps {
  item: CartItemType;
  onUpdateQuantity?: (productId: number, quantity: number) => void;
  onRemove?: (productId: number) => void;
}

export default function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="card-lift flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Product image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:h-24 sm:w-24">
        <Image
          src={item.image}
          alt={item.product_name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-gray-800 sm:text-base leading-snug">
          {item.product_name}
        </h3>

        {/* Quantity controls */}
        {onUpdateQuantity ? (
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
              <button
                onClick={() =>
                  onUpdateQuantity(item.product_id, item.quantity - 1)
                }
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-l-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="flex h-8 w-8 items-center justify-center border-x border-gray-200 bg-white text-sm font-semibold text-gray-800">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  onUpdateQuantity(item.product_id, item.quantity + 1)
                }
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-r-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {onRemove && (
              <button
                onClick={() => onRemove(item.product_id)}
                className="ml-2 cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                aria-label={`Remove ${item.product_name}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
        )}
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="text-sm font-bold text-gray-900 sm:text-base">
          {formatCurrency(item.product_price * item.quantity)}
        </p>
        {item.quantity > 1 && (
          <p className="text-[11px] text-gray-400">
            {formatCurrency(item.product_price)} each
          </p>
        )}
      </div>
    </div>
  );
}
