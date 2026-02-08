import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../stores/store';
import { updateUserData } from '../stores/authSlice';
import EditUserModal from '../components/EditUserModal';

function Profile() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleEdit = () => {
        setIsEditOpen(true);
    };

    const handleSave = (data: { firstName?: string; lastName?: string; phoneNumber?: string }) => {
        dispatch(updateUserData(data));
    };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                Profile
            </h1>
            <p className="text-slate-400">Welcome, {user?.firstName} {user?.lastName}</p>
        </div>
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                Information:
            </h1>
            <p className="text-slate-400">Email: {user?.email}</p>
            <p className="text-slate-400">First Name: {user?.firstName}</p>
            <p className="text-slate-400">Last Name: {user?.lastName}</p>
            <p className="text-slate-400">Phone Number: {user?.phoneNumber}</p>
        </div>
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                Actions:
            </h1>
            <button className="px-5 py-2.5 bg-slate-700 hover:bg-[#70FFE2] text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm shadow-lg" onClick={handleEdit}>
                Edit Profile
            </button>
        </div>
        {isEditOpen && <EditUserModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={user} onSave={handleSave} />}
    </div>
  )
}

export default Profile;