"use client";

interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
}

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = "",
  helpText,
}: InputProps) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block mb-4 md:mb-2 text-sm md:text-base font-medium"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-muted-background text-gray-100 px-6 md:px-6 py-4 md:py-6 outline-none rounded
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}`}
      />

      {helpText && (
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
          {helpText}
        </p>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
