import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { TranscriptSegment } from '@/app/types';

interface SaveButtonProps {
  userId: string;
  videoId: string;
  analysis: string;
  transcript: TranscriptSegment[];
  disabled: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ userId, videoId, analysis, transcript, disabled }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (disabled || isSaving || isSaved) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      let videoTitle = 'Untitled Video';
      
      // Try to get video title from YouTube API if key exists
      if (process.env.NEXT_PUBLIC_YOUTUBE_API_KEY && 
          process.env.NEXT_PUBLIC_YOUTUBE_API_KEY !== 'your-youtube-api-key') {
        try {
          const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&part=snippet`);
          const data = await response.json();
          if (data.items && data.items.length > 0 && data.items[0].snippet) {
            videoTitle = data.items[0].snippet.title;
          }
        } catch (ytError) {
          console.error('Error fetching YouTube data:', ytError);
          // Continue with default title
        }
      }
      
      // Save to Firestore
      await addDoc(collection(db, 'analyses'), {
        userId,
        videoId,
        videoTitle,
        analysis,
        transcript: JSON.stringify(transcript),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000); // Reset after 3 seconds
    } catch (error: unknown) {
      console.error('Error saving analysis:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save analysis';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleSave}
        disabled={disabled || isSaving || isSaved}
        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors ${
          isSaved 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Analysis'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default SaveButton; 