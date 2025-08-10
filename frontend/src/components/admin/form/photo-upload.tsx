"use client";
import Image from "next/image";
import { useState } from "react";

interface PhotoUploadProps {
  label: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
  required?: boolean;
  // New props for enhanced functionality
  mode?: "single" | "multiple" | "fixed";
  fixedSlots?: number;
  existingImages?: string[];
  onImageChange?: (index: number, file: File | null) => void;
  className?: string;
}

const PhotoUpload = ({
  label,
  name,
  onChange,
  error,
  selectedFiles = [],
  onRemoveFile,
  maxFiles = 10,
  maxFileSize = 5,
  acceptedTypes = ["image/*"],
  required = false,
  mode = "multiple",
  fixedSlots = 4,
  existingImages = [],
  onImageChange,
  className = "",
}: PhotoUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const isMaxReached =
    mode === "single"
      ? selectedFiles.length >= 1
      : selectedFiles.length >= maxFiles;
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
    const validFiles = files.filter((file) => {
      return acceptedTypes.some((type) => {
        if (type === "image/*") {
          return file.type.startsWith("image/");
        }
        return file.type === type;
      });
    });

    if (validFiles.length > 0 && onChange) {
      if (mode === "single") {
        // For single mode, only take the first file
        const dt = new DataTransfer();
        dt.items.add(validFiles[0]);
        const fileList = dt.files;

        const syntheticEvent = {
          target: { files: fileList, name: name, value: "" },
          currentTarget: { files: fileList, name: name, value: "" },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      } else {
        const dt = new DataTransfer();
        validFiles.forEach((f) => dt.items.add(f));
        const fileList = dt.files;

        const syntheticEvent = {
          target: { files: fileList, name: name, value: "" },
          currentTarget: { files: fileList, name: name, value: "" },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      }
    }
  };

  const handleFixedSlotChange = (index: number, file: File | null) => {
    if (onImageChange) {
      onImageChange(index, file);
    }
  };

  const handleFixedSlotDrop = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find((file) => file.type.startsWith("image/"));

    if (validFile) {
      handleFixedSlotChange(index, validFile);
    }
  };

  // Render for fixed mode (like hero images)
  if (mode === "fixed") {
    return (
      <div className={`w-full ${className}`}>
        <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: fixedSlots }).map((_, index) => {
            const hasFile = selectedFiles[index];
            const hasExisting = existingImages[index];

            return (
              <div key={index} className="space-y-2">
                <div
                  className={`aspect-square bg-muted-background border-2 border-dashed rounded-lg
                    ${
                      isDragActive
                        ? "border-gold-400 bg-gold-500/10"
                        : "border-gray-600"
                    }
                    flex flex-col items-center justify-center p-4 transition-colors relative overflow-hidden`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleFixedSlotDrop(e, index)}
                >
                  {hasFile ? (
                    <>
                      <Image
                        src={URL.createObjectURL(hasFile)}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleFixedSlotChange(index, null)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 
                          flex items-center justify-center text-sm hover:bg-red-600 transition-colors z-10"
                      >
                        ×
                      </button>
                    </>
                  ) : hasExisting ? (
                    <>
                      <Image
                        src={hasExisting}
                        alt={`Existing ${index + 1}`}
                        fill
                        className="object-cover rounded"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label
                          htmlFor={`${name}_${index}`}
                          className="text-white text-sm cursor-pointer bg-gold-500/80 px-3 py-1 rounded"
                        >
                          Replace
                        </label>
                      </div>
                    </>
                  ) : (
                    <label
                      htmlFor={`${name}_${index}`}
                      className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center"
                    >
                      <div className="text-gold-400 mb-2 text-2xl">+</div>
                      <p className="text-xs text-gray-400 text-center">
                        Image {index + 1}
                      </p>
                    </label>
                  )}

                  <input
                    type="file"
                    id={`${name}_${index}`}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFixedSlotChange(index, file);
                    }}
                    className="hidden"
                    accept={acceptedTypes.join(",")}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Render for single mode
  if (mode === "single") {
    const hasFile = selectedFiles[0];

    return (
      <div className={`w-full ${className}`}>
        <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div
          className={`w-full bg-muted-background text-gray-100 px-4 py-8 md:py-12 outline-none rounded border-2 border-dashed 
            ${
              isDragActive
                ? "border-gold-400 bg-gold-500/10"
                : "border-gray-600"
            }
            flex flex-col items-center justify-center min-h-[200px] transition-colors`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {hasFile && (
            <div className="mb-6 w-full flex justify-center">
              <div className="relative">
                <Image
                  src={URL.createObjectURL(hasFile)}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="w-30 h-30 object-cover rounded border-2 border-gray-600"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => onRemoveFile && onRemoveFile(0)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 
                    flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <input
            type="file"
            name={name}
            onChange={onChange}
            className="hidden"
            id={name}
            accept={acceptedTypes.join(",")}
            disabled={isMaxReached}
          />

          <label
            htmlFor={isMaxReached ? undefined : name}
            className={`text-center ${
              isMaxReached ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <p className="text-lg mb-2 text-gray-100">
              {isMaxReached
                ? "Image selected"
                : isDragActive
                ? "Drop your image here"
                : "Drag or upload your image here"}
            </p>
            <p className="text-sm text-gray-400">
              Supported formats: {supportedFormats} (Max {maxFileSize}MB)
            </p>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Default multiple mode (original functionality)
  return (
    <div className={`w-full ${className}`}>
      <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`w-full bg-muted-background text-gray-100 px-4 py-8 md:py-12 outline-none rounded border-2 border-dashed 
          ${isDragActive ? "border-gold-400 bg-gold-500/10" : "border-gray-600"}
          flex flex-col items-center justify-center min-h-[200px] transition-colors`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Photo Preview Grid */}
        {selectedFiles.length > 0 && (
          <div className="mb-6 w-full">
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group aspect-square">
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
                    onClick={() => onRemoveFile && onRemoveFile(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 
                      flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Upload Area */}
        <label
          htmlFor={isMaxReached ? undefined : name}
          className={`text-center ${
            isMaxReached ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <p className="text-lg mb-2 text-gray-100">
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
