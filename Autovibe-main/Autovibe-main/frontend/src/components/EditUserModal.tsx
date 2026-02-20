import React, { useEffect, useState } from 'react';
import type { EditUserModalProps } from '../services/userService';
import { getUser, updateUser, type UserData} from '../services/userService'; 
import { FormProvider, useForm } from 'react-hook-form';
import { extractApiErrorMessage } from '../Validations/extractApiErrorMessage';

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<UserData>();
  const { register, handleSubmit, reset, formState: { errors } } = methods;

  if (!isOpen || !user) return null;

  const onSubmit = async (formData: UserData) => {
    try {
      setError(null);
      await updateUser(user.id!, formData);
      
      if (onSave) {
        onSave(formData);
      }
      onClose();
    } catch (err: unknown) {
      const apiMessage = extractApiErrorMessage(err);
      setError(apiMessage);
    }
  };

  useEffect(() => {
    const fetchUserEdit = async () => {
      if (!user?.id) return;
      try {
        const data = await getUser();
        reset({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber
        });
      } catch (err) {
        setError('Unable to load user data');
      }
    };

    if (isOpen) fetchUserEdit();
  }, [isOpen, user?.id, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-500 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">First Name</label>
              <input 
                type="text" 
                className={`w-full bg-slate-900 border ${errors.firstName ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-2.5 outline-none`}
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
              <input 
                type="text" 
                className={`w-full bg-slate-900 border ${errors.lastName ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-2.5 outline-none`}
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
              <input 
                type="tel" 
                className={`w-full bg-slate-900 border ${errors.phoneNumber ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-2.5 outline-none`}
                {...register("phoneNumber", { required: "Phone number is required" })}
              />
              {errors.phoneNumber && <span className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</span>}
            </div>

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-700">
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg">
                Save
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default EditUserModal;