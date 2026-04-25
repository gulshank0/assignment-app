import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Briefcase, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
              <Briefcase className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="text-lg font-bold gradient-text">JobTracker</span>
          </Link>

          {/* User info + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <div className="h-6 w-6 rounded-full bg-indigo-500/30 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200 leading-none">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              id="logout-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
