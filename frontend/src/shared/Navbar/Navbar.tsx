import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import type { RootState } from '@autovibe/app-state';
import { logout } from '@autovibe/app-state';
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import Menu from "../Menu/Menu";

function Navbar() {
  const [showConfirm, setShowConfirm] = useState(false);  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(
    (state: RootState) => state.auth);
  const location = useLocation();
  
  if(location.pathname === "/login" || location.pathname === "/register"){
    return null;
  }


  const handleLogout = async () => {
    setShowConfirm(false);
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0 flex items-center w-48">
            <button 
            type="button"
            onClick={() => {window.location.href = "/"}}
            className="text-2xl font-bold tracking-tight hover:text-blue-400 transition-colors"
            >
              Auto<span className="text-blue-500">vibe</span>
            </button>
          </div>

          <div className="hidden md:flex flex-1 justify-center space-x-8 items-center font-medium">
            <Link to="/cars" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 py-1">
              Cars
            </Link>
            {user && (
              <>
              <Link to="/cars/my" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 py-1">
                My Cars
              </Link>
               <Link to="/favorites" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 py-1">
                Favorites
              </Link>
              </>
            )}
          </div>

          <div className="flex items-center justify-end w-48 space-x-4">
            {user ? (
              <>
                <span className="hidden lg:inline text-gray-300 text-sm italic whitespace-nowrap">
                  Hello, {user.firstName}
                </span>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-md active:scale-95"
                >
                  Logout
                </button>
                <ConfirmDialog
                  isOpen={showConfirm}
                  title="Logout"
                  message="Are you sure you want to leave?"
                  onConfirmClick={handleLogout}
                  onClose={() => setShowConfirm(false)}
                />
                <Menu  />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md">
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
}

export default Navbar;
