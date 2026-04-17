import { useCallback, useEffect, useState } from "react";
import { getImageUrl } from "../../../utils/getImageUrl";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

interface CarGalleryProps {
  imageUrls: string[] | undefined;
  make: string;
  model: string;
  year: number;
}

function CarGallery({ imageUrls, make, model, year }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const validImages = (imageUrls ?? [])
    .filter((url) => url && typeof url === "string" && url.trim() !== "")
    .slice(0, 10);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length]);

  useEffect(() => {
    if (validImages.length <= 1) return;

    const nextIdx = currentIndex + 1;
    const prevIdx = currentIndex - 1;

    [nextIdx, prevIdx].forEach((idx) => {
      if (idx >= 0 && idx < validImages.length) {
        const img = new Image();
        img.src = getImageUrl(validImages[idx]);
      }
    });
  }, [currentIndex, validImages]);

  useEffect(() => {
    if (validImages.length <= 1 && !isZoomOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (isZoomOpen && e.key === "Escape") {
        setIsZoomOpen(false);
        return;
      }

      if (validImages.length > 1) {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [validImages.length, isZoomOpen, handleNext, handlePrev]);

  useEffect(() => {
    if (!isZoomOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isZoomOpen]);

  if (!validImages || validImages.length === 0) {
    return (
      <div className="bg-slate-800 h-64 rounded-3xl flex items-center justify-center text-slate-500">
        No images
      </div>
    );
  }

  const src = getImageUrl(validImages[currentIndex]);

  return (
    <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl relative group">
      <div className="relative">
        <img
          key={validImages[currentIndex]}
          src={src}
          alt={`${make} ${model}`}
          className="w-full h-[500px] md:h-[600px] object-cover cursor-zoom-in"
          onClick={() => setIsZoomOpen(true)}
        />

        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-[#70FFE2] text-sm font-bold px-4 py-2 rounded-full border border-slate-700">
          {year}
        </div>

        {validImages.length > 1 && (
          <>
            <button
              title="Prev"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/70 text-white transition-all 
              ${currentIndex === 0 ? "opacity-20 cursor-not-allowed" : "opacity-0 group-hover:opacity-100 hover:text-slate-900"}`}
            >
              <img
                src="/back_arrow.png"
                alt="prev"
                className="w-5 h-5 object-contain brightness-0 invert"
              />
            </button>

            <button
              title="Next"
              disabled={currentIndex === validImages.length - 1}
              onClick={handleNext}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/70 text-white transition-all 
              ${currentIndex === validImages.length - 1
                  ? "opacity-20 cursor-not-allowed"
                  : "opacity-0 group-hover:opacity-100 hover:text-slate-900"
                }`}
            >
              <img
                src="/front_arrow.png"
                alt="next"
                className="w-5 h-5 object-contain brightness-0 invert"
              />
            </button>
          </>
        )}

        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full border border-slate-700">
            {validImages.length} images
          </div>
        )}
      </div>

      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-[95vw] h-[85vh] md:w-[90vw] md:h-[88vh] max-w-6xl bg-black/20 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={6}
                wheel={{ step: 0.0015 }}
                doubleClick={{ mode: "zoomIn" }}
                pinch={{ step: 5 }}
                panning={{ velocityDisabled: true }}
              >
                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                  <img
                    src={src}
                    alt={`${make} ${model} zoom`}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarGallery;