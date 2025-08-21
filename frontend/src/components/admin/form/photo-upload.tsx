"use client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import type React from "react";

interface PhotoUploadProps {
  label: string;
  name: string;
  error?: string;
  selectedFiles?: (File | null)[] | File[];
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
  required?: boolean;
  mode?: "single" | "multiple" | "fixed";
  fixedSlots?: number;
  existingImages?: string[];
  onImageChange?:
  | ((index: number, file: File | null) => void)
  | ((files: File[]) => void);
  onRemoveExisting?: (index: number) => void;
  className?: string;
  disabled?: boolean;
}

const PhotoUpload = ({
  label,
  name,
  error,
  selectedFiles = [],
  maxFiles = 10,
  maxFileSize = 5,
  acceptedTypes = ["image/*"],
  mode = "multiple",
  fixedSlots = 4,
  existingImages = [],
  onImageChange,
  onRemoveExisting,
  className = "",
}: PhotoUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const supportedFormats = acceptedTypes
    .join(", ")
    .replace("image/*", "JPG, PNG, WEBP, SVG");

  // Helper function to handle removing items
  const handleRemove = (index: number) => {
    if (!onImageChange) return;

    if (mode === "fixed") {
      const callback = onImageChange as (
        index: number,
        file: File | null
      ) => void;
      callback(index, null);
    } else if (mode === "single") {
      // For single mode, if we have a new file, remove it
      if (selectedFiles[0]) {
        const callback = onImageChange as (files: File[]) => void;
        callback([]);
      }
      // If we have an existing image, call onRemoveExisting
      else if (existingImages.length > 0 && onRemoveExisting) {
        onRemoveExisting(0);
      }
    } else if (mode === "multiple") {
      const callback = onImageChange as (files: File[]) => void;
      const currentFiles = selectedFiles as File[];
      const newFiles = currentFiles.filter((_, i) => i !== index);
      callback(newFiles);
    }
  };

  // Simplified drag handlers
  const handleDragEvents = (
    e: React.DragEvent,
    type: "enter" | "leave" | "over"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "enter") setIsDragActive(true);
    if (type === "leave") setIsDragActive(false);
  };

  const handleFileDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(
      (file) =>
        acceptedTypes.some((type) =>
          type === "image/*"
            ? file.type.startsWith("image/") || file.type === "image/svg+xml"
            : file.type === type
        ) && file.size <= maxFileSize * 1024 * 1024
    );

    // Show error for invalid files
    const invalidFiles = files.filter(
      (file) =>
        !acceptedTypes.some((type) =>
          type === "image/*"
            ? file.type.startsWith("image/") || file.type === "image/svg+xml"
            : file.type === type
        ) || file.size > maxFileSize * 1024 * 1024
    );

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.map(f => f.name).join(', ')}. Only image files (including SVG) up to ${maxFileSize}MB are allowed.`);
    }

    if (mode === "fixed" && onImageChange) {
      // Fixed mode uses (index, file) callback
      const file = validFiles[0];
      if (file) {
        const callback = onImageChange as (
          index: number,
          file: File | null
        ) => void;
        callback(targetIndex ?? 0, file);
      }
    } else if ((mode === "single" || mode === "multiple") && onImageChange) {
      // Single/Multiple modes use (files) callback
      const callback = onImageChange as (files: File[]) => void;
      if (mode === "single") {
        callback(validFiles.slice(0, 1));
      } else {
        // Multiple mode - add files to array
        const currentFiles = selectedFiles as File[];
        const totalExistingCount = existingImages.length;
        const newFiles = [...currentFiles, ...validFiles];
        const totalCount = totalExistingCount + newFiles.length;

        if (!maxFiles || totalCount <= maxFiles) {
          callback(newFiles);
        } else {
          // Calculate how many more files we can add
          const availableSlots =
            maxFiles - totalExistingCount - currentFiles.length;
          if (availableSlots > 0) {
            callback([...currentFiles, ...validFiles.slice(0, availableSlots)]);
          } else {
            // Show warning that limit is reached
            toast.warning(
              `Cannot add more files. Maximum ${maxFiles} files allowed.`
            );
          }
        }
      }
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetIndex?: number
  ) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) =>
        acceptedTypes.some((type) =>
          type === "image/*"
            ? file.type.startsWith("image/") || file.type === "image/svg+xml"
            : file.type === type
        ) && file.size <= maxFileSize * 1024 * 1024
    );

    // Show error for invalid files
    const invalidFiles = files.filter(
      (file) =>
        !acceptedTypes.some((type) =>
          type === "image/*"
            ? file.type.startsWith("image/") || file.type === "image/svg+xml"
            : file.type === type
        ) || file.size > maxFileSize * 1024 * 1024
    );

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.map(f => f.name).join(', ')}. Only image files (including SVG) up to ${maxFileSize}MB are allowed.`);
    }

    if (mode === "fixed" && onImageChange) {
      // Fixed mode uses (index, file) callback
      const file = validFiles[0];
      if (file) {
        const callback = onImageChange as (
          index: number,
          file: File | null
        ) => void;
        callback(targetIndex ?? 0, file);
      }
    } else if ((mode === "single" || mode === "multiple") && onImageChange) {
      // Single/Multiple modes use (files) callback
      const callback = onImageChange as (files: File[]) => void;
      if (mode === "single") {
        callback(validFiles.slice(0, 1));
      } else {
        // Multiple mode - add files to array
        const currentFiles = selectedFiles as File[];
        const totalExistingCount = existingImages.length;
        const newFiles = [...currentFiles, ...validFiles];
        const totalCount = totalExistingCount + newFiles.length;

        if (!maxFiles || totalCount <= maxFiles) {
          callback(newFiles);
        } else {
          // Calculate how many more files we can add
          const availableSlots =
            maxFiles - totalExistingCount - currentFiles.length;
          if (availableSlots > 0) {
            callback([...currentFiles, ...validFiles.slice(0, availableSlots)]);
          } else {
            // Show warning that limit is reached
            toast.warning(
              `Cannot add more files. Maximum ${maxFiles} files allowed.`
            );
          }
        }
      }
    }

    e.target.value = "";
  };

  const getContainerClasses = (isActive = false) =>
    `bg-muted-background border-2 border-dashed rounded-lg transition-colors ${isActive
      ? "border-gold-400 bg-gold-500/10"
      : "border-gray-600 hover:border-gray-500"
    }`;

  // Common remove button
  const RemoveButton = ({
    onClick,
    size = "normal",
  }: {
    onClick: () => void;
    size?: "normal" | "small";
  }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`absolute ${size === "small"
        ? "top-1 right-1 w-4 h-4 text-xs"
        : "top-2 right-2 w-6 h-6 text-sm"
        } 
        bg-red-500 text-white rounded-full flex items-center justify-center 
        hover:bg-red-600 transition-colors z-10 shadow-lg hover:shadow-xl`}
      title="Remove image"
    >
      ×
    </button>
  );

  // Fixed mode (for hero section)
  if (mode === "fixed") {
    return (
      <div className={`w-full ${className}`}>
        <label className="block mb-4 text-sm font-medium text-gray-200">
          {label}
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: fixedSlots }).map((_, index) => {
            const newFile = selectedFiles[index];
            const existingImage = existingImages[index];
            const hasContent =
              newFile instanceof File ||
              (existingImage && existingImage.trim() !== "");

            return (
              <div key={index} className="space-y-2">
                <div
                  className={`aspect-square ${getContainerClasses(
                    isDragActive
                  )} 
                    flex flex-col items-center justify-center p-2 relative overflow-hidden
                    group cursor-pointer`}
                  onDragEnter={(e) => handleDragEvents(e, "enter")}
                  onDragLeave={(e) => handleDragEvents(e, "leave")}
                  onDragOver={(e) => handleDragEvents(e, "over")}
                  onDrop={(e) => handleFileDrop(e, index)}
                >
                  {hasContent ? (
                    <>
                      <Image
                        src={
                          newFile instanceof File
                            ? URL.createObjectURL(newFile)
                            : existingImage!
                        }
                        alt={`Image ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <RemoveButton onClick={() => handleRemove(index)} />
                    </>
                  ) : (
                    <label
                      htmlFor={`${name}_${index}`}
                      className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-gray-800/50 transition-colors rounded"
                    >
                      <div className="text-gold-400 mb-2 text-3xl font-light">
                        +
                      </div>
                      <p className="text-xs text-gray-400 text-center">
                        Add Image {index + 1}
                      </p>
                      <p className="text-xs text-gray-500 text-center mt-1">
                        Drag or click
                      </p>
                    </label>
                  )}

                  <input
                    type="file"
                    id={`${name}_${index}`}
                    onChange={(e) => handleFileSelect(e, index)}
                    className="hidden"
                    accept={acceptedTypes.join(",")}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-xs text-gray-400">
          Supported formats: {supportedFormats} (Max {maxFileSize}MB each)
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  }

  // Single mode
  if (mode === "single") {
    const hasNewFile = selectedFiles[0] instanceof File;
    const hasExistingImage = existingImages.length > 0 && !hasNewFile;

    return (
      <div className={`w-full ${className}`}>
        <label className="block mb-4 text-sm font-medium text-gray-200">
          {label}
        </label>

        <div
          className={`w-full text-gray-100 px-4 py-8 outline-none 
            ${getContainerClasses(
            isDragActive
          )} flex flex-col items-center justify-center min-h-[200px]`}
          onDragEnter={(e) => handleDragEvents(e, "enter")}
          onDragLeave={(e) => handleDragEvents(e, "leave")}
          onDragOver={(e) => handleDragEvents(e, "over")}
          onDrop={(e) => handleFileDrop(e)}
        >
          {/* Show new file if selected */}
          {hasNewFile && (
            <div className="mb-6 w-full flex justify-center">
              <div className="relative">
                <Image
                  src={URL.createObjectURL(selectedFiles[0]!)}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="w-30 h-30 object-cover rounded border-2 border-gray-600"
                  unoptimized
                />
                <RemoveButton onClick={() => handleRemove(0)} />
              </div>
            </div>
          )}

          {/* Show existing image if no new file */}
          {hasExistingImage && (
            <div className="mb-6 w-full flex justify-center">
              <div className="relative">
                <Image
                  src={existingImages[0]}
                  alt="Current image"
                  width={120}
                  height={120}
                  className="w-30 h-30 object-cover rounded border-2 border-gray-600"
                  unoptimized
                />
                <RemoveButton onClick={() => handleRemove(0)} />
              </div>
            </div>
          )}

          <input
            type="file"
            name={name}
            onChange={(e) => handleFileSelect(e)}
            className="hidden"
            id={name}
            accept={acceptedTypes.join(",")}
          />

          <label htmlFor={name} className="text-center cursor-pointer">
            <p className="text-lg mb-2 text-gray-100">
              {isDragActive
                ? "Drop your image here"
                : hasNewFile || hasExistingImage
                  ? "Change image"
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

  // Multiple mode
  return (
    <div className={`w-full ${className}`}>
      <label className="block mb-4 text-sm font-medium text-gray-200">
        {label}
      </label>

      {/* File Input Area with existing and new images */}
      <div
        className={`w-full text-gray-100 px-4 py-6 outline-none 
          ${getContainerClasses(
          isDragActive
        )} flex flex-col items-center justify-center min-h-[120px]`}
        onDragEnter={(e) => handleDragEvents(e, "enter")}
        onDragLeave={(e) => handleDragEvents(e, "leave")}
        onDragOver={(e) => handleDragEvents(e, "over")}
        onDrop={(e) => handleFileDrop(e)}
      >
        {/* Show existing and selected images if any */}
        {(selectedFiles.some((file) => file) || existingImages.length > 0) && (
          <div className="w-full mb-6">
            <p className="text-sm font-medium text-gray-300 mb-3 text-center">
              Images (
              {selectedFiles.filter((f) => f).length + existingImages.length})
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {/* Show existing images first */}
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                    <Image
                      src={image}
                      alt={`Current image ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  {onRemoveExisting && (
                    <RemoveButton
                      onClick={() => onRemoveExisting(index)}
                      size="small"
                    />
                  )}
                  <p className="text-[9px] text-gray-400 text-center mt-1 truncate">
                    Current
                  </p>
                </div>
              ))}

              {/* Show selected files after existing images */}
              {selectedFiles.map((file, index) =>
                file ? (
                  <div key={`selected-${index}`} className="relative group">
                    <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Selected image ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <RemoveButton
                      onClick={() => handleRemove(index)}
                      size="small"
                    />

                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        <input
          type="file"
          name={name}
          onChange={(e) => handleFileSelect(e)}
          className="hidden"
          id={name}
          accept={acceptedTypes.join(",")}
          multiple
        />

        <label htmlFor={name} className="text-center cursor-pointer">
          <div className="text-gold-400 mb-2 text-3xl font-light">+</div>
          <p className="text-lg mb-2 text-gray-100">
            {isDragActive
              ? "Drop your images here"
              : "Drag or click to upload images"}
          </p>
          <p className="text-sm text-gray-400">
            Supported formats: {supportedFormats} (Max {maxFileSize}MB each)
          </p>
          {maxFiles && (
            <p className="text-xs text-gray-500 mt-1">
              Max {maxFiles} files,{" "}
              {selectedFiles.filter((f) => f).length + existingImages.length}{" "}
              total
            </p>
          )}
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default PhotoUpload;
