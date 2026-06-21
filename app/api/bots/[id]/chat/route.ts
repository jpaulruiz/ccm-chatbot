import { NextResponse } from 'next/server';
import { getBot, updateBot } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message } from '@/lib/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bot = getBot(id);
  if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 });

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });
  }

  const { messages }: { messages: Message[] } = await req.json();

  const systemInstruction = `You are a helpful assistant for "${bot.name}".
${bot.systemPrompt ? bot.systemPrompt + '\n' : ''}
${bot.knowledge
    ? `Use the following knowledge base to answer questions accurately:\n\n---\n${bot.knowledge}\n---\n`
    : ''}
If a user asks something not covered by the knowledge base, say you don't have that information and suggest they contact the team directly.
Keep responses concise and friendly.`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction,
  });

  // Gemini requires history to start with a 'user' message — drop any leading assistant messages (e.g. the greeting)
  const allButLast = messages.slice(0, -1);
  const firstUserIdx = allButLast.findIndex((m) => m.role === 'user');
  const history = (firstUserIdx === -1 ? [] : allButLast.slice(firstUserIdx)).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  try {
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    updateBot(id, { messageCount: (bot.messageCount || 0) + 1 });

    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[chat error]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
