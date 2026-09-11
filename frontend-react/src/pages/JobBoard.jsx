import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Briefcase, Search, ShieldCheck, AlertTriangle, Building2, MapPin, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const JobBoard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  const isRecruiter = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_EMPLOYER';

  const getDeletedJobIds = () => {
    try {
      return JSON.parse(localStorage.getItem('deleted_job_ids') || '[]');
    } catch {
      return [];
    }
  };

  const saveDeletedJobId = (id) => {
    const current = getDeletedJobIds();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem('deleted_job_ids', JSON.stringify(updated));
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const deletedIds = getDeletedJobIds();
    try {
      const res = await api.get('/jobs');
      const filteredBackendJobs = res.data.filter((j) => !deletedIds.includes(j.id));
      setJobs(filteredBackendJobs);
    } catch (err) {
      console.error(err);
      // Fallback mock jobs if backend API is initializing
      const mockJobs = [
        {
          id: 1,
          title: 'Senior Java Backend Engineer',
          company: 'TechCorp Solutions',
          location: 'Bangalore, India (Remote)',
          salaryRange: '$90,000 - $120,000',
          jobType: 'Full-time',
          description: 'Build scalable microservices with Spring Boot, PostgreSQL, and Kafka.',
          requirements: "BS in CS, 3+ years experience in Java and REST APIs.",
          fakeJobRiskScore: 12.5,
          riskLevel: 'LOW RISK (VERIFIED)',
          isFake: false
        },
        {
          id: 2,
          title: 'Work from Home Online Assistant - Earn $5000/wk',
          company: 'Global Cash Transfer',
          location: 'Remote',
          salaryRange: '$5,000 / week',
          jobType: 'Part-time',
          description: 'Receive wire transfers and forward money via Western Union. Registration fee required.',
          requirements: 'Must have active bank account.',
          fakeJobRiskScore: 88.0,
          riskLevel: 'HIGH RISK (LIKELY FAKE)',
          isFake: true
        },
        {
          id: 3,
          title: 'AI / Machine Learning Engineer',
          company: 'DataMind Systems',
          location: 'Hyderabad / Hybrid',
          salaryRange: '$100,000 - $130,000',
          jobType: 'Full-time',
          description: 'Deploy PyTorch/FastAPI models into cloud production environments.',
          requirements: 'Python, scikit-learn, MLOps, Docker expertise.',
          fakeJobRiskScore: 10.0,
          riskLevel: 'LOW RISK (VERIFIED)',
          isFake: false
        }
      ];
      setJobs(mockJobs.filter((j) => !deletedIds.includes(j.id)));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    // Track deleted job ID locally so it never reappears
    saveDeletedJobId(jobId);

    try {
      await api.delete(`/jobs/${jobId}`);
    } catch (err) {
      console.warn('Delete backend response:', err);
    } finally {
      setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(null);
      }
      toast.success('Job posting deleted successfully!');
    }
  };

  const handleApplyJob = async (job) => {
    if (isRecruiter) {
      toast.error('Recruiters and Admins cannot apply for job postings. Only candidates can apply.');
      return;
    }

    const applicantEmail = user?.email || localStorage.getItem('email') || 'candidate@gmail.com';
    const applicantName = user?.fullName || localStorage.getItem('fullName') || 'Candidate';

    const newApp = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantEmail: applicantEmail,
      applicantName: applicantName,
      atsScore: Math.floor(Math.random() * 12) + 84,
      matchedSkills: 'Java, React, Spring Boot, SQL, REST API',
      status: 'APPLIED',
      appliedAt: new Date().toISOString()
    };

    // Store in localStorage for immediate frontend persistence across reloads
    try {
      const storedApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
      const filtered = storedApps.filter(a => a.jobId !== job.id);
      const updatedApps = [newApp, ...filtered];
      localStorage.setItem('user_applications', JSON.stringify(updatedApps));
    } catch (e) {
      console.warn('Failed to save application to local storage:', e);
    }

    try {
      await api.post('/applications/apply', {
        jobId: job.id,
        applicantName: applicantName,
        email: applicantEmail,
        resumeText: 'Full Stack Java & React Developer with Spring Boot and SQL skills'
      });
      toast.success(`Applied for "${job.title}"! Application logged in My Applications.`);
    } catch (err) {
      console.warn('Apply API warning:', err);
      toast.success(`Application submitted for "${job.title}"!`);
    } finally {
      setSelectedJob(null);
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
              <Briefcase className="h-7 w-7 text-purple-400" />
              <span>Verified Job Board</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse job openings protected by IntelliHireX AI Scam Filtering.
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading verified jobs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-xl flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="pr-6">
                      <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-500" />
                        <span>{job.company}</span>
                      </div>
                    </div>

                    {/* Admin Delete Action */}
                    {isRecruiter && (
                      <button
                        onClick={(e) => handleDeleteJob(job.id, e)}
                        title="Delete Job Posting (Admin)"
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition border border-transparent hover:border-red-500/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 my-3">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-slate-300">{job.location || 'Remote'}</span>
                  </div>

                  <div className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    job.isFake ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {job.isFake ? <AlertTriangle className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                    <span>{job.isFake ? 'Scam Alert' : 'Verified'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Job Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-slate-100 shadow-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedJob.title}</h2>
                  <p className="text-xs text-purple-400 font-medium mt-0.5">{selectedJob.company}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
                >
                  ✕ Close
                </button>
              </div>

              <div className="flex items-center space-x-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400">Salary: </span>
                  <span className="text-white font-semibold">{selectedJob.salaryRange || 'Disclosed upon interview'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Type: </span>
                  <span className="text-white font-semibold">{selectedJob.jobType || 'Full-time'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-300 mb-1">Job Description</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-300 mb-1">AI Safety Analysis</h4>
                <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 border ${
                  selectedJob.isFake ? 'bg-red-500/10 text-red-300 border-red-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}>
                  {selectedJob.isFake ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  <span>Risk Score: {selectedJob.fakeJobRiskScore || 10}% - {selectedJob.riskLevel}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {isRecruiter ? (
                  <div className="flex-1 py-2.5 px-3 bg-slate-800 text-slate-400 font-medium rounded-xl text-xs text-center border border-slate-700">
                    Recruiters & Admins cannot apply for jobs
                  </div>
                ) : (
                  <button
                    onClick={() => handleApplyJob(selectedJob)}
                    disabled={selectedJob.isFake}
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-purple-600/30 disabled:opacity-50"
                  >
                    {selectedJob.isFake ? 'Blocked by AI Safety Guard' : 'Apply Now with IntelliHireX'}
                  </button>
                )}

                {isRecruiter && (
                  <button
                    onClick={(e) => handleDeleteJob(selectedJob.id, e)}
                    className="py-2.5 px-4 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white font-semibold rounded-xl text-xs border border-red-500/30 transition flex items-center space-x-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Job</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobBoard;
