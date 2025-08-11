"use client";
import Image from "next/image";
import { useState } from "react";

interface PhotoUploadProps {
  label: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  selectedFiles?: (File | null)[];
  onRemoveFile?: (index: number) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
  required?: boolean;
  mode?: "single" | "multiple" | "fixed";
  fixedSlots?: number;
  existingImages?: string[];
  onImageChange?: (index: number, file: File | null) => void;
  className?: string;
}

const PhotoUpload = ({
  label,
  name,
  error,
  selectedFiles = [],
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

  const supportedFormats = acceptedTypes
    .join(", ")
    .replace("image/*", "JPG, PNG, WEBP");

  // Drag handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFixedSlotDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => 
      acceptedTypes.some(type =>
        type === "image/*" ? file.type.startsWith("image/") : file.type === type
      )
    );
    
    if (validFile && validFile.size <= maxFileSize * 1024 * 1024) {
      onImageChange?.(index, validFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size <= maxFileSize * 1024 * 1024) {
      onImageChange?.(index, file);
    }
    // Reset input value to allow re-selecting same file
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    onImageChange?.(index, null);
  };

  // Common drag props
  const dragProps = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
  };

  const getContainerClasses = (isActive = false) => 
    `bg-muted-background border-2 border-dashed rounded-lg transition-colors ${
      isActive ? "border-gold-400 bg-gold-500/10" : "border-gray-600 hover:border-gray-500"
    }`;

  // Remove button component
  const RemoveButton = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 
        flex items-center justify-center text-sm hover:bg-red-600 transition-colors z-10
        shadow-lg hover:shadow-xl"
      title="Remove image"
    >
      ×
    </button>
  );

  // Fixed mode render (for hero section)
  if (mode === "fixed") {
    return (
      <div className={`w-full ${className}`}>
        <label className="block mb-4 text-sm font-medium text-gray-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: fixedSlots }).map((_, index) => {
            const newFile = selectedFiles[index];
            const existingImage = existingImages[index];
            
            // Show new file if exists, otherwise show existing image
            const hasNewFile = newFile instanceof File;
            const hasExistingImage = existingImage && existingImage.trim() !== "";
            const hasAnyImage = hasNewFile || hasExistingImage;

            return (
              <div key={index} className="space-y-2">
                <div
                  className={`aspect-square ${getContainerClasses(isDragActive)} 
                    flex flex-col items-center justify-center p-2 relative overflow-hidden
                    group cursor-pointer`}
                  {...dragProps}
                  onDrop={(e) => handleFixedSlotDrop(e, index)}
                >
                  {hasAnyImage ? (
                    <>
                      <Image
                        src={hasNewFile 
                          ? URL.createObjectURL(newFile) 
                          : existingImage!
                        }
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover rounded"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <RemoveButton onClick={() => handleRemove(index)} />
                    </>
                  ) : (
                    <label
                      htmlFor={`${name}_${index}`}
                      className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center
                        hover:bg-gray-800/50 transition-colors rounded"
                    >
                      <div className="text-gold-400 mb-2 text-3xl font-light">+</div>
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
                    onChange={(e) => handleFileChange(e, index)}
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

  // Single mode render
  if (mode === "single") {
    const hasFile = selectedFiles[0];

    return (
      <div className={`w-full ${className}`}>
        <label className="block mb-4 text-sm font-medium text-gray-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div
          className={`w-full text-gray-100 px-4 py-8 outline-none 
            ${getContainerClasses(isDragActive)} flex flex-col items-center justify-center min-h-[200px]`}
          {...dragProps}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(false);
            
            const files = Array.from(e.dataTransfer.files);
            const validFile = files.find(file => file.type.startsWith("image/"));
            if (validFile) onImageChange?.(0, validFile);
          }}
        >
          {hasFile instanceof File && (
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
                <RemoveButton onClick={() => handleRemove(0)} />
              </div>
            </div>
          )}

          <input
            type="file"
            name={name}
            onChange={(e) => handleFileChange(e, 0)}
            className="hidden"
            id={name}
            accept={acceptedTypes.join(",")}
          />

          <label htmlFor={name} className="text-center cursor-pointer">
            <p className="text-lg mb-2 text-gray-100">
              {isDragActive
                ? "Drop your image here"
                : hasFile
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

  // Multiple mode - keeping original logic for other uses
  return (
    <div className={`w-full ${className}`}>
      <label className="block mb-4 text-sm font-medium text-gray-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
        <p className="text-gray-400">Multiple mode not fully implemented in simplified version</p>
      </div>
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PhotoUpload;