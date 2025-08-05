"use client";
import Image from "next/image";

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
  const isMaxReached = selectedFiles.length >= maxFiles;
  const supportedFormats = acceptedTypes
    .join(", ")
    .replace("image/*", "JPG, PNG");

  return (
    <div className="w-full">
      <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="w-full bg-muted-background text-gray-100 px-3 md:px-4 py-8 md:py-12 outline-none rounded border-2 border-dashed border-gray-600 flex flex-col items-center justify-center min-h-[200px]">
        {/* Photo Preview Grid */}
        {selectedFiles.length > 0 && (
          <div className="mb-6 w-full">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
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
                    onClick={() => onRemoveFile(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
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

        {/* Upload Label */}
        <label
          htmlFor={name}
          className={`cursor-pointer text-center ${
            isMaxReached ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <p className="text-lg mb-2">
            {isMaxReached
              ? `Maximum ${maxFiles} photos reached`
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
