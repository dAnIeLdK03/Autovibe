import { Link, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuCar, LuShield, LuUser } from "react-icons/lu";
import { SkeletonLoader } from "../../../shared/UX/SkeletonLoader";
import { useUserDetails } from "./useUserDetails";
import { UserRole } from "../../../api/adminService";
import { UserListingMiniCard } from "./UserListingMiniCard";
import { useState } from "react";
import ConfirmDialog from "../../../shared/ConfirmDialog/ConfirmDialog";

function UserDetails() {
  const {
    user,
    loading,
    error,
    forbidden,
    notFound,
    invalidId,
    roleLabel,
    formatDate,
    cars,
    carsLoading,
    carsError,
    handleDeleteUser,
  } = useUserDetails();

  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = async () => {
    if (!user || user.id === undefined) {
      return;
    }
    const success = await handleDeleteUser(user?.id);
    if (success) {
      setShowDeleteConfirm(false);
      navigate("/admin/users");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-5">
        <div className="flex justify-center m-5">
          <SkeletonLoader type="details" count={2} />
        </div>
      </div>
    );
  }

  if (invalidId) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20 text-white">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 text-[#70FFE2] font-bold text-sm mb-8 hover:underline"
          >
            <LuArrowLeft size={18} />
            Back to users
          </Link>
          <div className="bg-amber-500/10 border border-amber-500/40 text-amber-200 p-4 rounded-xl">
            Invalid user link.
          </div>
        </div>
      </div>
    );
  }

  if (error || forbidden || notFound) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20 text-white">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 text-[#70FFE2] font-bold text-sm mb-8 hover:underline"
          >
            <LuArrowLeft size={18} />
            Back to users
          </Link>
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl">
            {forbidden
              ? "You do not have permission for this action."
              : notFound
                ? "User not found."
                : error}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20 text-white">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-[#70FFE2] font-bold text-sm mb-10 hover:underline"
        >
          <LuArrowLeft size={18} />
          Back to users
        </Link>

        <div className="max-w-2xl mb-12">
          <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 shadow-xl">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-slate-700/50 text-[#70FFE2]">
                <LuUser size={28} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono text-slate-500 mb-1">ID {user.id}</p>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight truncate">
                  {[user.firstName, user.lastName].filter(Boolean).join(" ") || "—"}
                </h1>
                <p className="text-slate-400 mt-1 truncate">{user.email}</p>
              </div>
              <span
                className={`shrink-0 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border ${user.role === UserRole.Admin
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}
              >
                {roleLabel(user.role)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-700 pt-8">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm flex-1 w-full">
                <div>
                  <dt className="text-slate-500 font-medium mb-1">Phone</dt>
                  <dd className="text-slate-200">{user.phoneNumber?.trim() || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium mb-1">Created</dt>
                  <dd className="text-slate-200">{formatDate(user.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium mb-1">Updated</dt>
                  <dd className="text-slate-200">{formatDate(user.updatedAt)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500 font-medium mb-1 flex items-center gap-2">
                    <LuShield size={14} />
                    Block status
                  </dt>
                  <dd className="text-slate-200">
                    {user.isBlocked ? (
                      <span className="text-red-400 font-semibold">Blocked</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">Active</span>
                    )}
                    {user.isBlocked && user.blockedUntil && (
                      <span className="text-slate-400 block mt-1">
                        Until: {formatDate(user.blockedUntil)}
                      </span>
                    )}
                    {user.isBlocked && user.blockReason && (
                      <span className="text-slate-400 block mt-1">
                        Reason: {user.blockReason}
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button className="px-4 py-2 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </button>
                <ConfirmDialog
                  isOpen={showDeleteConfirm}
                  title="Delete Account"
                  message="Are you sure you want to delete your account?"
                  onConfirmClick={handleDeleteClick}
                  onClose={() => setShowDeleteConfirm(false)}
                />
                <button className="px-4 py-2 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition">
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>

            </div>
          </div>
        </div>

        <section className="border-t border-slate-800 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-slate-800 text-[#70FFE2] border border-slate-700">
                <LuCar size={22} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  User <span className="text-[#70FFE2]">listings</span>
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Ads published by this account ({cars.length}).
                </p>
              </div>
            </div>
          </div>

          {carsError && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6">
              {carsError}
            </div>
          )}

          {carsLoading ? (
            <div className="flex justify-center py-8">
              <SkeletonLoader type="details" count={2} />
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-14 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <p className="text-slate-500">No car listings for this user.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
              {cars.map((car) => (
                <UserListingMiniCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default UserDetails;
