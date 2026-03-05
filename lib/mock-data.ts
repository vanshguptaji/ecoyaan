import { CartData, Product } from "@/types";

// ─── Product Catalog ───

export const mockProducts: Product[] = [
  {
    product_id: 101,
    product_name: "Bamboo Toothbrush (Pack of 4)",
    product_price: 299,
    image: "/products/bamboo-toothbrush.jpg",
    description:
      "Eco-friendly bamboo toothbrushes with charcoal-infused bristles. Biodegradable and gentle on gums.",
    category: "Personal Care",
  },
  {
    product_id: 102,
    product_name: "Reusable Cotton Produce Bags",
    product_price: 450,
    image: "/products/cotton-bags.jpg",
    description:
      "Set of 6 organic cotton mesh bags for your grocery runs. Machine washable and ultra-durable.",
    category: "Kitchen",
  },
  {
    product_id: 103,
    product_name: "Stainless Steel Water Bottle",
    product_price: 699,
    image: "/products/steel-bottle.jpg",
    description:
      "Double-walled, vacuum-insulated 750 ml bottle. Keeps drinks cold 24 hrs or hot 12 hrs.",
    category: "Kitchen",
  },
  {
    product_id: 104,
    product_name: "Organic Beeswax Food Wraps",
    product_price: 399,
    image: "/products/beeswax-wraps.jpg",
    description:
      "Pack of 3 reusable beeswax wraps — a plastic-free alternative to cling film.",
    category: "Kitchen",
  },
  {
    product_id: 105,
    product_name: "Natural Loofah Sponge (Set of 3)",
    product_price: 199,
    image: "/products/loofah.jpg",
    description:
      "Plant-based, compostable loofah sponges. Perfect for kitchen and bath cleaning.",
    category: "Personal Care",
  },
  {
    product_id: 106,
    product_name: "Recycled Notebook (A5, Ruled)",
    product_price: 149,
    image: "/products/notebook.jpg",
    description:
      "120-page ruled notebook made from 100% post-consumer recycled paper.",
    category: "Stationery",
  },
];

// ─── Empty Cart Template ───

/**
 * Empty cart template — the actual cart state lives in
 * Context + localStorage. This is kept for the API route
 * to demonstrate the endpoint structure.
 */
export const emptyCartData: CartData = {
  cartItems: [],
  shipping_fee: 50,
  discount_applied: 0,
};
