import React from "react";
import Image from "next/image";

export function PublicPaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center px-4 py-12 sm:px-6 md:px-12">
      <header className="w-full max-w-md mb-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Image
            src="/shade_logo_transparent.png"
            alt="Shade Logo"
            width={32}
            height={32}
            className="shrink-0"
          />
          <span className="font-bold text-xl text-foreground tracking-tight">
            Shade
          </span>
        </div>
      </header>
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
