"use client";
import Image from "next/image";
import { useState } from "react";

interface PhotoUploadProps {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

const PhotoUpload = ({
  label,
  name,
  onChange,
  error,
  selectedFiles,
  onRemoveFile,
  maxFiles = 10,
  maxFileSize = 5,
  acceptedTypes = ["image/*"],
}: PhotoUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const isMaxReached = selectedFiles.length >= maxFiles;
  const supportedFormats = acceptedTypes
    .join(", ")
    .replace("image/*", "JPG, PNG");

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMaxReached) {
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

    if (isMaxReached) return;

    const files = Array.from(e.dataTransfer.files);

    // Filter files based on accepted types
    const validFiles = files.filter(file => {
      return acceptedTypes.some(type => {
        if (type === "image/*") {
          return file.type.startsWith("image/");
        }
        return file.type === type;
      });
    });

    if (validFiles.length > 0) {
      // Create a synthetic event to pass to the onChange handler
      const dt = new DataTransfer();
      validFiles.forEach(f => dt.items.add(f));
      const fileList = dt.files;

      const syntheticEvent = {
        target: {
          files: fileList,
          name: name,
          value: '',
        },
        currentTarget: {
          files: fileList,
          name: name,
          value: '',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
        {label} <span className="text-red-500">*</span>
      </label>

      <div
        className={`w-full bg-muted-background text-gray-100 px-3 md:px-4 py-8 md:py-12 outline-none rounded border-2 border-dashed ${isDragActive
          ? "border-blue-400 bg-blue-50/10"
          : "border-gray-600"
          } flex flex-col items-center justify-center min-h-[200px] transition-colors`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Photo Preview Grid */}
        <div className="mb-6 w-full">
          <div className="flex gap-2 justify-center">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group aspect-square w-18 h-18">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded border-2 border-gray-600"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Add Button */}
            {!isMaxReached && (
              <label
                htmlFor={name}
                className="aspect-square border-2 border-dashed border-primary text-primary flex items-center justify-center rounded cursor-pointer hover:bg-primary/10 transition-colors h-18 w-18"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">+</div>
                  <div className="text-xs">Add</div>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* File Input */}
        <input
          type="file"
          name={name}
          onChange={onChange}
          className="hidden"
          id={name}
          multiple
          accept={acceptedTypes.join(",")}
          disabled={isMaxReached}
        />

        {/* Upload Label */}
        <label
          htmlFor={isMaxReached ? undefined : name}
          className={`text-center ${isMaxReached ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
        >
          <p className="text-lg mb-2">
            {isMaxReached
              ? `Maximum ${maxFiles} photos reached`
              : isDragActive
                ? "Drop your images here"
                : "Drag or upload your images here"}
          </p>
          <p className="text-sm text-gray-400">
            Supported formats: {supportedFormats} (Max {maxFileSize}MB each) -{" "}
            {selectedFiles.length}/{maxFiles} photos
          </p>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PhotoUpload;