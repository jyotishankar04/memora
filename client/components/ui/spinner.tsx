import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react";
import { LoaderCircleIcon as Loader2Icon } from "@hugeicons/core-free-icons";

function Spinner({ className, ...props }: Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">) {
  return (
    <HugeiconsIcon icon={Loader2Icon} strokeWidth={2.25} data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
