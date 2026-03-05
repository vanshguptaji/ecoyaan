interface StepIndicatorProps {
  currentStep: number; // 1 | 2 | 3
}

const steps = ["Cart", "Shipping", "Payment"];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Checkout steps" className="mb-8">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((label, idx) => {
          const step = idx + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <li key={label} className="flex items-center gap-2 sm:gap-4">
              {/* Step circle */}
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : isCompleted
                        ? "bg-emerald-200 text-emerald-800"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : step}
                </span>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
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
                <div
                  className={`h-0.5 w-8 sm:w-16 ${
                    isCompleted ? "bg-emerald-400" : "bg-gray-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
