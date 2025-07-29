import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 ease-out transform shadow-lg hover:shadow-2xl px-8 py-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-yellow-950 hover:bg-white hover:cursor-pointer",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Separate children into text + others (e.g., icon)
    const childrenArray = React.Children.toArray(children)
    const textChild = childrenArray.find(
      (child) => typeof child === "string"
    )
    const otherChildren = childrenArray.filter(
      (child) => child !== textChild
    )

    const isDefaultVariant = variant === "default"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isDefaultVariant ? (
          <div className="relative flex items-center justify-center w-full h-full gap-2">
            <span className="block transform translate-x-0 group-hover:translate-x-[300%] transition-transform duration-300 ease-out">
              {textChild}
            </span>
            <span className="absolute inset-0 flex items-center justify-center transform -translate-x-[300%] group-hover:translate-x-0 transition-transform duration-300 ease-out">
              {textChild}
            </span>
            {otherChildren.length > 0 && (
              <span className="z-10">{otherChildren}</span>
            )}
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
