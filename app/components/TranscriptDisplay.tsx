import React from 'react';
import { TranscriptSegment } from '../types';

interface TranscriptDisplayProps {
  transcript: TranscriptSegment[];
  videoId: string;
  onReset: () => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, videoId, onReset }) => {
  return (
    <div className="w-full max-w-4xl">
      <div className="mb-6">
        <div className="aspect-video w-full mb-4">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Transcript</h2>
          <button
            onClick={onReset}
            className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Analyze Another Video
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 max-h-[600px] overflow-y-auto">
        {transcript.map((segment, index) => (
          <div key={index} className="mb-3 pb-3 border-b border-gray-100 last:border-0">
            <div className="flex items-start">
              <span className="text-xs font-medium text-gray-500 mr-2 mt-1 w-12">
                {formatTime(segment.start)}
              </span>
              <p className="text-gray-800">{segment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptDisplay; 