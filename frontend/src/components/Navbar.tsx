import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../stores/store";
import { logout } from "../stores/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const location = useLocation();
  
  if(location.pathname === "/login" || location.pathname === "/register"){
    return null;
  }


  const handleLogout = async () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Лява част: Лого */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/cars"
              className="text-2xl font-bold tracking-tight hover:text-blue-400 transition-colors"
            >
              Auto<span className="text-blue-500">vibe</span>
            </Link>
          </div>

          {/* Централна част: Навигация */}
          <div className="hidden md:flex space-x-8 items-center font-medium">
            <Link
              to="/cars"
              className="hover:text-blue-400 transition-colors duration-200 border-b-2 border-transparent hover:border-blue-400 py-1"
            >
              Cars
            </Link>

            {user && (
              <Link
                to="/cars/my"
                className="hover:text-blue-400 transition-colors duration-200 border-b-2 border-transparent hover:border-blue-400 py-1"
              >
                My Cars
              </Link>
            )}
          </div>

          {/* Дясна част: Auth секция */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Интерфейс при логнат потребител
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline text-gray-300 text-sm italic">
                  Hello, {user.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-md active:scale-95"
                >
                  Изход
                </button>
              </div>
            ) : (
              // Интерфейс при нелогнат потребител
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Вход
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-md active:scale-95"
                >
                  Регистрация
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
