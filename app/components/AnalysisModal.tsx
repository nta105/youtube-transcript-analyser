import React from 'react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: {
    id: string;
    videoId: string;
    videoTitle: string;
    analysis: string;
    createdAt: Date;
    updatedAt: Date;
  };
  isEditing: boolean;
  editedAnalysis: string;
  setEditedAnalysis: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  isUpdating: boolean;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isEditing,
  editedAnalysis,
  setEditedAnalysis,
  onEdit,
  onSave,
  isUpdating
}) => {
  if (!isOpen) return null;

  // Format the analysis text with proper styling
  const formattedAnalysis = analysis.analysis
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4 mt-6">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-white mb-3 mt-5">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-white mb-2 mt-4">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-400">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-gray-300">$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-300 leading-relaxed">')
    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2 text-gray-300">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<div class="flex mb-3"><span class="text-red-400 font-bold mr-2">$1.</span><span class="text-gray-300">$2</span></div>');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{analysis.videoTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-400">
              Created: {analysis.createdAt?.toLocaleString() || 'Unknown'}
              {analysis.updatedAt && analysis.updatedAt !== analysis.createdAt && (
                <span> | Updated: {analysis.updatedAt?.toLocaleString()}</span>
              )}
            </div>
            
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={onEdit}
                  className="px-3 py-1 text-sm text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={onSave}
                  disabled={isUpdating}
                  className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${analysis.videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg mb-6"
            ></iframe>
            
            {isEditing ? (
              <textarea
                value={editedAnalysis}
                onChange={(e) => setEditedAnalysis(e.target.value)}
                className="w-full h-64 p-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <div 
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: `<p class="mb-4 text-gray-300 leading-relaxed">${formattedAnalysis}</p>` 
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal; 