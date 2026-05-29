import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ResumeAnalyzer() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    if (!user?.resumeUrl) {
      setError('Please upload a resume in your profile first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/resume/analyze');
      setResults(data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">AI Resume Analyzer</h1>
          <p className="text-gray-400 mt-1">Get AI-driven insights to improve your resume</p>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 shadow-xl">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-primary-900/30 p-4 rounded-full mb-4 ring-1 ring-primary-500/20">
            <svg className="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-medium text-gray-200 mb-2">
            {!user?.resumeUrl ? 'Missing Resume' : 'Ready to Analyze'}
          </h3>
          
          <p className="text-gray-400 max-w-md mb-6">
            {!user?.resumeUrl 
              ? 'Please go to your Profile and upload a PDF resume before using the AI Analyzer.'
              : 'Our advanced AI will scan your current resume to highlight strengths, identify weaknesses, and suggest missing keywords to boost your hireability.'}
          </p>

          <button
            onClick={handleAnalyze}
            disabled={loading || !user?.resumeUrl}
            className={`px-6 py-2.5 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2 ${
              loading || !user?.resumeUrl
                ? 'bg-dark-700 text-gray-500 cursor-not-allowed hidden-shadow'
                : 'bg-primary-600 text-white hover:bg-primary-500 hover:shadow-primary-600/25 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing Resume...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze My Resume
              </>
            )}
          </button>
          
          {error && <p className="text-red-400 mt-4 text-sm bg-red-400/10 px-4 py-2 rounded-lg">{error}</p>}
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          {/* Overall Score */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 flex items-center space-x-6 col-span-1 md:col-span-2 shadow-xl">
             <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" className="text-dark-700" strokeWidth="8" fill="none" stroke="currentColor"/>
                  <circle 
                     cx="48" cy="48" r="40" strokeWidth="8" fill="none" 
                     className={results.score >= 80 ? 'text-green-500' : results.score >= 60 ? 'text-yellow-500' : 'text-red-500'} 
                     stroke="currentColor" 
                     strokeDasharray={251.2} 
                     strokeDashoffset={251.2 - (251.2 * results.score) / 100}
                     strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                   <span className="text-2xl font-bold text-gray-100">{results.score}</span>
                   <span className="text-xs text-gray-500">/ 100</span>
                </div>
             </div>
             <div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">Resume Score</h3>
                <p className="text-gray-400">
                  {results.score >= 80 
                    ? "Excellent! Your resume is highly competitive and well-structured." 
                    : results.score >= 60 
                    ? "Good start, but your resume could use some improvements to stand out." 
                    : "Your resume needs significant changes to pass ATS systems and impress recruiters."}
                </p>
             </div>
          </div>

          {/* Strengths */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl -mr-16 -mt-16 rounded-full"></div>
             <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                 <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 Key Strengths
             </h3>
             <ul className="space-y-3 relative z-10">
               {results.strengths?.map((str, i) => (
                 <li key={i} className="flex items-start text-sm text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 mt-2 mr-3 shrink-0"></span>
                    {str}
                 </li>
               ))}
             </ul>
          </div>

          {/* Improvements */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl -mr-16 -mt-16 rounded-full"></div>
             <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Areas for Improvement
             </h3>
             <ul className="space-y-3 relative z-10">
               {results.improvements?.map((imp, i) => (
                 <li key={i} className="flex items-start text-sm text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2 mr-3 shrink-0"></span>
                    {imp}
                 </li>
               ))}
             </ul>
          </div>

          {/* Keywords */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 col-span-1 md:col-span-2 shadow-xl">
             <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                 <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                 </svg>
                 Suggested Keywords
             </h3>
             <div className="flex flex-wrap gap-2">
               {results.keywords?.map((kw, i) => (
                 <span key={i} className="px-3 py-1.5 bg-dark-700 text-gray-300 rounded-lg text-sm border border-dark-600 shadow-sm">
                   {kw}
                 </span>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
