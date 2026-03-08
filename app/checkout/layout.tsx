import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Checkout | Ecoyaan",
  description: "Complete your sustainable purchase on Ecoyaan",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
