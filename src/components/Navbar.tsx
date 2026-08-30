import React, { useState } from 'react';
import {
  Briefcase,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  FileText,
  BookOpen,
  Info,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { HospitalLogo } from './HospitalLogo.js';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, jobId?: number) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenProfile: () => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenProfile,
  onOpenGuide,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Hospital Brand & Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 group focus:outline-none text-left"
          >
            <HospitalLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('jobs')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'jobs' || currentView === 'job-details'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Available Jobs
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'about'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Info className="w-4 h-4" />
              About Deva
            </button>
            <button
              onClick={onOpenGuide}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-1.5 transition-colors"
              title="Full-Stack 13-Stage System Guide & MySQL Schemas"
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Full-Stack Guide</span>
            </button>
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{user.full_name}</p>
                    <p className="text-[11px] text-teal-700 font-medium capitalize">
                      {user.role === 'admin' ? 'Hospital HR Admin' : 'Applicant'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{user.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    {isAdmin ? (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-800 flex items-center gap-2.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        Admin Dashboard
                      </button>
                    ) : (
                      <button
                        onClick={() => handleNavClick('my-applications')}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-800 flex items-center gap-2.5"
                      >
                        <FileText className="w-4 h-4 text-teal-600" />
                        My Applications
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Edit Profile
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-slate-100 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 shadow-sm shadow-teal-700/20 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium ${
              currentView === 'home' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('jobs')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium flex items-center gap-2 ${
              currentView === 'jobs' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Available Jobs
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium flex items-center gap-2 ${
              currentView === 'about' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-700'
            }`}
          >
            <Info className="w-4 h-4" />
            About Deva Hospital
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenGuide();
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium text-amber-800 bg-amber-50 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            Full-Stack 13-Stage Guide
          </button>

          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="px-3.5 py-2 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900">{user.full_name}</p>
                  <p className="text-xs text-teal-700 font-medium">{user.email}</p>
                </div>

                {isAdmin ? (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium text-teal-800 bg-teal-50 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    Admin Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('my-applications')}
                    className="w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium text-teal-800 bg-teal-50 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-teal-600" />
                    My Applications
                  </button>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2.5 rounded-lg text-center font-semibold text-slate-700 bg-slate-100"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="w-full py-2.5 rounded-lg text-center font-semibold text-white bg-teal-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
