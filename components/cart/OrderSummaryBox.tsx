import { formatCurrency } from "@/lib/utils";

interface OrderSummaryBoxProps {
  subtotal: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
}

export default function OrderSummaryBox({
  subtotal,
  shippingFee,
  discount,
  grandTotal,
}: OrderSummaryBoxProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Order Summary
      </h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{formatCurrency(shippingFee)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <hr className="my-2 border-gray-200" />

        <div className="flex justify-between text-base font-bold text-gray-900">
          <span>Grand Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
