"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Model {
  name: string;
  location: string;
  image: string;
  link?: string;
}

interface ModelDropdownProps {
  label: string;
  value: string;
  onChange: (modelName: string) => void;
  error?: string;
  placeholder?: string;
  femaleModels: Model[];
  maleModels: Model[];
}

const ModelDropdown = ({
  label,
  value,
  onChange,
  error,
  placeholder = "Select a model",
  femaleModels,
  maleModels,
}: ModelDropdownProps) => {
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

  const handleModelSelect = (modelName: string) => {
    onChange(modelName);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
        {label}
      </label>

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-muted-background text-gray-100 px-6 md:px-6 py-4 md:py-6 outline-none rounded flex items-center justify-between hover:bg-opacity-80 transition-colors"
      >
        <span className={value ? "text-gray-100" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <i
          className={`ri-arrow-down-s-line text-xl transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-muted-background rounded shadow-xl overflow-hidden">
          {/* Headers */}
          <div className="flex">
            <div className="flex-1 px-4 py-3 bg-muted-background">
              <h4 className="text-gold-500 text-sm font-medium">
                Female Models
              </h4>
            </div>
            <div className="flex-1 px-4 py-3 bg-muted-background">
              <h4 className="text-gold-500 text-sm font-medium">Male models</h4>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-80 overflow-y-auto">
            <div className="grid grid-cols-2">
              {/* Female Models Column */}
              <div className="border-r border-gray-700">
                {femaleModels.map((model, index) => (
                  <div key={`female-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleModelSelect(model.name)}
                      className="w-full text-left p-4 transition-all duration-200 flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={model.image}
                          alt={model.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1  min-w-0">
                        <div className="text-white text-sm font-medium truncate transition-transform duration-200 group-hover:translate-x-2">
                          {model.name}
                        </div>
                      </div>
                    </button>
                    {index < femaleModels.length - 1 && (
                      <div className="border-b border-gray-600 mx-4"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Male Models Column */}
              <div>
                {maleModels.map((model, index) => (
                  <div key={`male-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleModelSelect(model.name)}
                      className="w-full text-left p-4 transition-all duration-200 flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={model.image}
                          alt={model.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate transition-transform duration-200 group-hover:translate-x-2">
                          {model.name}
                        </div>
                      </div>
                    </button>
                    {index < maleModels.length - 1 && (
                      <div className="border-b border-gray-600 mx-4"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default ModelDropdown;
