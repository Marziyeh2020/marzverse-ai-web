import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SYSTEM_PROMPT = `You are Marzverse Assistant, a helpful AI for the Marzverse startup.
Marzverse exclusively offers three services:
1. Modern Websites (1-4 pages)
2. AI Chatbots
3. AI Automation

Rules:
- You must ONLY answer questions based on these Marzverse services.
- Never invent services that Marzverse does not offer.
- Keep your answers concise, professional, and friendly.
- If a user asks about something outside of these services or you are unsure, politely ask the visitor to contact Marzverse.`;

function findFaqMatch(query: string, faqs: { question: string; answer: string }[]) {
  const normalizedQuery = query.toLowerCase().replace(/[^\w\s]/gi, '');
  const queryWords = normalizedQuery.split(' ').filter(w => w.length > 2);
  
  if (queryWords.length === 0) return null;

  let bestMatch = null;
  let highestScore = 0;

  for (const faq of faqs) {
    const normalizedQ = faq.question.toLowerCase().replace(/[^\w\s]/gi, '');
    const qWords = normalizedQ.split(' ');
    
    let score = 0;
    for (const word of queryWords) {
      if (qWords.includes(word)) score++;
    }
    
    const matchPercentage = score / Math.max(queryWords.length, qWords.length);
    
    if (matchPercentage >= 0.4 && matchPercentage > highestScore) {
      highestScore = matchPercentage;
      bestMatch = faq.answer;
    }
  }

  return bestMatch;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. Search FAQ Dataset
    const dataPath = path.join(process.cwd(), 'chatbot-data.json');
    if (fs.existsSync(dataPath)) {
      const faqData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const match = findFaqMatch(message, faqData);
      if (match) {
        return NextResponse.json({ reply: match, source: 'faq' });
      }
    }

    // 2. Fallback to Gemini 2.5 Flash
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        reply: "I'm currently unable to connect to my AI brain (API key missing). Please contact Marzverse directly for assistance.", 
        source: 'error' 
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to answer that. Please contact us.";

    return NextResponse.json({ reply: replyText, source: 'gemini' });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ 
      reply: "An error occurred while processing your request. Please try again or contact us.", 
      error: String(error) 
    }, { status: 500 });
  }
}
