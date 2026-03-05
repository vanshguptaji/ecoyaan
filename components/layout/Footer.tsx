export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-gray-500 sm:px-6">
        © {new Date().getFullYear()} Ecoyaan — Sustainable living, simplified.
      </div>
    </footer>
  );
}
