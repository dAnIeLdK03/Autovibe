import React, {useState } from 'react';
import type { EditPasswordModalProps } from '../services/userService';
import { UpdatePassword, type PasswordChange } from '../services/userService';
import { FormProvider, useForm } from 'react-hook-form';
import { extractApiErrorMessage } from '../Validations/extractApiErrorMessage';
import toast from 'react-hot-toast';

const ChangePassword: React.FC<EditPasswordModalProps> = ({ isOpen, onClose, onSave }) => {

    const [error, setError] = useState<string | null>(null);
    const methods = useForm<PasswordChange>()
    const { register, getValues, handleSubmit, formState: { errors } } = methods;

    if (!isOpen) return null;

    const onSubmit = async (formData: PasswordChange) => {
        try {
            setError(null);
            await UpdatePassword(formData);
            if (onSave) {
                onSave(formData);
            }
            toast.success("Password changed successfully")
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: unknown) {
            const apiMessage = extractApiErrorMessage(err);
            setError(apiMessage);
        }
    }
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
                    <h2 className="text-xl font-bold text-white">Change password</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <FormProvider {...methods}>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
                            <input
                                type='password'
                                className={`w-full bg-slate-900 border ${errors.CurrentPassword ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-2.5 outline-none`}
                                {...register("CurrentPassword", { required: "Current Password is required",
                                 })}
                            />
                            {errors.CurrentPassword && <span className="text-red-500 text-xs mt-1">{errors.CurrentPassword.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                            <input
                                type='password'
                                className={`w-full bg-slate-900 border ${errors.NewPassword ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-2.5 outline-none`}
                                {...register("NewPassword", {
                                    required: "New password is required",
                                    minLength: {
                                        value: 6,
                                        message: "The new password must be at least 6 characters",
                                    },
                                })}
                            />
                            {errors.NewPassword && <span className="text-red-500 text-xs mt-1">{errors.NewPassword.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Confirm Password</label>
                            <input
                                type='password'
                                className={`w-full bg-slate-900 border ${errors.ConfirmPassword ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-2.5 outline-none`}
                                {...register("ConfirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) =>
                                        value === getValues("NewPassword") || "Password do not match"
                                })}
                            />
                            {errors.ConfirmPassword && <span className="text-red-500 text-xs mt-1">{errors.ConfirmPassword.message}</span>}
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
    )
}

export default ChangePassword;