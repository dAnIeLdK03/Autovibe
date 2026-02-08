import React from 'react';

import type { EditUserModalProps } from '../services/userService';
import { updateUser} from '../services/userService'; 

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;

    try {
      await updateUser(user.id!, { firstName, lastName, phoneNumber });
      
      if (onSave) {
        onSave({ firstName, lastName, phoneNumber });
      }
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Възникна грешка при обновяването');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Редактиране на профил</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Име</label>
            <input 
              name="firstName" // Добави name атрибут!
              defaultValue={user.firstName}
              type="text" 
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Фамилия</label>
            <input 
              name="lastName" // Добави name атрибут!
              defaultValue={user.lastName}
              type="text" 
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Телефонен номер</label>
            <input 
              name="phoneNumber" // Добави name атрибут!
              defaultValue={user.phoneNumber}
              type="tel" 
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-700 font-medium">
              Отказ
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-medium shadow-lg shadow-blue-900/20">
              Запази
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;