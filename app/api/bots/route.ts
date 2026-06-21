import { NextResponse } from 'next/server';
import { getBots, createBot } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import type { Bot } from '@/lib/types';

export async function GET() {
  const bots = getBots();
  return NextResponse.json(bots);
}

export async function POST(req: Request) {
  const body = await req.json();
  const bot: Bot = {
    id: uuidv4(),
    name: body.name || 'My Chatbot',
    greeting: body.greeting || 'Hi! How can I help you today?',
    primaryColor: body.primaryColor || '#2d9d6f',
    knowledge: body.knowledge || '',
    systemPrompt: body.systemPrompt || '',
    createdAt: new Date().toISOString(),
    messageCount: 0,
    leadCount: 0,
  };
  createBot(bot);
  return NextResponse.json(bot, { status: 201 });
}
