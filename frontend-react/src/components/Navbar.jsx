import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, FileSearch, Briefcase, PlusCircle, LayoutDashboard, LogOut, UserCheck, Users, ShieldCheck, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isRecruiter = user?.role === 'ROLE_EMPLOYER' || user?.email === 'recruiter@intellihirex.com';
  const isSystemAdmin = (user?.role === 'ROLE_ADMIN' || user?.email === 'admin@intellihirex.com') && !isRecruiter;
  const isAdmin = isSystemAdmin || isRecruiter;

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Fake Job Detector', path: '/fake-job-detector', icon: ShieldAlert },
    { label: 'ATS Resume Checker', path: '/ats-checker', icon: FileSearch },
    { label: 'Job Board', path: '/jobs', icon: Briefcase },
    ...(!isAdmin ? [
      { label: 'My Applications', path: '/applications', icon: UserCheck },
    ] : [
      { label: 'Summary Section', path: '/employer/applicants', icon: BarChart3, adminBadge: true },
      { label: 'Post Job', path: '/post-job', icon: PlusCircle, adminBadge: true },
    ]),
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <ShieldAlert className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                IntelliHire<span className="text-purple-500">X</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                      : item.adminBadge
                      ? 'text-purple-300 hover:text-white bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-purple-400' : item.adminBadge ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Section & Logout */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
              {isSystemAdmin ? (
                <ShieldCheck className="h-4 w-4 text-purple-400" />
              ) : isRecruiter ? (
                <Briefcase className="h-4 w-4 text-indigo-400" />
              ) : (
                <UserCheck className="h-4 w-4 text-indigo-400" />
              )}
              <span className="text-xs font-semibold text-slate-200">
                {isSystemAdmin ? 'System Admin' : isRecruiter ? 'Recruiter' : (user?.fullName || 'Candidate')}
              </span>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-red-400 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
