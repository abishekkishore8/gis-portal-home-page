import { useState } from "react";
import { Village } from "../data/villages";
import { X, ChevronLeft, ChevronRight, Images, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ImageGalleryProps {
  village: Village;
  onClose: () => void;
}

export function ImageGallery({ village, onClose }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? village.images.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === village.images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Images className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-[15px] text-gray-800">{village.name} - Photo Gallery</h3>
            <p className="text-[12px] text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {village.district}, {village.state} &middot; {village.images.length} photos
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null ? (
        <div className="flex-1 flex flex-col bg-gray-900 relative">
          <div className="flex-1 flex items-center justify-center p-4 relative">
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <ImageWithFallback
              src={village.images[selectedIndex]}
              alt={`${village.name} photo ${selectedIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between px-5 py-3 bg-black/40">
            <span className="text-[13px] text-white/80">
              Photo {selectedIndex + 1} of {village.images.length}
            </span>
            <button
              onClick={() => setSelectedIndex(null)}
              className="text-[13px] text-white/70 hover:text-white transition-colors"
            >
              Back to grid
            </button>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {village.images.map((img, idx) => (
              <div
                key={idx}
                className="relative group cursor-pointer rounded-xl overflow-hidden aspect-[4/3] bg-gray-200"
                onClick={() => setSelectedIndex(idx)}
              >
                <ImageWithFallback
                  src={img}
                  alt={`${village.name} photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-[13px] bg-black/50 px-3 py-1 rounded-full transition-opacity">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
