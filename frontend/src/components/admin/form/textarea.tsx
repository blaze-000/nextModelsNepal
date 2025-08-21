"use client";

import type React from "react";
interface TextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = "",
}: TextareaProps) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block mb-4 md:mb-2 text-sm md:text-base font-medium"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full bg-muted-background text-gray-100 px-6 md:px-6 py-4 outline-none resize-none rounded
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Textarea;
