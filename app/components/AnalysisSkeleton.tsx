import React from 'react';

const AnalysisSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-6"></div>
      
      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-4/5"></div>
      </div>
      
      <div className="mt-6 space-y-4">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
      
      <div className="mt-6 space-y-4">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );
};

export default AnalysisSkeleton; 