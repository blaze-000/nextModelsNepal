"use client";
import Image from "next/image";
import { useState } from "react";
import type React from "react";

interface IconUploadProps {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  selectedFile?: File;
  onRemoveFile: () => void;
  maxFileSize?: number;
  acceptedTypes?: string[];
  required?: boolean;
}

const IconUpload = ({
  label,
  name,
  onChange,
  error,
  selectedFile,
  onRemoveFile,
  maxFileSize = 2,
  acceptedTypes = ["image/*"],
  required = false,
}: IconUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const hasFile = !!selectedFile;
  const supportedFormats = acceptedTypes
    .join(", ")
    .replace("image/*", "PNG, SVG, ICO");

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasFile) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (hasFile) return;

    const files = Array.from(e.dataTransfer.files);
    const file = files[0]; // Only take the first file for icon

    if (file) {
      const isValidType = acceptedTypes.some((type) => {
        if (type === "image/*") {
          return file.type.startsWith("image/");
        }
        return file.type === type;
      });

      if (isValidType) {
        const dt = new DataTransfer();
        dt.items.add(file);
        const fileList = dt.files;

        const syntheticEvent = {
          target: { files: fileList, name: name, value: "" },
          currentTarget: { files: fileList, name: name, value: "" },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`w-full bg-muted-background text-gray-100 px-4 py-6 outline-none rounded border-2 border-dashed 
          ${isDragActive ? "border-gold-400 bg-gold-500/10" : "border-gray-600"}
          flex flex-col items-center justify-center min-h-[180px] transition-colors`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Icon Preview */}
        {selectedFile && (
          <div className="mb-4">
            <div className="relative group">
              <div className="w-20 h-20 border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Icon preview"
                  width={60}
                  height={60}
                  className="max-w-full max-h-full object-contain"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={onRemoveFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 
                  flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-md"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
              {selectedFile.name}
            </p>
          </div>
        )}

        {/* File Input */}
        <input
          type="file"
          name={name}
          onChange={onChange}
          className="hidden"
          id={name}
          accept={acceptedTypes.join(",")}
          disabled={hasFile}
        />

        {/* Upload Area */}
        <label
          htmlFor={hasFile ? undefined : name}
          className={`text-center ${
            hasFile ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <p className="text-base text-gray-100 mb-2">
            {hasFile
              ? "Icon uploaded successfully"
              : isDragActive
              ? "Drop your icon here"
              : "Drag or upload an icon here"}
          </p>
          <p className="text-sm text-gray-400">
            Supported formats: {supportedFormats} (Max {maxFileSize}MB)
          </p>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default IconUpload;
