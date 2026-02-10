import React from 'react';
import type { ConfirmDialogProps } from '../services/carsService';
import  Menu from './Menu';

const ConfirmDialog : React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirmClick,
    onClose
}) => {
    
    if(!isOpen) return null;

    

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 1. Backdrop (Затъмнен фон) */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose} // Затваря се при клик извън картата
      />

      {/* 2. Карта по средата */}
      <div className="relative bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl max-w-sm w-full transform transition-all">
        <div className="text-center mb-6">
          <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
          <p className="text-slate-400">{message}</p>
        </div>

        {/* 3. Бутони */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirmClick}
            className="w-full py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-colors disabled:opacity-30"
          >
            Confirm
          </button>

          <button 
            onClick={onClose}
            className="mt-2 text-slate-500 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;