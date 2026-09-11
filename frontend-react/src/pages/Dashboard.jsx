import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ShieldAlert, FileSearch, Briefcase, PlusCircle, ArrowRight, CheckCircle2, TrendingUp, Users, Activity, XCircle, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { title: 'Fake Job Scans', value: '1,420+', change: '+18% this month', icon: ShieldAlert, color: 'from-purple-500 to-indigo-500' },
    { title: 'Scams Intercepted', value: '384', change: '99.2% AI Accuracy', icon: CheckCircle2, color: 'from-red-500 to-amber-500' },
    { title: 'ATS Resumes Checked', value: '2,890+', change: 'Avg 78% Match', icon: FileSearch, color: 'from-blue-500 to-cyan-500' },
    { title: 'Verified Job Postings', value: '512', change: '100% Guarded', icon: Briefcase, color: 'from-emerald-500 to-teal-500' },
  ];

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_EMPLOYER';

  const allFeatures = [
    {
      title: 'Fake Job Detector',
      desc: 'Analyze job titles, descriptions, and salary claims using XGBoost ML models to identify employment scams.',
      link: '/fake-job-detector',
      icon: ShieldAlert,
      btnText: 'Run AI Scam Scan',
      badge: 'ML Powered'
    },
    {
      title: 'ATS Resume Match Checker',
      desc: 'Check your resume compatibility against job descriptions, extract contact info, and view keyword gap analysis.',
      link: '/ats-checker',
      icon: FileSearch,
      btnText: 'Check ATS Compatibility',
      badge: 'NLP Engine'
    },
    {
      title: 'Verified Job Board',
      desc: 'Browse legitimate, verified job openings guarded against scam listings and wire transfer fraud.',
      link: '/jobs',
      icon: Briefcase,
      btnText: 'Explore Jobs',
      badge: 'Verified Postings'
    },
    {
      title: 'Summary Section',
      desc: 'Comprehensive summary overview displaying Applied Candidates, Shortlisted Candidates, and Rejected Candidates with AI ATS rankings.',
      link: '/employer/applicants',
      icon: BarChart3,
      btnText: 'Open Summary Section',
      badge: 'Admin Only',
      adminOnly: true
    },
    {
      title: 'Post a Job',
      desc: 'Employers & Admins can post job openings with automatic real-time pre-submission AI safety evaluations.',
      link: '/post-job',
      icon: PlusCircle,
      btnText: 'Post Job Opening',
      badge: 'Admin Only',
      adminOnly: true
    }
  ];

  const features = allFeatures.filter(f => !f.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-3.5 py-1 rounded-full mb-3 text-xs text-purple-300 font-semibold">
              <Activity className="h-3.5 w-3.5 text-purple-400" />
              <span>IntelliHireX Control Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome back, <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                {user?.role === 'ROLE_EMPLOYER' || user?.fullName === 'Demo Recruiter' || user?.fullName === 'Recruiter' ? 'recruiter' : user?.role === 'ROLE_ADMIN' ? 'System Admin' : (user?.fullName || 'User')}
              </span>!
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl">
              Your intelligent recruitment workspace. Run AI fake job risk scans, optimize resumes for ATS filters, and post verified jobs.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">{stat.title}</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-[11px] text-emerald-400 mt-3 font-medium">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Module Cards Grid */}
        <h2 className="text-xl font-bold text-white mb-5 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          <span>Core AI Modules</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{feature.desc}</p>
                </div>

                <Link
                  to={feature.link}
                  className="inline-flex items-center justify-between w-full py-2.5 px-4 bg-slate-800 hover:bg-purple-600 text-xs font-semibold text-white rounded-xl transition duration-200"
                >
                  <span>{feature.btnText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
