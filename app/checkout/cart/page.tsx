import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/types";
import CartPageClient from "@/components/cart/CartPageClient";

/**
 * Server Component — demonstrates SSR by fetching product data
 * on the server. The cart itself lives in Context + localStorage.
 */
async function getProducts(): Promise<Product[]> {
  // Simulating async behavior as if this were a real DB/API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts;
}

export default async function CartPage() {
  const products = await getProducts();

  return <CartPageClient products={products} />;
}
