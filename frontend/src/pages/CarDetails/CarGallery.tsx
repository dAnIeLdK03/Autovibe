import { getImageUrl } from '../../utils/getImageUrl';

interface CarGalleryProps{
    imageUrls: string[] | undefined;
    make: string;
    model: string;
    year: number;
}

function CarGallery({imageUrls, make, model, year} : CarGalleryProps) {


   
  if (!imageUrls || imageUrls.length === 0) {
    return <div className="bg-slate-800 h-64 rounded-3xl flex items-center justify-center text-slate-500">No images</div>;
  }
  return (
     <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
              {imageUrls && imageUrls.length > 0 ? (
                <div className="relative">
                  <img 
                    src={getImageUrl(imageUrls[0])} 
                    alt={`${make} ${model}`} 
                    className="w-full h-[500px] md:h-[600px] object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-[#70FFE2] text-sm font-bold px-4 py-2 rounded-full border border-slate-700">
                    {year}
                  </div>
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