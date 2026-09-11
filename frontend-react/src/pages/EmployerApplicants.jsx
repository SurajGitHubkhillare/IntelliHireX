import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Users, Sparkles, CheckCircle2, XCircle, Mail, Phone, Filter, UserCheck, Inbox, BarChart3, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const EmployerApplicants = () => {
  const { user } = useContext(AuthContext);
  const isRecruiter = user?.role === 'ROLE_EMPLOYER' || user?.email === 'recruiter@intellihirex.com';

  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDeletedJobIds = () => {
    try {
      return JSON.parse(localStorage.getItem('deleted_job_ids') || '[]');
    } catch {
      return [];
    }
  };

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const fetchEmployerJobs = async () => {
    const deletedIds = getDeletedJobIds();
    const allJobsOption = { id: 'all', title: 'All Job Postings', company: 'Global Overview' };

    try {
      const res = await api.get('/jobs');
      const verifiedJobs = res.data.filter(j => !j.isFake && !deletedIds.includes(j.id));
      setJobs([allJobsOption, ...verifiedJobs]);
      setSelectedJobId('all');
      fetchApplicantsForJob('all');
    } catch (err) {
      console.error(err);
      const mockJobs = [
        { id: 1, title: 'Senior Java Microservices Backend Developer', company: 'TechCorp Solutions' },
        { id: 3, title: 'AI / Machine Learning Engineer', company: 'DataMind AI Labs' }
      ];
      setJobs([allJobsOption, ...mockJobs.filter(j => !deletedIds.includes(j.id))]);
      setSelectedJobId('all');
      fetchApplicantsForJob('all');
    }
  };

  const fetchApplicantsForJob = async (jobId) => {
    setLoading(true);

    let localApps = [];
    try {
      localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
    } catch {
      localApps = [];
    }

    const localForJob = (jobId === 'all' || !jobId) 
      ? localApps 
      : localApps.filter(a => String(a.jobId) === String(jobId));

    try {
      const endpoint = (jobId === 'all' || !jobId) ? '/applications' : `/applications/job/${jobId}`;
      const res = await api.get(endpoint);
      const backendApps = Array.isArray(res.data) ? res.data : [];

      const backendKeys = new Set(backendApps.map(a => `${a.jobId}_${a.applicantEmail}`));
      const filteredLocal = localForJob.filter(l => !backendKeys.has(`${l.jobId}_${l.applicantEmail}`));

      setApplicants([...backendApps, ...filteredLocal]);
    } catch (err) {
      console.error('Failed to fetch applicants from server, combining local storage:', err);

      const mockApplicants = [
        {
          id: 1,
          jobId: 1,
          applicantName: 'Suraj Khillare',
          applicantEmail: 'suraj.khillare@example.com',
          atsScore: 92.5,
          matchedSkills: 'Java, Spring Boot, SQL, Microservices, REST API, Docker',
          status: 'SHORTLISTED',
          appliedAt: '2026-08-12T14:30:00'
        },
        {
          id: 2,
          jobId: 1,
          applicantName: 'Ananya Sharma',
          applicantEmail: 'ananya.sharma@example.com',
          atsScore: 84.0,
          matchedSkills: 'Java, Spring Boot, React, SQL',
          status: 'UNDER_REVIEW',
          appliedAt: '2026-08-11T16:20:00'
        },
        {
          id: 3,
          jobId: 3,
          applicantName: 'Rohan Verma',
          applicantEmail: 'rohan.v@example.com',
          atsScore: 61.5,
          matchedSkills: 'Java, HTML, CSS',
          status: 'REJECTED',
          appliedAt: '2026-08-10T11:00:00'
        }
      ];

      const filteredMock = (jobId === 'all' || !jobId)
        ? mockApplicants
        : mockApplicants.filter(m => String(m.jobId) === String(jobId));

      const existingEmails = new Set(localForJob.map(l => l.applicantEmail));
      const deduplicatedMock = filteredMock.filter(m => !existingEmails.has(m.applicantEmail));

      setApplicants([...localForJob, ...deduplicatedMock]);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    fetchApplicantsForJob(jobId);
  };

  const updateStatus = async (applicantId, newStatus, applicantEmail) => {
    if (!isRecruiter) {
      toast.error('Only Recruiters (ROLE_EMPLOYER) are authorized to shortlist or reject candidates.');
      return;
    }

    try {
      await api.put(`/applications/${applicantId}/status`, { status: newStatus, email: applicantEmail });
    } catch (err) {
      console.warn('Backend status update warning:', err);
    } finally {
      setApplicants(prev => prev.map(app => {
        const isMatch = (app.id === applicantId || String(app.id) === String(applicantId)) ||
                        (applicantEmail && app.applicantEmail === applicantEmail);
        return isMatch ? { ...app, status: newStatus } : app;
      }));

      try {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const updatedLocal = localApps.map(app => {
          const isMatch = (app.id === applicantId || String(app.id) === String(applicantId)) ||
                          (applicantEmail && app.applicantEmail === applicantEmail);
          return isMatch ? { ...app, status: newStatus } : app;
        });
        localStorage.setItem('user_applications', JSON.stringify(updatedLocal));
      } catch (e) {
        console.warn('Local storage status update warning:', e);
      }

      toast.success(`Candidate status updated to ${newStatus}`);
    }
  };

  const setTab = (filterName) => {
    setSearchParams({ filter: filterName });
  };

  const allCount = applicants.length;
  const shortlistedCount = applicants.filter(a => a.status === 'SHORTLISTED').length;
  const rejectedCount = applicants.filter(a => a.status === 'REJECTED').length;

  const displayedApplicants = applicants.filter(app => {
    if (activeFilter === 'shortlisted') return app.status === 'SHORTLISTED';
    if (activeFilter === 'rejected') return app.status === 'REJECTED';
    return true; // 'all'
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
              <BarChart3 className="h-7 w-7 text-purple-400" />
              <span>Summary Section</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Overview of candidate applications, shortlisted candidates, and rejected candidates.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedJobId}
              onChange={handleJobSelect}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div 
            onClick={() => setTab('all')} 
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeFilter === 'all' ? 'bg-purple-950/40 border-purple-500/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Candidate Applications</span>
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">{allCount}</div>
            <p className="text-[10px] text-purple-300 mt-1">All submitted job applications</p>
          </div>

          <div 
            onClick={() => setTab('shortlisted')} 
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeFilter === 'shortlisted' ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Shortlisted Candidates</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-2">{shortlistedCount}</div>
            <p className="text-[10px] text-emerald-300 mt-1">Approved for interview rounds</p>
          </div>

          <div 
            onClick={() => setTab('rejected')} 
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeFilter === 'rejected' ? 'bg-red-950/40 border-red-500/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Rejected Candidates</span>
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="text-2xl font-extrabold text-red-400 mt-2">{rejectedCount}</div>
            <p className="text-[10px] text-red-300 mt-1">Not moving forward</p>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
              activeFilter === 'all'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Applied Candidates</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
              {allCount}
            </span>
          </button>

          <button
            onClick={() => setTab('shortlisted')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
              activeFilter === 'shortlisted'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Shortlisted Candidates</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              {shortlistedCount}
            </span>
          </button>

          <button
            onClick={() => setTab('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
              activeFilter === 'rejected'
                ? 'bg-red-600/20 text-red-300 border border-red-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <XCircle className="h-4 w-4 text-red-400" />
            <span>Rejected Candidates</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
              {rejectedCount}
            </span>
          </button>
        </div>

        {/* Applicants List */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Ranking candidates with AI...</div>
        ) : displayedApplicants.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <Inbox className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No Candidates in this Category</h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeFilter === 'shortlisted'
                ? 'No candidates have been shortlisted for this job yet.'
                : activeFilter === 'rejected'
                ? 'No candidates have been rejected for this job.'
                : 'No candidates have applied for this job yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedApplicants.map((app, idx) => (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl hover:border-purple-500/40 transition"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 text-sm flex-shrink-0">
                    #{idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-bold text-white text-base">{app.applicantName}</h3>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        app.status === 'SHORTLISTED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : app.status === 'REJECTED'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        <span>{app.applicantEmail}</span>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <span className="text-xs text-slate-400">AI Matched Keywords: </span>
                      <span className="text-xs font-medium text-purple-300">{app.matchedSkills}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-medium">ATS Score</div>
                    <div className="text-2xl font-black text-purple-400 flex items-center justify-end space-x-1">
                      <Sparkles className="h-4 w-4" />
                      <span>{app.atsScore}%</span>
                    </div>
                  </div>

                  {isRecruiter ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateStatus(app.id, 'SHORTLISTED', app.applicantEmail)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
                          app.status === 'SHORTLISTED' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Shortlist</span>
                      </button>

                      <button
                        onClick={() => updateStatus(app.id, 'REJECTED', app.applicantEmail)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
                          app.status === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-slate-800 text-red-400 hover:bg-red-500/20'
                        }`}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 bg-slate-800/80 border border-slate-700/80 text-slate-400 rounded-xl text-[11px] font-medium flex items-center space-x-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-purple-400" />
                      <span>Recruiter Evaluation Only</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployerApplicants;
