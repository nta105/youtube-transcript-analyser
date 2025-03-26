import React from 'react';

interface TranscriptErrorDisplayProps {
  message: string;
  onReset: () => void;
}

const TranscriptErrorDisplay: React.FC<TranscriptErrorDisplayProps> = ({ message, onReset }) => {
  return (
    <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-900/30 mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Transcript Error</h3>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex space-x-4">
          <button
            onClick={onReset}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Try Another Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptErrorDisplay; 