import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { register as registerUser } from '../services/AuthService';
import { useForm } from 'react-hook-form';
import type { RegisterRequest } from '../services/AuthService';
import axios from 'axios';
import LoadingSpinner from '../components/UX/LoadingSpinner';
import { extractApiErrorMessage } from '../Validations/extractApiErrorMessage';

function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterRequest>();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (formData: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const { ...dataToApi } = formData;
      await registerUser(dataToApi);
      navigate("/login");
    } catch (error: unknown) {

      const errMsg = extractApiErrorMessage(error);

      if (axios.isAxiosError(error)) {
        setError(errMsg);
      }
      else if (error instanceof Error) {
        setError(errMsg);
      }
      else if (typeof error === "string") {
        setError(errMsg);
      }
      setError(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
    }
    finally {
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

          {/* 2 Password field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
              confirm Password
            </label>
            <input
              placeholder='******'
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
              type="password"
              {...register("confirmPassword", {
                required: "Password is required",
                validate: (value) =>
                  value === watch(`password`) || "Password do not match"
              })}
            />
            {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message as string}</span>}
          </div>

          {/* First Name field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
              placeholder="John"
              {...register("firstName", {
                required: "First name is required",
              })}
            />
            {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message as string}</span>}
          </div>

          {/* Last Name field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
              placeholder="Doe"
              {...register("lastName", {
                required: "Last name is required",
              })}
            />
            {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message as string}</span>}
          </div>

          {/* Phone Number field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
              placeholder="0897362517"
              {...register("phoneNumber", {
                required: "Phone name is required",
                validate: (value) =>
                  value.length === 10 || "Phone number must be 10 digits"
                ,
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Phone number must be digits"
                }

              })}
            />
            {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber.message as string}</span>}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 px-6 bg-[#70FFE2] hover:bg-[#5ce6cc] disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-2xl shadow-[0_0_20px_rgba(112,255,226,0.3)] hover:shadow-[0_0_25px_rgba(112,255,226,0.5)] transition-all duration-300 transform active:scale-[0.98] flex justify-center items-center"
          >
            {loading ? (
                  <LoadingSpinner />
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
