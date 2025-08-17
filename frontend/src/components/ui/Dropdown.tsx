"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Button */}
      <div className="pb-3">
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          className="py-2 "
        >
          <span className="text-sm text-[16px]">Sort By: {selected}</span>
          <i className="ri-arrow-down-s-line text-base" />
        </Button>
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute right-0 -mt-1 bg-[#12110D] z-50 rounded-md">
          {options.map((option, idx) => (
            <React.Fragment key={option}>
              <p
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                className="px-4 py-2 text-sm text-white text-center cursor-pointer"
              >
                {option}
              </p>

              {/* Custom divider (shorter) */}
              {idx < options.length - 1 && (
                <div className="mx-4 border-t border-gray-400"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
