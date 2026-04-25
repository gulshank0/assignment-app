import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Briefcase,
  Mail,
  Lock,
  User,
  AlertCircle,
  Check,
  X as XIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      {checks.map((check) => (
        <div
          key={check.label}
          className={`flex items-center gap-1.5 text-xs ${
            check.met ? "text-white" : "text-gray-500"
          }`}
        >
          {check.met ? (
            <Check className="h-3 w-3" />
          ) : (
            <XIcon className="h-3 w-3" />
          )}
          <span>{check.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await signup(data.name, data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(
          err.response?.data?.message || "Signup failed. Please try again.",
        );
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/60 transition-all duration-200";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration - subtle gray circles instead of indigo/purple */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gray-300/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gray-300/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-300/10 mb-4">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">JobTracker</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Track every application, land your dream job
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">
            Create your account
          </h2>

          {/* Error banner */}
          {serverError && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-300/5 border border-white/20 text-white/80 text-sm mb-5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            id="signup-form"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  {...register("name")}
                  id="name-input"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-white/70 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  {...register("email")}
                  id="email-input"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-white/70 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  {...register("password")}
                  id="password-input"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className={inputClass}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-white/70 mt-1">
                  {errors.password.message}
                </p>
              )}
              <PasswordStrength password={passwordValue} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  {...register("confirmPassword")}
                  id="confirm-password-input"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className={inputClass}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-white/70 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="signup-submit-btn"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-300 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-sm transition-all duration-200 shadow-lg shadow-white/5 mt-2"
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : null}
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white hover:text-gray-300 font-bold underline underline-offset-4 transition-colors"
                id="login-link"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
