import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FileSearch, CheckCircle2, AlertCircle, Sparkles, User, Mail, Phone, BookOpen, Wrench, Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const AtsChecker = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileLoading(true);
    setUploadedFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription) {
      formData.append('job_description', jobDescription);
    }

    try {
      const res = await axios.post('http://localhost:8000/api/v1/upload-resume-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data) {
        if (res.data.extracted_text) {
          setResumeText(res.data.extracted_text);
        }
        if (res.data.ats_result) {
          setResult(res.data.ats_result);
        }
        toast.success(`Resume file "${file.name}" uploaded and extracted successfully!`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse uploaded file. Please ensure Python AI microservice is active on port 8000.');
    } finally {
      setFileLoading(false);
    }
  };

  const handleSampleLoad = () => {
    setUploadedFileName('');
    setResumeText(`SURAJ KHILLARE
Email: suraj.khillare@example.com | Phone: +91 9876543210
Education: Master of Computer Applications (MCA), First Year Research Project

Summary:
Full Stack Developer & AI enthusiast with experience in Java Spring Boot, Python FastAPI, React.js, SQL Server, and Docker. Strong background in REST API development, microservices architecture, and machine learning models.

Technical Skills:
- Languages: Java, Python, JavaScript, SQL, HTML, CSS
- Frameworks: Spring Boot, FastAPI, React, Tailwind CSS, Node.js
- Tools & Databases: Git, SQL Server, PostgreSQL, Docker, scikit-learn, Pandas

Projects:
- IntelliHireX AI Platform: Built fake job detection using XGBoost and TF-IDF vectorization with Spring Boot REST API integration.
- E-Commerce Web Application: Developed scalable microservices architecture with React frontend.`);

    setJobDescription(`We are seeking a Senior Full Stack Java Developer.

Requirements:
- Bachelor's or Master's degree in Computer Science or related field.
- Proficiency in Java, Spring Boot, React, SQL, and REST APIs.
- Experience with Microservices, Docker, Kubernetes, and Cloud deployment (AWS).
- Knowledge of Python, FastAPI, and Machine Learning is a huge plus.`);
  };

  const handleCalculateAts = async (e) => {
    e.preventDefault();
    if (!resumeText || !jobDescription) {
      toast.error('Please enter or upload both your Resume content and Target Job Description.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/calculate-ats-score', {
        resume_text: resumeText,
        job_description: jobDescription
      });
      if (res.data && res.data.data) {
        setResult(res.data.data);
        toast.success('ATS Match Score calculated!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to calculate ATS score. Ensure Python AI microservice is active on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full mb-3">
            <FileSearch className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300">ATS Optimization Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
            AI Resume & ATS Match Checker
          </h1>
          <p className="mt-2 text-slate-400 max-w-2xl mx-auto text-sm">
            Evaluate how well your resume matches target job descriptions before applying. Browse and upload your resume file (.pdf, .docx, .txt) or paste content directly.
          </p>

          <div className="mt-3 flex items-center justify-center space-x-3">
            <button
              onClick={handleSampleLoad}
              className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-lg transition"
            >
              Load Sample Resume & Job Description
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Text Areas & Browse File */}
          <div className="lg:col-span-7 space-y-6">

            {/* File Upload Box */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-white flex items-center space-x-2">
                  <Upload className="h-4 w-4 text-indigo-400" />
                  <span>Browse & Upload Resume File</span>
                </label>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Supports PDF, DOCX, TXT</span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="border-2 border-dashed border-indigo-500/30 hover:border-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10 p-4 rounded-xl cursor-pointer transition text-center flex flex-col items-center justify-center space-y-2 group"
              >
                {fileLoading ? (
                  <div className="flex items-center space-x-2 text-indigo-400 text-xs">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Extracting text from resume file...</span>
                  </div>
                ) : (
                  <>
                    <FileText className="h-8 w-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Click here to browse your Resume file
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PDF, DOCX, or TXT format (Auto extracts text)
                      </p>
                    </div>
                  </>
                )}
              </div>

              {uploadedFileName && (
                <div className="mt-3 flex items-center justify-between bg-indigo-950/40 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-xs text-indigo-300">
                  <span className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span>Selected: <strong>{uploadedFileName}</strong></span>
                  </span>
                  <button
                    onClick={() => {
                      setUploadedFileName('');
                      setResumeText('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-[11px] text-slate-400 hover:text-red-400 transition"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Resume Text Area */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <label className="block text-xs font-bold text-white mb-2 flex items-center space-x-2">
                <User className="h-4 w-4 text-indigo-400" />
                <span>Resume Content / Extracted Text</span>
              </label>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Content from your uploaded resume or pasted text will appear here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <label className="block text-xs font-bold text-white mb-2 flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-purple-400" />
                <span>Target Job Description</span>
              </label>
              <textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements and description here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleCalculateAts}
              disabled={loading || fileLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Calculating ATS Score...</span>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Analyze ATS Resume Compatibility</span>
                </>
              )}
            </button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-5">
            {result ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                {/* Score Gauge Circle */}
                <div className="text-center pb-4 border-b border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Overall ATS Compatibility Score
                  </div>
                  <div className="relative inline-flex items-center justify-center">
                    <div className={`text-5xl font-black ${
                      result.ats_score >= 75 ? 'text-emerald-400' : result.ats_score >= 50 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {result.ats_score}%
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    {result.ats_score >= 75 ? 'Strong Match for ATS Filters' : result.ats_score >= 50 ? 'Moderate Keyword Coverage' : 'Needs Optimization'}
                  </div>
                </div>

                {/* Parsed Contact Information */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1">
                    <User className="h-4 w-4 text-indigo-400" />
                    <span>Parsed Contact Details</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>Email: <strong className="text-white">{result.parsed_resume.email}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>Phone: <strong className="text-white">{result.parsed_resume.phone}</strong></span>
                  </div>
                </div>

                {/* Matched Skills */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Matched Skills ({result.matched_skills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched_skills.map((skill, i) => (
                      <span key={i} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-lg font-medium">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                {result.missing_skills.length > 0 && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>Recommended Missing Keywords ({result.missing_skills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missing_skills.map((skill, i) => (
                        <span key={i} className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 rounded-lg font-medium">
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formatting Feedback */}
                {result.formatting_tips.length > 0 && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                    <div className="text-xs font-bold text-indigo-300 mb-2 flex items-center space-x-1">
                      <Wrench className="h-4 w-4" />
                      <span>ATS Improvement Tips</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                      {result.formatting_tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900/50 border border-dashed border-slate-800 p-8 rounded-2xl text-center flex flex-col items-center justify-center min-h-[350px]">
                <FileSearch className="h-12 w-12 text-slate-700 mb-3" />
                <h3 className="text-sm font-semibold text-slate-400">Ready for ATS Matching</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Paste your resume and target job description on the left, then click analyze to inspect compatibility.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AtsChecker;
