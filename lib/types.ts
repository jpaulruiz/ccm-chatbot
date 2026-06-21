export interface Bot {
  id: string;
  name: string;
  greeting: string;
  primaryColor: string;
  knowledge: string; // plain text knowledge base
  systemPrompt: string;
  createdAt: string;
  messageCount: number;
  leadCount: number;
}

export interface Lead {
  id: string;
  botId: string;
  name?: string;
  email?: string;
  phone?: string;
  capturedAt: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface DB {
  bots: Bot[];
  leads: Lead[];
}
