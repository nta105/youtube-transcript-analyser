import React from 'react';

interface LoadingSpinnerProps {
  progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ progress }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-700 rounded-full animate-spin border-t-red-500"></div>
        {progress !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-300">{progress}%</span>
          </div>
        )}
      </div>
      <p className="text-gray-400">Processing video content...</p>
    </div>
  );
};

export default LoadingSpinner; 