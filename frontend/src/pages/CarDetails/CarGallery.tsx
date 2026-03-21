import { useEffect, useState } from 'react';
import { getImageUrl } from '../../utils/getImageUrl';

interface CarGalleryProps {
  imageUrls: string[] | undefined;
  make: string;
  model: string;
  year: number;
}

function CarGallery({ imageUrls, make, model, year }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = (imageUrls ?? [])
    .filter(url => url && typeof url === 'string' && url.trim() !== "")
    .slice(0, 10);

  if (!imageUrls || imageUrls.length === 0) {
    return <div className="bg-slate-800 h-64 rounded-3xl flex items-center justify-center text-slate-500">No images</div>;
  }

  

  useEffect(() => {
    if (validImages.length > 1) {
      const imagesToPreload: number[] = [];

      if (currentIndex < validImages.length - 1) {
        imagesToPreload.push(currentIndex + 1);
      }

      if (currentIndex > 0) {
        imagesToPreload.push(currentIndex - 1);
      }

      imagesToPreload.forEach(idx => {
        const url = validImages[idx];
        if (url) {
          const img = new Image();
          img.src = getImageUrl(url);
        }
      });
    }
  }, [currentIndex, validImages]);

  return (
    <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl relative group">
      {imageUrls && imageUrls.length > 0 ? (
        <div className="relative">
          <img
            key={imageUrls[currentIndex]}
            src={getImageUrl(imageUrls[currentIndex])}
            alt={`${make} ${model}`}
            className="w-full h-[500px] md:h-[600px] object-cover"

          />
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-[#70FFE2] text-sm font-bold px-4 py-2 rounded-full border border-slate-700">
            {year}
          </div>
          {imageUrls.length > 1 && (
            <>
              <button
                title="Prev"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1))}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/70 text-white transition-all 
    ${currentIndex === 0
                    ? "opacity-20 cursor-not-allowed"
                    : "opacity-0 group-hover:opacity-100 hover:text-slate-900"
                  }`}
              >                
              <img
                  src="/back_arrow.png"
                  alt="first"
                  className="w-5 h-5 object-contain brightness-0 invert"

                />
              </button>

              <button
                title="Next"
                disabled={currentIndex === validImages.length - 1}
                onClick={() => setCurrentIndex((prev) => (prev === imageUrls.length + 1 ? 0 : prev + 1))}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/70 text-white transition-all 
    ${currentIndex === validImages.length - 1
                    ? "opacity-20 cursor-not-allowed"
                    : "opacity-0 group-hover:opacity-100  hover:text-slate-900"
                  }`} >
                <img
                  src="/front_arrow.png"
                  alt="first"
                  className="w-5 h-5 object-contain brightness-0 invert"

                />
              </button>

            </>
          )}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full border border-slate-700">
              {imageUrls.length} images
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[500px] md:h-[600px] bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <span className="text-slate-500 text-lg block mb-2">No image yet</span>
            <span className="text-slate-600 text-sm">The image will be added soon.</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarGallery