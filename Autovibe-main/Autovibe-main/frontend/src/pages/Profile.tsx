import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../stores/store';
import { updateUserData } from '../stores/authSlice';
import EditUserModal from '../components/EditUserModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { deleteUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { logout } from '../stores/authSlice';

function Profile() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const navigate = useNavigate();

    const handleEdit = () => {
        setIsEditOpen(true);
    };
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);  


    const handleSave = (data: { firstName?: string; lastName?: string; phoneNumber?: string }) => {
        dispatch(updateUserData(data));
    };

    const handleDelete = async () => {
        if(!user){  
          setError("You are not logged in.");
          return;
        }
        setLoading(true);
        setError(null);
        try {
          setShowDeleteConfirm(true);
          await deleteUser(user.id);
          dispatch(logout());
          localStorage.removeItem("token");
          navigate("/cars");
        } catch (error) {
          setError("Unable to delete account.");
        }
      };
      if(loading){
        return (
          <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
            <div className="max-w-7xl mx-auto mb-8">
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                Profile
              </h1>
              <p className="text-slate-400 text-2xl">Loading...</p>
            </div>
          </div>
        );
      }
      if(error){
        return (
          <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
            <div className="max-w-7xl mx-auto mb-8">
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                Error loading profile
              </h1>
              <p className="text-red-500 text-2xl">{error}</p>
            </div>
          </div>
        );
      }

    return (
        <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                    Profile
                </h1>
                <p className="text-slate-400 text-2xl">Welcome, {user?.firstName} {user?.lastName}</p>
            </div>
            <div className="max-w-7xl mx-auto mt-20 justify-center flex flex-col">
                <h1 className="text-4xl font-black text-white tracking-tight mb-2 justify-center flex">
                    Information:
                </h1>
                <p className="text-slate-400 m-2 justify-center flex">Email: {user?.email}</p>
                <p className="text-slate-400 m-2 justify-center flex">First Name: {user?.firstName}</p>
                <p className="text-slate-400 m-2 justify-center flex">Last Name: {user?.lastName}</p>
                <p className="text-slate-400 m-2 justify-center flex">Phone Number: {user?.phoneNumber}</p>
            </div>
            <div className="max-w-7xl mx-auto justify-center max-w-35">
                <h1 className="text-4xl font-black text-white tracking-tight mb-2 justify-center flex flex-col mt-20 ">
                    Actions:
                </h1>
                <button
                  className="mr-2 flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg transition-all"
                    onClick={handleEdit}>
                    Edit Profile
                </button>
                <button 
                    className="ml-2 flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all"
                  onClick={() => setShowDeleteConfirm(true)}>
                    Delete Account
                    </button>
                    <ConfirmDialog 
                  isOpen={showDeleteConfirm}
                  title="Delete Account"
                  message="Are you sure you want to delete your account?"
                  onConfirmClick={handleDelete}
                  onClose={() => setShowDeleteConfirm(false)}
                />
            </div>
            {isEditOpen && <EditUserModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={user} onSave={handleSave} />}
        </div>
    )
}

export default Profile;