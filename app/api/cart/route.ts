import { NextResponse } from "next/server";
import { emptyCartData } from "@/lib/mock-data";

/**
 * GET /api/cart
 * Returns the cart template. In a real app this would
 * read from a database / session. Demonstrates API routes.
 */
export async function GET() {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json(emptyCartData);
}
