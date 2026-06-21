'use client';
import { useState, useRef, useEffect } from 'react';
import type { Bot, Message } from '@/lib/types';

export default function EmbedChat({ bot }: { bot: Bot }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: bot.greeting },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadForm, setLeadForm] = useState(false);
  const [lead, setLead] = useState({ name: '', email: '', phone: '' });
  const [leadSent, setLeadSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`/api/bots/${bot.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const reply = data.reply || `Error: ${data.error}`;
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setMessages((m) => [...m, { role: 'assistant', content: `Error: ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, botId: bot.id }),
    });
    setLeadSent(true);
    setLeadForm(false);
    setMessages((m) => [
      ...m,
      { role: 'assistant', content: `Thanks ${lead.name || 'there'}! We have your details and will be in touch soon. 😊` },
    ]);
  }

  const grad = `linear-gradient(135deg, ${bot.primaryColor}, #3b82f6)`;

  return (
    <div className="flex flex-col h-screen bg-[#0b0f17] text-[#eef2f8] font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1f2940]" style={{ background: grad }}>
        <span className="w-8 h-8 rounded-full bg-white/20 grid place-items-center font-bold text-sm">
          {bot.name[0]}
        </span>
        <div>
          <p className="font-semibold text-sm text-white">{bot.name}</p>
          <p className="text-[10px] text-white/70">AI assistant · Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <span className="w-7 h-7 rounded-full grid place-items-center text-xs font-bold text-white mr-2 flex-shrink-0 mt-0.5"
                style={{ background: grad }}>
                {bot.name[0]}
              </span>
            )}
            <div
              className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-[#111726] border border-[#1f2940] text-[#eef2f8] rounded-bl-sm'
              }`}
              style={msg.role === 'user' ? { background: grad } : {}}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <span className="w-7 h-7 rounded-full grid place-items-center text-xs font-bold text-white mr-2 flex-shrink-0"
              style={{ background: grad }}>
              {bot.name[0]}
            </span>
            <div className="bg-[#111726] border border-[#1f2940] px-4 py-3 rounded-2xl rounded-bl-sm">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9aa7bd] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#9aa7bd] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#9aa7bd] animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Lead capture form */}
      {leadForm && !leadSent && (
        <div className="px-4 py-3 border-t border-[#1f2940] bg-[#0e1626]">
          <p className="text-xs text-[#9aa7bd] mb-2">Leave your details and we'll be in touch:</p>
          <form onSubmit={submitLead} className="space-y-2">
            <input
              value={lead.name}
              onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
              placeholder="Your name"
              className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d9d6f]"
            />
            <input
              type="email"
              value={lead.email}
              onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
              placeholder="Email address"
              className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d9d6f]"
            />
            <input
              value={lead.phone}
              onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))}
              placeholder="Phone (optional)"
              className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d9d6f]"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 text-white text-sm font-semibold py-2 rounded-lg" style={{ background: grad }}>
                Submit
              </button>
              <button type="button" onClick={() => setLeadForm(false)} className="text-xs text-[#9aa7bd] px-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-[#1f2940] bg-[#0c1220]">
        {!leadSent && (
          <button
            onClick={() => setLeadForm((f) => !f)}
            className="text-xs text-[#9aa7bd] mb-2 hover:text-white transition"
          >
            📋 Leave your contact details
          </button>
        )}
        <form onSubmit={send} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            disabled={loading}
            className="flex-1 bg-[#0a0f1b] border border-[#1f2940] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d9d6f] transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl grid place-items-center text-white disabled:opacity-40 transition"
            style={{ background: grad }}
          >
            ↑
          </button>
        </form>
        <p className="text-center text-[10px] text-[#54607a] mt-2">Powered by CCM Chatbots</p>
      </div>
    </div>
  );
}
