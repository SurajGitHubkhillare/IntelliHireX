import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { PlusCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: 'Remote',
    salaryRange: '$80,000 - $110,000',
    jobType: 'Full-time'
  });

  const [loading, setLoading] = useState(false);
  const [scamWarning, setScamWarning] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) {
      toast.error('Please fill in title, company, and description.');
      return;
    }

    setLoading(true);
    setScamWarning(null);

    try {
      // Create job via Spring Boot backend API (which automatically calls Python AI microservice)
      const res = await axios.post('http://localhost:8080/api/jobs', formData);
      if (res.data) {
        if (res.data.isFake) {
          setScamWarning(res.data);
          toast.warning('Warning: AI model flagged potential scam keywords in this listing.');
        } else {
          toast.success('Job posted successfully and verified by AI!');
          navigate('/jobs');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Error posting job. Ensure Spring Boot backend is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white flex items-center justify-center space-x-2">
            <PlusCircle className="h-7 w-7 text-purple-400" />
            <span>Post a New Job Opening</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            All posted jobs undergo real-time IntelliHireX AI scam risk evaluation before being listed.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          {scamWarning && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs text-red-300 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-400 font-bold block mb-1">AI Safety Flagged This Job (Risk Score: {scamWarning.fakeJobRiskScore}%)</strong>
                <span>The listing contains patterns matching employment scams (e.g. upfront fee requests or wire transfers). Please modify the text to comply with safety guidelines.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. TechCorp Inc."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote / San Francisco, CA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Salary Range</label>
                <input
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  placeholder="e.g. $90k - $120k / year"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Description *</label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe roles, day-to-day responsibilities, and team environment..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Requirements & Qualifications</label>
              <textarea
                name="requirements"
                rows={3}
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List required technical skills, degree requirements..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Publishing & Scanning with AI...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Post Job with AI Safety Check</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PostJob;
