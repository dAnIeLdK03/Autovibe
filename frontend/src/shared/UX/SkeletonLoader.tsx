
const SkeletonBase = ({ className = "" }) => (
<div className={`animate-pulse bg-slate-600 rounded-lg min-h-[20px] w-full ${className}`} />)


export const SkeletonLoader = ({ type, count = 1 }: { type: 'card' | 'profile' | 'details', count?: number }) => {
  const layouts = {
    card: (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-sm flex flex-col max-w-4xl mx-auto p-4 space-y-6">
        <SkeletonBase className="w-full h-96 mb-5"/>
        <SkeletonBase className="w-1/2 h-8 mb-auto" />
         <SkeletonBase className="w-1/2 h-8 ml-auto" />
          <SkeletonBase className="w-1/2 h-8 mb-auto" />
          
        <div className="flex justify-between mt-4">
          <SkeletonBase className="w-20 h-8" />
          <SkeletonBase className="w-24 h-8 rounded-full" />
        </div>
      </div>
    ),
    profile: (
      <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-2xl border border-slate-700">
        <SkeletonBase className="w-36 h-36 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBase className="w-40 h-10" />
          <SkeletonBase className="w-28 h-6" />
        </div>
      </div>
    ),
    details: (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <SkeletonBase className="w-full h-96" />
        <SkeletonBase className="w-1/2 h-10" />
        <div className="grid grid-cols-2 gap-4">
           <SkeletonBase className="h-20" />
           <SkeletonBase className="h-20" />
        </div>
      </div>
    )
  };
    return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-full">
          {layouts[type]}
        </div>
      ))}
    </>
  );
};
