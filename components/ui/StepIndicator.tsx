interface StepIndicatorProps {
  currentStep: number; // 1 | 2 | 3
}

const steps = [
  { label: "Cart", icon: "🛒" },
  { label: "Shipping", icon: "📦" },
  { label: "Payment", icon: "💳" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Checkout steps" className="mb-10">
      <ol className="flex items-center justify-center gap-0">
        {steps.map(({ label, icon }, idx) => {
          const step = idx + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <li key={label} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-[3px] ring-emerald-100"
                      : isCompleted
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{icon}</span>
                  )}
                </span>
                <span
                  className={`text-xs font-semibold tracking-wide transition-colors ${
                    isActive
                      ? "text-emerald-700"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="mx-3 mb-6 sm:mx-5">
                  <div
                    className={`h-0.5 w-14 rounded-full sm:w-24 transition-colors duration-500 ${
                      isCompleted ? "bg-emerald-400" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
