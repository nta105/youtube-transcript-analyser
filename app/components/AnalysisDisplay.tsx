import React from 'react';

interface AnalysisDisplayProps {
  analysis: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  // Convert markdown-style headers to HTML with proper styling
  const formattedAnalysis = analysis
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4 mt-6 border-b border-gray-700 pb-2">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-white mb-3 mt-5">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-white mb-2 mt-4">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-400">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-gray-300">$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-300 leading-relaxed">')
    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2 text-gray-300 list-disc">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<div class="flex mb-3"><span class="text-red-400 font-bold mr-2">$1.</span><span class="text-gray-300">$2</span></div>');

  return (
    <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-gray-700 flex items-center">
        <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Video Analysis
      </h2>
      <div 
        className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: `<p class="mb-4 text-gray-300 leading-relaxed">${formattedAnalysis}</p>` 
        }} 
      />
    </div>
  );
};

export default AnalysisDisplay; 