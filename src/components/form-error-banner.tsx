import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export type FormErrorBannerProps = {
  message: string | null;
  className?: string;
};

export function FormErrorBanner({ message, className }: FormErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <Alert variant="destructive" className={cn(className)}>
      {message}
    </Alert>
  );
}
