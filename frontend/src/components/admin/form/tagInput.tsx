import { useState } from "react";
import type React from "react";


interface TagsInputProps {
  label: string;
  name: string;
  values: string[];
  onChange: (newTags: string[]) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const TagsInput = ({
  label,
  name,
  values,
  onChange,
  placeholder,
  error,
  required = true,
}: TagsInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!values.includes(inputValue.trim())) {
        onChange([...values, inputValue.trim()]);
      }
      setInputValue("");
    }
    if (e.key === "Backspace" && !inputValue && values.length > 0) {
      // delete last tag
      onChange(values.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(values.filter((t) => t !== tag));
  };

  return (
    <div className="w-full">
      <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex flex-wrap items-center gap-2 w-full bg-muted-background text-gray-100 px-6 md:px-6 py-4 md:py-6 rounded min-h-[60px]">
        {values.map((tag, idx) => (
          <span
            key={idx}
            className="flex items-center gap-2 bg-gold-500 text-black px-3 py-1 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-xs text-black hover:text-red-600 font-bold"
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          name={name}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type and press Enter"}
          className="flex-grow bg-transparent outline-none text-gray-100 py-1 min-w-[200px]"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TagsInput;
