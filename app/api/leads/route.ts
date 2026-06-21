import { NextResponse } from 'next/server';
import { addLead } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const body = await req.json();
  const lead = addLead({
    id: uuidv4(),
    botId: body.botId,
    name: body.name || undefined,
    email: body.email || undefined,
    phone: body.phone || undefined,
    capturedAt: new Date().toISOString(),
  });
  return NextResponse.json(lead, { status: 201 });
}
