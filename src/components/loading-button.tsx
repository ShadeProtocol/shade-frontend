import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean
  icon?: React.ReactNode
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, isLoading, icon, children, disabled, ...props }, ref) => {
    return (
      <Button
        className={className}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : icon}
        {children}
      </Button>
    )
  }
)
LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
