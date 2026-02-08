import React, { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}


const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Math.max(1, totalPages);

  return (
    <div className="flex justify-center items-center space-x-4 mt-12 pb-10">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-6 py-2 bg-slate-800 text-white rounded-xl border border-slate-700 
                   disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#70FFE2] 
                   transition-all duration-300 font-bold"
      >
        ← Назад
      </button>

      <div className="text-slate-400 font-medium bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
        Страница <span className="text-[#70FFE2]">{currentPage}</span> от {pages}
      </div>

      <button
        disabled={currentPage >= pages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-6 py-2 bg-slate-800 text-white rounded-xl border border-slate-700 
                   disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#70FFE2] 
                   transition-all duration-300 font-bold"
      >
        Напред →
      </button>
    </div>
  );
};

export default Pagination;