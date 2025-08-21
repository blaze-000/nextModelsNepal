"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";

interface DropdownProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  maxHeight?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  label,
  selected,
  onSelect,
  maxHeight = "200px",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setShowGradient(scrollHeight > clientHeight);
    }
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Button */}
      <div className="pb-5">
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          className="py-2 min-w-2xs"
        >
          <span className="text-sm text-[16px]">
            {label}: <span className="text-gold-500">{selected}</span>
          </span>
          <i className="ri-arrow-down-s-line text-base" />
        </Button>
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute right-0 -mt-1 bg-[#1E1E1E] z-10  rounded shadow-lg hover:text-gold-500 overflow-hidden">
          <div
            ref={contentRef}
            className="overflow-y-auto"
            style={{ maxHeight }}
          >
            {[...options]
              .sort((a, b) => {
                if (a === "All") return -1;
                if (b === "All") return 1;
                return a.localeCompare(b);
              })
              .map((option, idx, sortedOptions) => (
                <React.Fragment key={option}>
                  <p
                    onClick={() => {
                      onSelect(option);
                      setOpen(false);
                    }}
                    className={`relative px-4 py-2 text-sm text-white text-center cursor-pointer ${
                      selected === option ? "text-gold-500" : ""
                    }`}
                  >
                    {option}

                    {idx < sortedOptions.length - 1 && (
                      <span className="absolute bottom-0 left-4 right-4 h-px bg-[#4b4a4a]" />
                    )}
                  </p>
                </React.Fragment>
              ))}
          </div>

          {showGradient && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#12110D] to-transparent pointer-events-none" />
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
