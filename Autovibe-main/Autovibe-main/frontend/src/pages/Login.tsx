import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService';
import { setCredentials } from '../stores/authSlice';
import { useForm } from 'react-hook-form';
import type { LoginRequest } from '../services/AuthService';
import LoadingSpinner from '../components/UX/LoadingSpinner';
import { extractApiErrorMessage } from '../Validations/extractApiErrorMessage';


function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formData: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(formData);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate("/cars");
    } catch (error : unknown) {
      const errMsg = extractApiErrorMessage(error);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
      {/* Main card */}
      <div className="w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 shadow-2xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Login
          </h1>
          <p className="text-slate-400">Welcome!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              placeholder='example@mail.com'
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
              type="email"
              {...register("email", {
                required: "Email is required",

                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                }

              })}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message as string}</span>}

          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
              Password
            </label>
            <input
              placeholder='******'
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message as string}</span>}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 px-6 bg-[#70FFE2] hover:bg-[#5ce6cc] disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-2xl shadow-[0_0_20px_rgba(112,255,226,0.3)] hover:shadow-[0_0_25px_rgba(112,255,226,0.5)] transition-all duration-300 transform active:scale-[0.98] flex justify-center items-center"
          >
            {loading ? (
                  <LoadingSpinner />
            ) : "Login"}
          </button>

          {/* Link to register */}
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