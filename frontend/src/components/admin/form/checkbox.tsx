"use client";

interface CheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  disabled = false,
  className = "",
}: CheckboxProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 text-gold-500 bg-muted-background border-gray-600 rounded 
            focus:ring-2 focus:ring-gold-500 disabled:cursor-not-allowed disabled:opacity-50
            ${className}`}
        />
        <label
          htmlFor={name}
          className={`ml-3 text-sm md:text-base font-medium text-gray-100
            ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          {label}
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Checkbox;
