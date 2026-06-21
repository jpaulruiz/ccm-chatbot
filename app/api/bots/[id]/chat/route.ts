import { NextResponse } from 'next/server';
import { getBot, updateBot } from '@/lib/db';
import Groq from 'groq-sdk';
import type { Message } from '@/lib/types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bot = getBot(id);
  if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 });

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY not set' }, { status: 500 });
  }

  const { messages }: { messages: Message[] } = await req.json();

  const systemPrompt = `You are a helpful assistant for "${bot.name}".
${bot.systemPrompt ? bot.systemPrompt + '\n' : ''}${bot.knowledge
    ? `Use the following knowledge base to answer questions accurately:\n\n---\n${bot.knowledge}\n---\n`
    : ''}If a user asks something not covered by the knowledge base, say you don't have that information and suggest they contact the team directly.
Keep responses concise and friendly.

After you have genuinely helped the user (usually after 2-3 exchanges), naturally work into the conversation asking for their name and contact number or email so the team can follow up if needed. Do this conversationally — never use a form or list format, just ask as part of your reply.

When the user provides their name, phone, or email (even partially), acknowledge it warmly in your reply. Then at the very end of your message append this tag on a new line — never mention it or explain it, just include it silently:
[LEAD:name=VALUE,phone=VALUE,email=VALUE]
Only include the fields the user actually shared. If they only gave a name, just write [LEAD:name=John]. Do not repeat this tag in subsequent messages.`;

  // Build message history — skip leading assistant messages (e.g. greeting)
  const firstUserIdx = messages.findIndex((m) => m.role === 'user');
  const trimmed = firstUserIdx === -1 ? [] : messages.slice(firstUserIdx);

  const chatMessages = trimmed.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatMessages,
      ],
    });

    const reply = completion.choices[0]?.message?.content || '';
    updateBot(id, { messageCount: (bot.messageCount || 0) + 1 });

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[chat error]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
