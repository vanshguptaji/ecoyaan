"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { ShippingAddress } from "@/types";
import { isValidEmail, isValidPhone, isValidPinCode } from "@/lib/utils";
import StepIndicator from "@/components/ui/StepIndicator";

type FormErrors = Partial<Record<keyof ShippingAddress, string>>;

export default function ShippingForm() {
  const router = useRouter();
  const { cart, setShippingAddress, shippingAddress } = useCheckout();

  const [form, setForm] = useState<ShippingAddress>(
    shippingAddress ?? {
      fullName: "",
      email: "",
      phone: "",
      pinCode: "",
      city: "",
      state: "",
    }
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingAddress, boolean>>>({});

  // Redirect if cart is empty (user navigated directly)
  if (!cart || cart.cartItems.length === 0) {
    if (typeof window !== "undefined") {
      router.replace("/checkout/cart");
    }
    return null;
  }

  function validate(data: ShippingAddress): FormErrors {
    const errs: FormErrors = {};
    if (!data.fullName.trim()) errs.fullName = "Full name is required";
    if (!data.email.trim()) errs.email = "Email is required";
    else if (!isValidEmail(data.email)) errs.email = "Enter a valid email";
    if (!data.phone.trim()) errs.phone = "Phone number is required";
    else if (!isValidPhone(data.phone))
      errs.phone = "Enter a valid 10-digit phone number";
    if (!data.pinCode.trim()) errs.pinCode = "PIN code is required";
    else if (!isValidPinCode(data.pinCode))
      errs.pinCode = "Enter a valid 6-digit PIN code";
    if (!data.city.trim()) errs.city = "City is required";
    if (!data.state.trim()) errs.state = "State is required";
    return errs;
  }

  function handleChange(field: keyof ShippingAddress, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);
    // Clear error on change if the field has been touched
    if (touched[field]) {
      const fieldError = validate(next)[field];
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  }

  function handleBlur(field: keyof ShippingAddress) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validate(form)[field];
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    // Mark all as touched
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true])
    ) as Record<keyof ShippingAddress, boolean>;
    setTouched(allTouched);
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setShippingAddress(form);
    router.push("/checkout/payment");
  }

  const fields: {
    name: keyof ShippingAddress;
    label: string;
    type: string;
    placeholder: string;
    maxLength?: number;
  }[] = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Vansh Gupta",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "vansh@email.com",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "9876543210",
      maxLength: 10,
    },
    {
      name: "pinCode",
      label: "PIN Code",
      type: "text",
      placeholder: "560001",
      maxLength: 6,
    },
    { name: "city", label: "City", type: "text", placeholder: "Bangalore" },
    {
      name: "state",
      label: "State",
      type: "text",
      placeholder: "Karnataka",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <StepIndicator currentStep={2} />

      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Shipping Address
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div
              key={f.name}
              className={f.name === "fullName" || f.name === "email" ? "sm:col-span-2" : ""}
            >
              <label
                htmlFor={f.name}
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {f.label}
              </label>
              <input
                id={f.name}
                type={f.type}
                maxLength={f.maxLength}
                value={form[f.name]}
                onChange={(e) => handleChange(f.name, e.target.value)}
                onBlur={() => handleBlur(f.name)}
                placeholder={f.placeholder}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 ${
                  errors[f.name] && touched[f.name]
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-emerald-300"
                }`}
              />
              {errors[f.name] && touched[f.name] && (
                <p className="mt-1 text-xs text-red-500">{errors[f.name]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            ← Back to Cart
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Continue to Payment →
          </button>
        </div>
      </form>
    </div>
  );
}
