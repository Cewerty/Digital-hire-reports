import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-40 dark:focus-visible:ring-offset-[#191919] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#F2CA52] text-[#1E2028] shadow-xs hover:bg-[#E5BA41] dark:bg-[#F2CA52] dark:text-[#1E2028] dark:shadow-none dark:hover:bg-[#E5BA41]",
        destructive:
          "border border-transparent bg-rose-600 text-white hover:bg-rose-700 dark:border-rose-800/50 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-950/80",
        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 dark:border-[#2E2E2E] dark:bg-[#252525] dark:text-[#E3E3E3] dark:shadow-none dark:hover:border-[#3E4252] dark:hover:bg-[#2F2F2F]",
        secondary:
          "border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-[#3A3A3A] dark:bg-[#2F2F2F] dark:text-[#E3E3E3] dark:shadow-none dark:hover:bg-[#383838]",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#9B9B9B] dark:hover:bg-[#2F2F2F] dark:hover:text-[#E3E3E3]",
        link: "text-[#8A6A12] underline-offset-4 hover:underline dark:text-[#F2CA52]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
