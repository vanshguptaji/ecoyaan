"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { ShippingAddress } from "@/types";
import { isValidEmail, isValidPhone, isValidPinCode } from "@/lib/utils";
import StepIndicator from "@/components/ui/StepIndicator";

type FormFields = Omit<ShippingAddress, "id">;
type FormErrors = Partial<Record<keyof FormFields, string>>;

const emptyForm: FormFields = {
  label: "",
  fullName: "",
  email: "",
  phone: "",
  addressLine: "",
  pinCode: "",
  city: "",
  state: "",
};

const QUICK_LABELS = ["Home", "Office", "Other"];

function generateId() {
  return `addr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export default function ShippingForm() {
  const router = useRouter();
  const {
    cart,
    savedAddresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
  } = useCheckout();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Scroll to form when it opens
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  // Redirect if cart is empty
  if (!cart || cart.cartItems.length === 0) {
    if (typeof window !== "undefined") {
      router.replace("/checkout/cart");
    }
    return null;
  }

  function validate(data: FormFields): FormErrors {
    const errs: FormErrors = {};
    if (!data.label.trim()) errs.label = "Label is required (e.g. Home, Office)";
    if (!data.fullName.trim()) errs.fullName = "Full name is required";
    if (!data.email.trim()) errs.email = "Email is required";
    else if (!isValidEmail(data.email)) errs.email = "Enter a valid email";
    if (!data.phone.trim()) errs.phone = "Phone number is required";
    else if (!isValidPhone(data.phone))
      errs.phone = "Enter a valid 10-digit phone number";
    if (!data.addressLine.trim()) errs.addressLine = "Address is required";
    if (!data.pinCode.trim()) errs.pinCode = "PIN code is required";
    else if (!isValidPinCode(data.pinCode))
      errs.pinCode = "Enter a valid 6-digit PIN code";
    if (!data.city.trim()) errs.city = "City is required";
    if (!data.state.trim()) errs.state = "State is required";
    return errs;
  }

  function handleChange(field: keyof FormFields, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) {
      const fieldError = validate(next)[field];
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  }

  function handleBlur(field: keyof FormFields) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validate(form)[field];
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  }

  function handleSaveAddress(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true])
    ) as Record<keyof FormFields, boolean>;
    setTouched(allTouched);
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    if (editingId) {
      updateAddress({ ...form, id: editingId });
    } else {
      const newId = generateId();
      addAddress({ ...form, id: newId });
    }

    setForm(emptyForm);
    setErrors({});
    setTouched({});
    setShowForm(false);
    setEditingId(null);
  }

  function handleEditAddress(address: ShippingAddress) {
    setForm({
      label: address.label,
      fullName: address.fullName,
      email: address.email,
      phone: address.phone,
      addressLine: address.addressLine,
      pinCode: address.pinCode,
      city: address.city,
      state: address.state,
    });
    setEditingId(address.id);
    setShowForm(true);
    setErrors({});
    setTouched({});
  }

  function handleDeleteAddress(addressId: string) {
    deleteAddress(addressId);
    setConfirmDeleteId(null);
    if (editingId === addressId) {
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setTouched({});
  }

  function handleContinue() {
    if (!selectedAddressId) return;
    router.push("/checkout/payment");
  }

  const canContinue = !!selectedAddressId;
  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);

  const fields: {
    name: keyof FormFields;
    label: string;
    type: string;
    placeholder: string;
    maxLength?: number;
    colSpan?: string;
    icon?: string;
  }[] = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Vansh Gupta",
      colSpan: "sm:col-span-2",
      icon: "👤",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "vansh@email.com",
      icon: "✉️",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "9876543210",
      maxLength: 10,
      icon: "📱",
    },
    {
      name: "addressLine",
      label: "Street Address",
      type: "text",
      placeholder: "123 Green Street, Apt 4B",
      colSpan: "sm:col-span-2",
      icon: "🏠",
    },
    {
      name: "pinCode",
      label: "PIN Code",
      type: "text",
      placeholder: "560001",
      maxLength: 6,
      icon: "📮",
    },
    { name: "city", label: "City", type: "text", placeholder: "Bangalore", icon: "🏙️" },
    {
      name: "state",
      label: "State",
      type: "text",
      placeholder: "Karnataka",
      colSpan: "sm:col-span-2",
      icon: "📍",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-8 sm:px-6">
      <StepIndicator currentStep={2} />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Shipping Address
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {savedAddresses.length > 0
                ? `You have ${savedAddresses.length} saved address${savedAddresses.length > 1 ? "es" : ""}. Select one or add a new address.`
                : "Add a delivery address to continue with your order."}
            </p>
          </div>
          {!showForm && savedAddresses.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setForm(emptyForm);
                setErrors({});
                setTouched({});
              }}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-[0.97]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Address</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Saved Addresses Grid ─── */}
      {savedAddresses.length > 0 && !showForm && (
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Your Addresses
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="stagger-children grid gap-3 sm:grid-cols-2">
            {savedAddresses.map((addr) => {
              const isSelected = addr.id === selectedAddressId;
              const isConfirmingDelete = confirmDeleteId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => selectAddress(addr.id)}
                  className={`group relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-emerald-500 bg-linear-to-br from-emerald-50/80 to-white shadow-md shadow-emerald-100 selected-pulse"
                      : "border-gray-100 bg-white hover:border-emerald-200 hover:shadow-md hover:shadow-gray-100"
                  }`}
                >
                  {/* Selected badge */}
                  {isSelected && (
                    <div className="absolute -right-1.5 -top-1.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                      isSelected
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500"
                    }`}>
                      <span className="text-lg">
                        {addr.label.toLowerCase().includes("home") ? "🏠" :
                         addr.label.toLowerCase().includes("office") ? "🏢" : "📍"}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
                          isSelected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {addr.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {addr.fullName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 leading-relaxed truncate">
                        {addr.addressLine}
                      </p>
                      <p className="text-xs text-gray-400">
                        {addr.city}, {addr.state} – {addr.pinCode}
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-400">
                        <span>📞 {addr.phone}</span>
                        <span className="text-gray-200">|</span>
                        <span className="truncate">✉️ {addr.email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex items-center justify-end gap-1 border-t border-gray-50 pt-2.5">
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-2 animate-fade-in-up">
                        <span className="text-xs text-red-500 font-medium">Delete this address?</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr.id);
                          }}
                          className="cursor-pointer rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-50"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(addr);
                          }}
                          className="cursor-pointer flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                          aria-label="Edit address"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(addr.id);
                          }}
                          className="cursor-pointer flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label="Delete address"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add new address card */}
            <div
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setForm(emptyForm);
                setErrors({});
                setTouched({});
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 transition hover:border-emerald-300 hover:bg-emerald-50/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-500">Add New Address</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Address Form ─── */}
      {showForm && (
        <form
          ref={formRef}
          onSubmit={handleSaveAddress}
          noValidate
          className="animate-fade-in-up mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-100/50"
        >
          {/* Form Header */}
          <div className="border-b border-gray-100 bg-linear-to-r from-emerald-50/80 to-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-gray-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm">
                  {editingId ? "✏️" : "📍"}
                </span>
                {editingId ? "Edit Address" : "New Address"}
              </h2>
              <button
                type="button"
                onClick={handleCancelForm}
                className="cursor-pointer rounded-xl p-2 text-gray-400 transition hover:bg-white hover:text-gray-600 hover:shadow-sm"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Quick Label Picker */}
            <div className="mb-5">
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <span className="text-xs">🏷️</span>
                Address Label
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_LABELS.map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => handleChange("label", lbl)}
                    className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      form.label === lbl
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                    }`}
                  >
                    {lbl === "Home" ? "🏠" : lbl === "Office" ? "🏢" : "📍"} {lbl}
                  </button>
                ))}
                <input
                  type="text"
                  value={QUICK_LABELS.includes(form.label) ? "" : form.label}
                  onChange={(e) => handleChange("label", e.target.value)}
                  placeholder="Or type custom…"
                  className="flex-1 min-w-35 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              {errors.label && touched.label && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.label}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-300">Contact & Address</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div
                  key={f.name}
                  className={f.colSpan ?? ""}
                >
                  <label
                    htmlFor={f.name}
                    className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
                  >
                    {f.icon && <span className="text-xs">{f.icon}</span>}
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
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:ring-2 ${
                      errors[f.name] && touched[f.name]
                        ? "border-red-300 bg-red-50/50 focus:ring-red-200"
                        : "border-gray-200 bg-gray-50/50 focus:border-emerald-300 focus:bg-white focus:ring-emerald-100"
                    }`}
                  />
                  {errors[f.name] && touched[f.name] && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors[f.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Form actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={handleCancelForm}
                className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-[0.97]"
              >
                {editingId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Empty state */}
      {savedAddresses.length === 0 && !showForm && (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="relative mb-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-50 to-emerald-100 shadow-inner">
              <span className="text-4xl">📍</span>
            </div>
          </div>
          <p className="mb-1 text-base font-semibold text-gray-800">No addresses saved yet</p>
          <p className="mb-8 max-w-xs text-sm text-gray-400">
            Add a delivery address to continue with your sustainable order.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-[0.97]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Address
          </button>
        </div>
      )}

      {/* ─── Sticky bottom action bar ─── */}
      <div className="sticky-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-3.5 sm:px-6">
          {/* Top row: delivery info */}
          {selectedAddress && (
            <div className="mb-2.5 flex items-center gap-2 text-xs text-gray-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 text-[10px]">📦</span>
              <span>Delivering to</span>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                {selectedAddress.label}
              </span>
              <span className="font-medium text-gray-700">{selectedAddress.fullName}</span>
              <span className="hidden sm:inline text-gray-300">—</span>
              <span className="hidden sm:inline truncate text-gray-400">{selectedAddress.city}, {selectedAddress.state}</span>
            </div>
          )}
          {/* Bottom row: navigation buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => router.push("/checkout/cart")}
              className="cursor-pointer flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cart
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="cursor-pointer flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              Continue to Payment
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
