import { NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";

/**
 * GET /api/products
 * Returns the full product catalog. Simulates a real backend API.
 */
export async function GET() {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 150));

  return NextResponse.json({ products: mockProducts });
}
