import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { FileCheck, Sparkles, Building2, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    let localApps = [];
    try {
      localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
    } catch {
      localApps = [];
    }

    try {
      const res = await api.get('/applications/my');
      const backendApps = Array.isArray(res.data) ? res.data : [];
      
      // Combine backend apps with local apps, prioritizing backend entries
      const backendJobIds = new Set(backendApps.map(a => a.jobId || a.id));
      const filteredLocal = localApps.filter(la => !backendJobIds.has(la.jobId) && !backendJobIds.has(la.id));
      
      setApplications([...backendApps, ...filteredLocal]);
    } catch (err) {
      console.error(err);
      // Fallback mock applications combined with locally applied jobs
      const mockApplications = [
        {
          id: 101,
          jobTitle: 'Senior Java Microservices Backend Developer',
          company: 'TechCorp Solutions',
          atsScore: 88.5,
          matchedSkills: 'Java, Spring Boot, SQL, Microservices, REST API',
          status: 'SHORTLISTED',
          appliedAt: '2026-08-12T14:30:00'
        },
        {
          id: 102,
          jobTitle: 'AI / Machine Learning Engineer',
          company: 'DataMind AI Labs',
          atsScore: 78.0,
          matchedSkills: 'Python, scikit-learn, FastAPI, SQL',
          status: 'UNDER_REVIEW',
          appliedAt: '2026-08-11T10:15:00'
        }
      ];

      const mockJobIds = new Set(mockApplications.map(m => m.jobId || m.id));
      const filteredLocal = localApps.filter(la => !mockJobIds.has(la.jobId) && !mockJobIds.has(la.id));

      setApplications([...localApps, ...mockApplications.filter(m => !localApps.some(l => l.jobId === m.id))]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
            <FileCheck className="h-7 w-7 text-indigo-400" />
            <span>My Job Applications</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track submitted job applications, AI ATS match scores, and recruiter evaluation statuses.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <FileCheck className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No Applications Yet</h3>
            <p className="text-xs text-slate-500 mt-1">Explore the Verified Job Board to apply with AI ATS optimization.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg hover:border-indigo-500/40 transition"
              >
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-white text-base">{app.jobTitle}</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      app.status === 'SHORTLISTED' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : app.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : app.status === 'UNDER_REVIEW'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1.5">
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>{app.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {app.matchedSkills && (
                    <p className="text-xs text-slate-400 mt-2">
                      <strong className="text-slate-300">Matched Keywords: </strong>
                      <span className="text-indigo-300">{app.matchedSkills}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4 sm:border-l sm:border-slate-800 sm:pl-6">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-medium">ATS Match Score</div>
                    <div className="text-2xl font-black text-indigo-400 flex items-center justify-end space-x-1">
                      <Sparkles className="h-4 w-4" />
                      <span>{app.atsScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Applications;
