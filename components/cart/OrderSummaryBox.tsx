import { formatCurrency } from "@/lib/utils";

interface OrderSummaryBoxProps {
  subtotal: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  compact?: boolean;
}

export default function OrderSummaryBox({
  subtotal,
  shippingFee,
  discount,
  grandTotal,
  compact = false,
}: OrderSummaryBoxProps) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${compact ? "p-4" : "p-5"}`}>
      {!compact && (
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-sm">
            📋
          </span>
          Order Summary
        </h2>
      )}

      <div className={`space-y-2.5 ${compact ? "text-xs" : "text-sm"}`}>
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="font-medium text-gray-700">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className="font-medium text-gray-700">
            {shippingFee === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              formatCurrency(shippingFee)
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span className="flex items-center gap-1">
              <span>🏷️</span> Discount
            </span>
            <span className="font-medium">-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="my-1 border-t border-dashed border-gray-200" />

        <div className={`flex justify-between font-bold text-gray-900 ${compact ? "text-sm" : "text-base"}`}>
          <span>Total</span>
          <span className="text-emerald-700">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
