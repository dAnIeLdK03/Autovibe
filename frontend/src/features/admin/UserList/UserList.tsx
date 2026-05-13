import { LuSearch, LuUserCog } from "react-icons/lu";
import { SkeletonLoader } from "../../../shared/UX/SkeletonLoader";
import { useUserList } from "./useUserList";
import Pagination from "../../../shared/Pagination/pagePagination";


function UserList() {

    const{
        users,
        page,
        totalPages,
        emailFilter,
        setEmailFilter,
        applyEmailSearch,
        loading,
        error,
        forbidden,
        roleLabel,
        handlePageChange,
        handleReset
    } = useUserList();

    if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-5">
        <div className="flex justify-center m-5">
          <SkeletonLoader type="details" count={3} />
        </div>
      </div>
    );
  }

   if (error || forbidden) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
        <div className="max-w-7xl mx-auto bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
          {forbidden ? "You dont have permission for this action" : error}
        </div>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20 text-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Manage <span className="text-[#70FFE2]">Users</span>
          </h1>
          <p className="text-slate-400">Administration panel for user access and roles.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative group">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#70FFE2] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by email..."
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="pl-11 pr-4 py-2.5 rounded-2xl border bg-slate-800/50 border-slate-700 text-slate-200 focus:border-[#70FFE2] focus:outline-none transition-all w-full md:w-80"
            />
          </div>
          
          <button
            onClick={applyEmailSearch}
            className="px-6 py-2.5 rounded-2xl bg-[#70FFE2] text-slate-900 font-bold hover:shadow-[0_0_15px_rgba(112,255,226,0.4)] transition-all"
          >
            Search
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-2xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
          >
            Reset
          </button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
            <p className="text-slate-500">No users found for this criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="group relative bg-slate-800/40 border border-slate-700 rounded-3xl p-6 hover:border-[#70FFE2]/50 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-slate-700/50 text-[#70FFE2]">
                    <LuUserCog size={24} />
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full ${
                    user.role === 1 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {roleLabel(user.role)}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1 truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{user.email}</p>
                
                <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono italic">ID: {user.id}</span>
                  <button className="text-xs font-bold text-[#70FFE2] opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details →
                  </button>
                </div>
              </div>
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

export default UserList;