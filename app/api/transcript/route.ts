import { NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js/web';

// Function to extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }
    
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }
    
    // Initialize Innertube
    const youtube = await Innertube.create({
      lang: 'en',
      location: 'US',
      retrieve_player: false,
    });
    
    // Get video info
    const info = await youtube.getInfo(videoId);
    
    // Fetch transcript
    let transcript = [];
    
    try {
      const transcriptData = await info.getTranscript();
      
      if (!transcriptData || !transcriptData.transcript || !transcriptData.transcript.content || !transcriptData.transcript.content.body) {
        throw new Error('Transcript data is not in expected format');
      }
      
      // Map the transcript segments to the format expected by the app
      transcript = transcriptData.transcript.content.body.initial_segments.map((segment: any) => ({
        text: segment.snippet.text,
        start: segment.start_ms / 1000, // Convert ms to seconds
        duration: (segment.end_ms - segment.start_ms) / 1000 // Calculate duration in seconds
      }));
    } catch (transcriptError) {
      console.error('Error fetching transcript:', transcriptError);
      return NextResponse.json({ error: 'No transcript available for this video' }, { status: 404 });
    }
    
    if (transcript && transcript.length > 0) {
      return NextResponse.json({ 
        transcript,
        videoId
      });
    } else {
      return NextResponse.json({ error: 'No transcript available for this video' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
  }
} 