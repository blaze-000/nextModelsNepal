import React, { useState, useRef, useEffect } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  required = false,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (optionValue: string) => {
    // Create a synthetic event to match the expected onChange signature
    const syntheticEvent = {
      target: {
        name,
        value: optionValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block mb-4 md:mb-2 text-sm md:text-base font-medium"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative" ref={dropdownRef}>
        {/* Custom Select Button */}
        <button
          type="button"
          id={name}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full bg-muted-background text-gray-100 px-6 md:px-6 py-4 md:py-6 outline-none rounded
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-between cursor-pointer
            ${error ? "border border-red-500" : ""}
            ${className}`}
        >
          <span className={selectedOption ? "text-gray-100" : "text-gray-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Custom Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-muted-background rounded shadow-xl border border-gray-600 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option.value)}
                className="w-full text-left px-6 py-3 text-gray-100 hover:bg-gray-700 transition-colors duration-150 focus:bg-gray-700 focus:outline-none"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
