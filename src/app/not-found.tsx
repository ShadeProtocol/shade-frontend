import Link from "next/link";
import { Compass, LayoutDashboard, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Compass className="size-6" />
          </div>
          <p className="mt-5 text-sm font-semibold text-primary">404</p>
          <h1 className="mt-1 text-3xl font-bold">Page not found</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <Button className="w-full" size="lg" asChild>
              <Link href="/dashboard">
                <LayoutDashboard />
                Go to dashboard
              </Link>
            </Button>
            <Button className="w-full" size="lg" variant="outline" asChild>
              <Link href="/sign-in">
                <LogIn />
                Sign in
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Logo size="sm" />
        </div>
      </section>
    </main>
  );
}
