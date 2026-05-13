"use client";

import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MailCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getMerchantSessionAddress,
  saveMerchantProfile,
} from "@/lib/merchant-storage";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  businessLogo: string;
  businessCategory: string;
  businessDescription: string;
};

type Step = 1 | 2 | 3;

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  businessName: "",
  businessLogo: "",
  businessCategory: "",
  businessDescription: "",
};

const categories = [
  "E-commerce",
  "SaaS",
  "Professional services",
  "Creator business",
  "Marketplace",
  "Nonprofit",
  "Other",
];

const stepMeta = [
  {
    step: 1,
    label: "Personal",
    icon: UserRound,
  },
  {
    step: 2,
    label: "Business",
    icon: Building2,
  },
  {
    step: 3,
    label: "Verify",
    icon: MailCheck,
  },
] as const;

function createOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function readLogo(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read business logo."));
    reader.readAsDataURL(file);
  });
}

export function RegisterClient() {
  const router = useRouter();
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [step, setStep] = useState<Step>(1);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [otpCode, setOtpCode] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const activeStep = stepMeta.find((item) => item.step === step);

  const canContinue = useMemo(() => {
    if (step === 1) {
      return Boolean(
        values.firstName && values.lastName && isValidEmail(values.email),
      );
    }

    if (step === 2) {
      return Boolean(
        values.businessName &&
        values.businessCategory &&
        values.businessDescription,
      );
    }

    return otpInput.length === 6;
  }, [otpInput.length, step, values]);

  useEffect(() => {
    const address = getMerchantSessionAddress();

    if (!address) {
      router.replace("/sign-in");
      return;
    }

    setWalletAddress(address);
  }, [router]);

  function updateField(field: keyof FormValues, value: string) {
    setError(null);
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function updateOtpDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtpInput = otpInput.split("");
    nextOtpInput[index] = digit;

    setError(null);
    setOtpInput(nextOtpInput.join("").slice(0, 6));

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key !== "Backspace" || otpInput[index]) {
      return;
    }

    otpInputRefs.current[index - 1]?.focus();
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    setError(null);
    setOtpInput(pastedCode);
    otpInputRefs.current[Math.min(pastedCode.length, 5)]?.focus();
  }

  async function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Business logo must be an image file.");
      return;
    }

    const logo = await readLogo(file);
    updateField("businessLogo", logo);
  }

  async function sendOtp() {
    setIsSending(true);
    setError(null);

    const code = createOtpCode();
    sessionStorage.setItem("shade:merchant-registration-otp", code);
    setOtpCode(code);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSending(false);
  }

  async function goNext() {
    if (!canContinue) {
      setError("Please complete the required fields before continuing.");
      return;
    }

    if (step === 1) {
      if (!isValidEmail(values.email)) {
        setError("Enter a valid email address before continuing.");
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      await sendOtp();
      setStep(3);
    }
  }

  function goBack() {
    setError(null);

    if (step === 2) {
      setStep(1);
    }

    if (step === 3) {
      setStep(2);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!walletAddress) {
      setError("Please sign in with your wallet before registering.");
      return;
    }

    if (otpInput !== otpCode) {
      setError("The OTP code is incorrect.");
      return;
    }

    saveMerchantProfile({
      ...values,
      walletAddress,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    });

    setIsComplete(true);
    router.push("/dashboard");
  }

  if (!walletAddress) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase text-primary">
            Merchant onboarding
          </p>
          <h1 className="mt-3 text-3xl font-bold">Complete registration</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Set up your merchant profile so Shade can prepare your dashboard.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3">
          {stepMeta.map((item) => (
            <div
              key={item.step}
              className={`rounded-lg border p-3 ${
                step === item.step
                  ? "border-primary bg-secondary text-primary"
                  : "bg-card text-muted-foreground"
              }`}
            >
              <item.icon className="size-4" />
              <p className="mt-2 text-sm font-semibold">{item.label}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border bg-card p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            {activeStep ? (
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <activeStep.icon className="size-5" />
              </div>
            ) : null}
            <div>
              <p className="text-lg font-bold">
                {step === 1 && "Personal details"}
                {step === 2 && "Business details"}
                {step === 3 && "Email verification"}
              </p>
              <p className="text-sm text-muted-foreground">Step {step} of 3</p>
            </div>
          </div>

          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                First name
                <input
                  className="h-11 rounded-md border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={values.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Last name
                <input
                  className="h-11 rounded-md border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={values.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium sm:col-span-2">
                Email address
                <input
                  className="h-11 rounded-md border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                />
              </label>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium">
                Business name
                <input
                  className="h-11 rounded-md border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={values.businessName}
                  onChange={(event) =>
                    updateField("businessName", event.target.value)
                  }
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Business logo
                <input
                  className="rounded-md border bg-background px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Business category
                <select
                  className="h-11 rounded-md border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={values.businessCategory}
                  onChange={(event) =>
                    updateField("businessCategory", event.target.value)
                  }
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Business description
                <textarea
                  className="min-h-28 rounded-md border bg-background px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={values.businessDescription}
                  onChange={(event) =>
                    updateField("businessDescription", event.target.value)
                  }
                  required
                />
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4">
              <div className="rounded-lg border bg-secondary/60 p-4 text-sm text-muted-foreground">
                A verification code was sent to{" "}
                <span className="font-semibold text-foreground">
                  {values.email}
                </span>
                . Demo code:{" "}
                <span className="font-mono font-bold text-primary">
                  {otpCode}
                </span>
              </div>
              <label className="grid gap-2 text-sm font-medium">
                OTP code
                <div className="grid w-fit max-w-full grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        otpInputRefs.current[index] = element;
                      }}
                      aria-label={`OTP digit ${index + 1}`}
                      className="size-11 rounded-md border bg-background text-center font-mono text-lg font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:size-12"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpInput[index] ?? ""}
                      onChange={(event) =>
                        updateOtpDigit(index, event.target.value)
                      }
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      onPaste={handleOtpPaste}
                      required
                    />
                  ))}
                </div>
              </label>
            </div>
          ) : null}

          {error ? (
            <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={step === 1 || isSending || isComplete}
            >
              <ChevronLeft />
              Back
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={!canContinue || isSending}
              >
                {isSending ? <Loader2 className="animate-spin" /> : null}
                Continue
                <ChevronRight />
              </Button>
            ) : (
              <Button type="submit" disabled={!canContinue || isComplete}>
                {isComplete ? <BadgeCheck /> : <MailCheck />}
                Verify email
              </Button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
