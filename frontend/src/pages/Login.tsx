import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService';
import { setCredentials } from '../stores/authSlice';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate("/cars");
    } catch (err: any) {
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
      {/* Основна карта */}
      <div className="w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 shadow-2xl">
        
        {/* Хедър */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Login
          </h1>
          <p className="text-slate-400">Welcome!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Имейл поле */}
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

          {/* Парола поле */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
              Paswword
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

          {/* Бутон */}
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
            ) : "Login"}
          </button>

          {/* Линк за регистрация */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-[#70FFE2] font-bold hover:text-white transition-colors duration-200"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;