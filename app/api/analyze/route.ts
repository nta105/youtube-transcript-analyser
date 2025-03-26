import { NextResponse } from 'next/server';
import { TranscriptSegment } from '@/app/types';

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();
    
    if (!transcript || transcript.length === 0) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }
    
    // Extract the text from the transcript segments
    const fullText = transcript.map((segment: TranscriptSegment) => segment.text).join(' ');
    
    // Prepare the prompt for AI analysis
    const prompt = `Analyze the following YouTube video transcript in detail. Include:
1. Main topics and key points
2. A concise summary
3. Key insights or takeaways
4. Any notable quotes or statements

Transcript:
${fullText}`;
    
    // Call OpenRouter API with DeepSeek model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "HTTP-Referer": "https://youtube-transcript-analyzer.vercel.app", 
        "X-Title": "YouTube Video Analyzer", 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "temperature": 0.7,
        "max_tokens": 2500
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to analyze transcript');
    }
    
    return NextResponse.json({ 
      analysis: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    return NextResponse.json({ error: 'Failed to analyze transcript' }, { status: 500 });
  }
} 