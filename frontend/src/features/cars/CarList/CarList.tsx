import { SkeletonLoader } from '../../../shared/UX/SkeletonLoader';
import { LuFilter, LuScrollText } from 'react-icons/lu';
import { SortModal } from '../CarComponents/Filters/SortModal';
import { FilterModal } from '../CarComponents/Filters/FilterModal';
import { NoCarsFound } from '../../../shared/UX/NoCarsFound';
import CarCard from '../CarComponents/CarCard';
import Pagination from '../../../shared/Pagination/pagePagination';
import { useCarList } from './useCarList';
import { useState } from 'react';
import { initialFilters } from './constants';






function CarList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const {
    cars, loading, error, filters, page, totalPages, handleApplyFilters,
    handleUpdateSort, handleReset, handlePageChange
  } = useCarList(initialFilters);

  const toggleFilters = (isOpen: boolean) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-5">
        <div className="flex justify-center m-5">
          <SkeletonLoader type="details" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
        <div className="max-w-7xl mx-auto bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Explore Our <span className="text-[#70FFE2]">Fleet</span>
          </h1>
          <p className="text-slate-400">Discover the perfect ride for your next journey.</p>

        </div>
        <div className={`flex items-center gap-3 mb-4 transition-opacity duration-600 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => {
                setIsSortOpen(true);
                toggleFilters(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all"
            >
              <LuScrollText
                size={18}
                className={`${isFilterOpen ? 'text-blue-400' : 'text-slate-400'}`}
              />

              <span className="text-sm font-medium">Sort By</span>
            </button>

            <SortModal
              isOpen={isSortOpen}

              sortOptionId={filters.sortType ?? ""}
              updateSort={handleUpdateSort}
              onApply={() => {
                setIsSortOpen(false);
                toggleFilters(false);
              }}
              onClose={() => {
                setIsSortOpen(false);
                toggleFilters(false);
              }}
            />
          </div>


          <button
            onClick={() => {
              setIsFilterOpen(true);
            }}
            className={`
    flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-200 mb-4 gap-3
    bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white
    ${isFilterOpen ? 'bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] text-white' : ''}
  `}
          >
            <LuFilter
              size={18}
              className={`${isFilterOpen ? 'text-blue-400' : 'text-slate-400'}`}
            />

            <span className="text-sm font-medium whitespace-nowrap">Filters</span>

          </button>

          <FilterModal
            key={isFilterOpen ? "open" : "closed"}
            isOpen={isFilterOpen}
            onClose={() => {
              setIsFilterOpen(false);
            }}
            filters={filters}
            onApply={(finalFilters) => {
              handleApplyFilters(finalFilters);
              setIsFilterOpen(false);
            }}
          />


        </div>


        {loading ? (
          <SkeletonLoader type="details" count={3} />
        ) : cars.length === 0 ? (
          <NoCarsFound
            onOpenFilters={() => setIsFilterOpen(true)}
            onResetFilters={handleReset}
          />
        ) : error ? (
          <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
            <div className="max-w-7xl mx-auto bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
              {error}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (

              <CarCard
                key={car.id}
                car={car}
                showDeletebutton={false}
              />
            ))}
          </div>
        )}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
export default CarList
