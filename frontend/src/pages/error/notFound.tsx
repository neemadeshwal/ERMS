import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="text-center relative z-10 max-w-md">
        {/* Clean Typography */}
        <div className="mb-10">
          <h1 className="text-7xl font-light text-slate-300 mb-6 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl font-medium text-slate-700 mb-4">
            Page not found
          </h2>
          <p className="text-slate-500 text-base leading-relaxed mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-slate-400 text-sm">Let's get you back on track.</p>
        </div>

        {/* Clean Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
          <button
            onClick={handleGoHome}
            className="bg-[#5c66a7] hover:bg-[#4a5490] text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#5c66a7] focus:ring-offset-2 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go home
            </span>
          </button>

          <button
            onClick={handleGoBack}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go back
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
