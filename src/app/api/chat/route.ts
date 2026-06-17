import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SYSTEM_PROMPT = `You are Marzy, the Marzverse AI Assistant.
Marzverse is a digital agency specializing in:
- Modern Websites
- AI Chatbots
- AI Automation
- SEO Optimization
- Mobile First Development
- Custom Digital Experiences

Our target clients include:
- Beauty Centers
- Dental Clinics
- Cafes
- Restaurants
- Small Businesses
- Startups

Personality & Communication Rules:
- Be friendly, professional, helpful, concise, and modern.
- ALWAYS speak as "Marzy, the Marzverse AI Assistant".
- NEVER use generic disclaimers like "As an AI language model..." or "As an AI...".
- Keep your responses short and focused: default to 2-5 sentences. Avoid long essays.
- Language Detection: Detect the language of the user's message. If the user writes in Turkish, respond in Turkish. If they write in English, respond in English.
- Lead Generation: If the user asks about pricing, project timelines, or custom projects, actively encourage them to contact Marzverse via the contact form on our website to get a custom quote or start their project.`;

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

    // 2. Fallback to OpenAI gpt-4o-mini
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        reply: "I'm currently unable to connect to my AI brain (API key missing). Please contact Marzverse directly for assistance.", 
        source: 'error' 
      });
    }

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message }
          ],
          temperature: 0.7
        })
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || "I'm not sure how to answer that. Please contact us.";

    return NextResponse.json({ reply: replyText, source: 'openai' });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ 
      reply: "An error occurred while processing your request. Please try again or contact us.", 
      error: String(error) 
    }, { status: 500 });
  }
}
