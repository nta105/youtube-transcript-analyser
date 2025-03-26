import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import AnalysisModal from './AnalysisModal';
import { SavedAnalysis } from '@/app/types';

interface SavedAnalysesProps {
  userId: string;
}

const SavedAnalyses: React.FC<SavedAnalysesProps> = ({ userId }) => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnalysis, setEditedAnalysis] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const q = query(
          collection(db, 'analyses'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedAnalyses: SavedAnalysis[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedAnalyses.push({
            id: doc.id,
            userId: data.userId,
            videoId: data.videoId,
            videoTitle: data.videoTitle,
            analysis: data.analysis,
            transcript: data.transcript,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
          });
        });
        
        setAnalyses(fetchedAnalyses);
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchAnalyses();
    }
  }, [userId]);
  
  const handleOpenModal = (analysis: SavedAnalysis) => {
    setSelectedAnalysis(analysis);
    setEditedAnalysis(analysis.analysis);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedAnalysis(null);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSaveEdit = async () => {
    if (!selectedAnalysis) return;
    
    setIsUpdating(true);
    
    try {
      const analysisRef = doc(db, 'analyses', selectedAnalysis.id);
      await updateDoc(analysisRef, {
        analysis: editedAnalysis,
        updatedAt: new Date()
      });
      
      // Update local state
      setAnalyses(prev => 
        prev.map(item => 
          item.id === selectedAnalysis.id 
            ? { ...item, analysis: editedAnalysis, updatedAt: new Date() } 
            : item
        )
      );
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating analysis:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this analysis? This action cannot be undone.")) {
      setIsDeleting(id);
      
      try {
        const analysisRef = doc(db, 'analyses', id);
        await deleteDoc(analysisRef);
        
        // Update local state
        setAnalyses(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting analysis:', error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Your Saved Analyses</h2>
        <div className="flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-700 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-gray-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-700 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="w-full max-w-4xl mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Your Saved Analyses</h2>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-300">You haven&apos;t saved any analyses yet.</p>
          <p className="text-gray-400 mt-2">Analyze a video and click &quot;Save Analysis&quot; to save it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mt-16">
      <h2 className="text-2xl font-bold text-white mb-6">Your Saved Analyses</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analyses.map((analysis) => (
          <div 
            key={analysis.id} 
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors border border-gray-700"
            onClick={() => handleOpenModal(analysis)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-white truncate">{analysis.videoTitle}</h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(analysis.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                disabled={isDeleting === analysis.id}
              >
                {isDeleting === analysis.id ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                )}
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-2">
              {analysis.createdAt ? new Date(analysis.createdAt).toISOString().split('T')[0] : 'Unknown date'}
            </p>
            <p className="text-gray-300 line-clamp-3">{analysis.analysis.substring(0, 150)}...</p>
          </div>
        ))}
      </div>
      
      {selectedAnalysis && (
        <AnalysisModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          analysis={selectedAnalysis}
          isEditing={isEditing}
          editedAnalysis={editedAnalysis}
          setEditedAnalysis={setEditedAnalysis}
          onEdit={handleEdit}
          onSave={handleSaveEdit}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default SavedAnalyses; 