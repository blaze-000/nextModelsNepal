import React from "react";

export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="group relative px-8 py-4 bg-primary hover:bg-white hover:cursor-pointer  text-yellow-950 font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 ease-out transform hover:shadow-2xl shadow-lg">
      <div className="relative flex items-center justify-center w-full h-full">
        <span className="block transform translate-x-0 group-hover:translate-x-[300%] transition-transform duration-300 ease-out">
          {children}
        </span>
        {/* Hover Text */}
        <span className="absolute inset-0 flex items-center justify-center transform -translate-x-[300%] group-hover:translate-x-0 transition-transform duration-300 ease-out">
          {children}
        </span>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </button>
  );
}
