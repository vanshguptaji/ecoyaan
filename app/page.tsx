import { redirect } from "next/navigation";

/**
 * Root page — redirects to the shop.
 */
export default function HomePage() {
  redirect("/shop");
}
