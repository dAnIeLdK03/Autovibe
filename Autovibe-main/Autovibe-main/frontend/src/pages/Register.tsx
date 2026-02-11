import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { register } from '../services/AuthService';

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password !== confirmPassword){
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try{
      await register({ email, password, confirmPassword, firstName, lastName, phoneNumber});
      navigate("/login");
    }catch(error : any){
      const errorMessage = error.response?.data || error.message || "Something went wrong.";
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
    finally{
      setLoading(false);
    }
  }

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
          {/* Main card */}
          <div className="w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 shadow-2xl m-3">
            
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                Register
              </h1>
              <p className="text-slate-400">Welcome!</p>
            </div>
    
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm animate-pulse">
                  {error}
                </div>
              )}
    
              {/* Email field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                  placeholder="example@mail.com"
                  required
                />
              </div>
    
              {/* Password field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* 2 Password field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* First Name field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                  placeholder="John"
                  required
                />
              </div>

              {/* Last Name field */}
               <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                  placeholder="Doe"
                  required
                />
              </div>

              {/* Phone Number field */}
               <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                  placeholder="345642342"
                  required
                />
              </div>
    
              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 px-6 bg-[#70FFE2] hover:bg-[#5ce6cc] disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-2xl shadow-[0_0_20px_rgba(112,255,226,0.3)] hover:shadow-[0_0_25px_rgba(112,255,226,0.5)] transition-all duration-300 transform active:scale-[0.98] flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin h-6 w-6 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Register"}
              </button>
    
              {/* Link to Login */}
              <p className="text-center text-slate-400 text-sm mt-6">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-[#70FFE2] font-bold hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
  );
}

export default Register
