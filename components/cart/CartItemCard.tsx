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
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Product image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-24">
        <Image
          src={item.image}
          alt={item.product_name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
          {item.product_name}
        </h3>

        {/* Quantity controls */}
        {onUpdateQuantity ? (
          <div className="mt-1 flex items-center gap-2">
            <button
              onClick={() =>
                onUpdateQuantity(item.product_id, item.quantity - 1)
              }
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-medium text-gray-800">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item.product_id, item.quantity + 1)
              }
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              +
            </button>

            {onRemove && (
              <button
                onClick={() => onRemove(item.product_id)}
                className="ml-2 cursor-pointer text-xs text-red-400 transition hover:text-red-600"
                aria-label={`Remove ${item.product_name}`}
              >
                Remove
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
        )}
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="text-sm font-bold text-gray-900 sm:text-base">
          {formatCurrency(item.product_price * item.quantity)}
        </p>
        {item.quantity > 1 && (
          <p className="text-xs text-gray-400">
            {formatCurrency(item.product_price)} each
          </p>
        )}
      </div>
    </div>
  );
}
