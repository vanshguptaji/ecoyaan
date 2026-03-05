import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/types";
import ShopPageClient from "@/components/shop/ShopPageClient";

/**
 * Server Component — fetches the product catalog on the server (SSR).
 *
 * In a real app this would call an external API or database.
 * Here we import mock data directly to demonstrate SSR with
 * Next.js App Router Server Components.
 */
async function getProducts(): Promise<Product[]> {
  // Simulating async data fetching (e.g. database / external API)
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts;
}

export default async function ShopPage() {
  const products = await getProducts();

  return <ShopPageClient products={products} />;
}
