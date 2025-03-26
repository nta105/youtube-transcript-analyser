'use client';

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from './firebase/config';
import YouTubeInput from './components/YouTubeInput';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import AnalysisDisplay from './components/AnalysisDisplay';
import AnalysisSkeleton from './components/AnalysisSkeleton';
import ChatBox from './components/ChatBox';
import AuthButton from './components/AuthButton';
import SaveButton from './components/SaveButton';
import SavedAnalyses from './components/SavedAnalyses';
import { TranscriptSegment } from './types';
import ClientOnly from './components/ClientOnly';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setTranscript(null);
    setVideoId(null);
    setAnalysis(null);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No transcript available for this video. Try a different video or check if captions are enabled.');
        } else {
          throw new Error(data.error || 'Failed to extract transcript');
        }
      }
      
      setTranscript(data.transcript);
      setVideoId(data.videoId);
      
      // Now analyze the transcript
      setIsAnalyzing(true);
      
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: data.transcript }),
      });
      
      const analysisData = await analysisResponse.json();
      
      if (!analysisResponse.ok) {
        throw new Error(analysisData.error || 'Failed to analyze transcript');
      }
      
      setAnalysis(analysisData.analysis);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      // Small delay to show 100% progress
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        setIsAnalyzing(false);
      }, 500);
    }
  };

  const handleReset = () => {
    setTranscript(null);
    setVideoId(null);
    setError(null);
    setAnalysis(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl flex justify-between items-center mb-8">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              <h1 className="text-3xl font-bold text-white">YouTube Video Analyzer</h1>
            </div>
            {!authLoading && <AuthButton isLoggedIn={!!user} userEmail={user?.email} />}
          </div>
          
          <p className="text-gray-300 mb-8 text-center max-w-2xl">
            Enter a YouTube video URL to extract and analyze its content with AI
          </p>
          
          {!isLoading && !transcript && !error && (
            <YouTubeInput onSubmit={handleSubmit} isLoading={isLoading} />
          )}
          
          {isLoading && (
            <LoadingSpinner progress={Math.round(progress)} />
          )}
          
          {error && (
            <ErrorDisplay message={error} onReset={handleReset} />
          )}
          
          {transcript && videoId && (
            <div className="w-full max-w-4xl space-y-8">
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
              
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Video Analysis</h2>
                <div className="flex space-x-3">
                  {user && analysis && !isAnalyzing && (
                    <SaveButton 
                      userId={user.uid} 
                      videoId={videoId} 
                      analysis={analysis} 
                      transcript={transcript}
                      disabled={isAnalyzing}
                    />
                  )}
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Analyze Another Video
                  </button>
                </div>
              </div>
              
              {isAnalyzing && <AnalysisSkeleton />}
              
              {!isAnalyzing && analysis && <AnalysisDisplay analysis={analysis} />}
              
              {!isAnalyzing && transcript && videoId && (
                <ChatBox transcript={transcript} videoId={videoId} />
              )}
            </div>
          )}
          
          <ClientOnly>
            {user && <SavedAnalyses userId={user.uid} />}
          </ClientOnly>
        </div>
      </div>
    </main>
  );
}
