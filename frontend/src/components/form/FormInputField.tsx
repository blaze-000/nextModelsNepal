import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

export type FormInputFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  containerClassName?: string;
  labelHidden?: boolean;
} & Omit<ComponentProps<typeof Input>, "name">;

export function FormInputField<T extends FieldValues>(
  {
    label,
    name,
    register,
    error,
    containerClassName,
    labelHidden = false,
    className,
    ...rest
  }: FormInputFieldProps<T>,
) {
  return (
    <label className={cn("flex flex-col", containerClassName)}>
      <span className={cn("text-foreground/70 text-sm", labelHidden && "sr-only")}>
        {label}
      </span>
      <Input
        {...register(name)}
        {...rest}
        className={cn("bg-background2 mt-1 border border-gray-600 px-3 py-2", className)}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </label>
  );
}

