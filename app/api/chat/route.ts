import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { question, transcript, videoId } = await request.json();
    
    if (!question || !transcript) {
      return NextResponse.json({ error: 'Question and transcript are required' }, { status: 400 });
    }
    
    // Prepare the prompt for AI
    const prompt = `You are an AI assistant that answers questions about YouTube videos based on their transcript.

Video ID: ${videoId}
Transcript: ${transcript}

User question: ${question}

Please answer the question based only on the information provided in the transcript. If the answer cannot be found in the transcript, politely say so. Keep your answer concise but informative.`;
    
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
        "max_tokens": 1000
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response');
    }
    
    return NextResponse.json({ 
      response: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json({ error: 'Failed to process your question' }, { status: 500 });
  }
}