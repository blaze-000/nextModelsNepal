"use client";

import { motion, AnimatePresence } from "framer-motion";
import type React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-6xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${sizeClasses[size]} bg-background2 rounded-lg shadow-xl border border-gray-600 max-h-[90vh] overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-gray-100 font-newsreader">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
