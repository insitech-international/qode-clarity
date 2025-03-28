import React from 'react';
import { Link } from 'react-router-dom';

const ApiUnavailablePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
          Service Unavailable
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          We're having trouble connecting to our servers. The service may be down or under maintenance.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh Page
          </button>
          
          <div>
            <Link
              to="/"
              className="text-base font-medium text-blue-600 hover:text-blue-500"
            >
              Go back home<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>If this problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default ApiUnavailablePage;