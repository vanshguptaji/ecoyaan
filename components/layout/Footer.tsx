export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Ecoyaan — Sustainable living, simplified.
          </p>
          <p className="text-[10px] text-gray-300">
            🌱 Every purchase plants a seed for a greener tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
}
