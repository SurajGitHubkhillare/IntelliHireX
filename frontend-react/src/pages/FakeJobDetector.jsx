import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { ShieldAlert, CheckCircle2, AlertTriangle, Search, Info, Building2, DollarSign, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

const FakeJobDetector = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    salary_range: '',
    has_company_logo: 1,
    verified_profile: 1,
    has_company_website: 1,
    has_recruiter_contact: 1,
    has_salary_info: 1,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuickSample = (type) => {
    if (type === 'fake') {
      setFormData({
        title: 'Work from Home Online Data Entry Assistant',
        company: 'Global Money Transfer Ltd',
        description: 'Earn $1000 daily from home with minimal hours! Must have an active bank account to process wire transfers and moneygram. Send $50 registration fee via Western Union for training kit.',
        requirements: 'No degree or experience required. Must respond immediately on WhatsApp or Telegram.',
        salary_range: '$5000 - $10000 / month',
        has_company_logo: 0,
        verified_profile: 0,
        has_company_website: 0,
        has_recruiter_contact: 0,
        has_salary_info: 0,
      });
    } else {
      setFormData({
        title: 'Senior Java Microservices Backend Developer',
        company: 'CloudScale Technologies',
        description: 'We are seeking an experienced Java backend engineer to build high-throughput microservices using Spring Boot, PostgreSQL, and Kafka. You will work in an agile team and deploy to AWS Kubernetes.',
        requirements: 'BS in Computer Science. 4+ years of professional Java experience. Solid understanding of REST APIs and Docker.',
        salary_range: '$110,000 - $140,000 / year',
        has_company_logo: 1,
        verified_profile: 1,
        has_company_website: 1,
        has_recruiter_contact: 1,
        has_salary_info: 1,
      });
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please enter at least a job title and description');
      return;
    }

    setLoading(true);
    try {
      // Call Python AI microservice (or proxied Spring Boot endpoint)
      const aiBase = import.meta.env.VITE_AI_URL || 'http://localhost:8000';
      const res = await axios.post(`${aiBase}/api/v1/predict-fake-job`, formData);
      if (res.data && res.data.data) {
        setResult(res.data.data);
        toast.success('Job analysis completed!');
      }
    } catch (err) {
      console.error(err);
      toast.error('AI microservice error. Ensure Python FastAPI service is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 rounded-full mb-3">
            <ShieldAlert className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300">AI Scam Guard 1.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
            Fake Job Posting Detector
          </h1>
          <p className="mt-2 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Paste job details or requirements to run our XGBoost Machine Learning model & NLP safety rules to detect employment scams, wire transfer fraud, and fake offers.
          </p>

          {/* Quick preset buttons */}
          <div className="mt-4 flex justify-center space-x-3 text-xs">
            <button
              onClick={() => handleQuickSample('fake')}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg transition"
            >
              Load Sample Scam Job
            </button>
            <button
              onClick={() => handleQuickSample('real')}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition"
            >
              Load Sample Legit Job
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form Column */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Search className="h-5 w-5 text-purple-400" />
              <span>Enter Job Listing Details</span>
            </h2>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Title *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Remote Data Entry Clerk or Java Developer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. TechCorp Solutions"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleChange}
                    placeholder="e.g. $80k - $100k or $500/day"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Description *</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Paste the full job description text here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Requirements & Qualifications</label>
                <textarea
                  name="requirements"
                  rows={2}
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="e.g. Bachelor's degree, 2 years experience, WhatsApp active..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Company Identity Signals */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-purple-400" />
                  Company Identity Signals
                  <span className="text-slate-500 font-normal normal-case">(uncheck what is missing)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: 'has_company_logo', label: 'Official company logo present' },
                    { key: 'verified_profile', label: 'Verified company profile' },
                    { key: 'has_company_website', label: 'Company website / career page' },
                    { key: 'has_recruiter_contact', label: 'Recruiter email / phone provided' },
                    { key: 'has_salary_info', label: 'Salary information specified' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData[key] === 1}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.checked ? 1 : 0 })}
                        className="w-4 h-4 text-purple-600 rounded bg-slate-900 border-slate-700"
                      />
                      <span className="text-xs text-slate-300 group-hover:text-white transition">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Analyzing with AI Model...</span>
                ) : (
                  <>
                    <ShieldAlert className="h-5 w-5" />
                    <span>Run AI Safety Scan</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            {result ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                {/* Score Header */}
                <div className="text-center pb-4 border-b border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    AI Scam Risk Assessment
                  </div>
                  
                  <div className="flex items-center justify-center space-x-3 my-3">
                    <div className={`text-4xl font-extrabold ${result.is_fake ? 'text-red-400' : 'text-emerald-400'}`}>
                      {result.risk_score}%
                    </div>
                  </div>

                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${
                    result.is_fake ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {result.is_fake ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    <span>{result.risk_level}</span>
                  </div>
                </div>

                {/* Probability & Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">ML Model Probability:</span>
                    <span className="font-semibold text-white">{result.fraud_probability}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${result.is_fake ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'}`}
                      style={{ width: `${result.fraud_probability}%` }}
                    />
                  </div>
                </div>

                {/* Red Flags List */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span>Detected Red Flags ({result.red_flags.length})</span>
                  </h3>
                  {result.red_flags.length > 0 ? (
                    <ul className="space-y-2">
                      {result.red_flags.map((flag, idx) => (
                        <li key={idx} className="flex items-start space-x-2 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-xs text-red-300">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs text-emerald-300 flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>No suspicious red flags found. The listing follows legitimate employment patterns.</span>
                    </div>
                  )}
                </div>

                {/* Recommendation */}
                <div className="bg-purple-500/10 border border-purple-500/20 p-3.5 rounded-xl text-xs">
                  <span className="font-semibold text-purple-300">AI Recommendation: </span>
                  <span className="text-slate-300">{result.recommendation}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/50 border border-dashed border-slate-800 p-8 rounded-2xl text-center flex flex-col items-center justify-center min-h-[350px]">
                <ShieldAlert className="h-12 w-12 text-slate-700 mb-3" />
                <h3 className="text-sm font-semibold text-slate-400">Ready for Analysis</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Fill in the job details on the left and click "Run AI Safety Scan" to inspect fraud risk and red flags.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FakeJobDetector;
