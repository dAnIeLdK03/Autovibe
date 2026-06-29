import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
    updateUserStatusAdmin,
    type BlockUserModalProps,
} from "../../../../api/adminService";
import { extractApiErrorMessage } from "../../../../shared/extractErrorMessage/extractApiErrorMessage";

type BlockFormValues = {
    blockReason: string;
    blockedUntil: Date;
};

const BlockUserModal: React.FC<BlockUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const methods = useForm<BlockFormValues>({
        defaultValues: { blockReason: "", blockedUntil: undefined},
    });
    const { register, handleSubmit, reset, formState: { errors } } = methods;

    const isUnblock = user?.isBlocked === true;

    useEffect(() => {
        if (!isOpen || !user) return;
        setError(null);
        reset({
            blockReason: "",
            blockedUntil: new Date(user.blockedUntil ?? new Date()),
        });
    }, [isOpen, user, reset]);

    if (!isOpen || !user) return null;

    const onSubmitBlock = async (formData: BlockFormValues) => {
        try {
            setError(null);
            setSubmitting(true);
            await updateUserStatusAdmin(user.id, {
                isBlocked: true,
                blockReason: formData.blockReason.trim(),
                ...(formData.blockedUntil
                    ? { blockedUntil: new Date(formData.blockedUntil).toISOString() }
                    : {}),
            });
            onSave?.();
            onClose();
        } catch (err) {
            setError(extractApiErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    const onUnblock = async () => {
        try {
            setError(null);
            setSubmitting(true);
            await updateUserStatusAdmin(user.id, { isBlocked: false });
            onSave?.();
            onClose();
        } catch (err) {
            setError(extractApiErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden
            />
            <div className="relative bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-8">
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-500 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {isUnblock ? "Unblock user" : "Block user"}
                    </h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-slate-400 text-sm mb-6">
                    {isUnblock
                        ? `Remove the block on ${user.email}? The user will be able to sign in again.`
                        : `Block ${user.email}. A reason is required.`}
                </p>

                {isUnblock ? (
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => void onUnblock()}
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg disabled:opacity-50"
                        >
                            {submitting ? "Saving…" : "Unblock"}
                        </button>
                    </div>
                ) : (
                    <FormProvider {...methods}>
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmitBlock)}>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">
                                    Reason <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    className={`w-full bg-slate-900 border ${errors.blockReason ? "border-red-500" : "border-slate-700"} text-white rounded-xl px-4 py-2.5 outline-none resize-none`}
                                    {...register("blockReason", {
                                        required: "A reason is required when blocking a user",
                                        validate: (v) =>
                                            v.trim().length > 0 || "A reason is required when blocking a user",
                                    })}
                                />
                                {errors.blockReason && (
                                    <span className="text-red-500 text-xs mt-1">{errors.blockReason.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">
                                    Blocked until <span className="text-slate-500">(optional)</span>
                                </label>
                                <input
                                    type="date"
                                    className={`w-full bg-slate-900 border ${errors.blockedUntil ? "border-red-500" : "border-slate-700"} text-white rounded-xl px-4 py-2.5 outline-none`}
                                    {...register("blockedUntil")}
                                />
                                {errors.blockedUntil && (
                                    <span className="text-red-500 text-xs mt-1">{errors.blockedUntil.message}</span>
                                )}
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 shadow-lg disabled:opacity-50"
                                >
                                    {submitting ? "Saving…" : "Block"}
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                )}
            </div>
        </div>
    );
};

export default BlockUserModal;
