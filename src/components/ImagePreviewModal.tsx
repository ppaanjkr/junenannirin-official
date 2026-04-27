"use client";

import { useState } from "react";

export default function ImagePreviewModal({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* thumbnail */}
      <div className={`relative overflow-hidden ${className}`}>
        {/* skeleton */}
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover cursor-pointer transition-opacity duration-500 ${className}
            ${loaded ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(true)}
        />
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
            >
              ✕
            </button>
            <img
              src={src}
              alt={alt}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
