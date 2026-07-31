"use client";

import type { LucideIcon } from "lucide-react";

export type StepperStep = {
  step: number;
  label: string;
  icon: LucideIcon;
};

export type StepperProps = {
  steps: readonly StepperStep[];
  currentStep: number;
};

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="mb-6 grid grid-cols-3 gap-3">
      {steps.map((item) => (
        <div
          key={item.step}
          className={`rounded-lg border p-3 ${
            currentStep === item.step
              ? "border-primary bg-secondary text-primary"
              : "bg-card text-muted-foreground"
          }`}
        >
          <item.icon className="size-4" />
          <p className="mt-2 text-sm font-semibold">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
