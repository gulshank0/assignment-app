import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="rounded-lg bg-gray-300/10 group-hover:bg-gray-300/20 transition-colors"></div>
            <span className="text-lg font-bold text-white">JobTracker App</span>
          </Link>

          {/* User info + Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gray-300/[0.04]">
                <div className="h-7 w-7 rounded-full bg-gray-300/10 flex items-center justify-center text-xs font-semibold text-white">
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white leading-none">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              id="logout-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-300/10 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
