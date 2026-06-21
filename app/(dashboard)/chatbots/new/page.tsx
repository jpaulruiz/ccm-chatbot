'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const COLORS = ['#2d9d6f', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

export default function NewBotPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    greeting: 'Hi! How can I help you today? 😊',
    primaryColor: '#2d9d6f',
    systemPrompt: '',
    knowledge: '',
  });

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const bot = await res.json();
    router.push(`/chatbots/${bot.id}`);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[#3b82f6] font-bold mb-1">Chatbots</p>
        <h1 className="text-2xl font-bold">Create a new chatbot</h1>
        <p className="text-[#9aa7bd] text-sm mt-1">Fill in the details, add a knowledge base, then get your embed script.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#9aa7bd] font-bold mb-2">Bot name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Sunshine Nursery Assistant"
            className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2d9d6f] transition"
          />
        </div>

        {/* Greeting */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#9aa7bd] font-bold mb-2">Welcome message</label>
          <input
            value={form.greeting}
            onChange={(e) => set('greeting', e.target.value)}
            placeholder="Hi! How can I help you today?"
            className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2d9d6f] transition"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#9aa7bd] font-bold mb-2">Brand colour</label>
          <div className="flex items-center gap-3">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => set('primaryColor', c)}
                className="w-8 h-8 rounded-full border-2 transition"
                style={{
                  background: c,
                  borderColor: form.primaryColor === c ? '#fff' : 'transparent',
                }}
              />
            ))}
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => set('primaryColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border border-[#1f2940]"
              title="Custom colour"
            />
          </div>
        </div>

        {/* Custom system prompt */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#9aa7bd] font-bold mb-2">
            Custom instructions <span className="text-[#54607a] normal-case tracking-normal font-normal">(optional)</span>
          </label>
          <textarea
            value={form.systemPrompt}
            onChange={(e) => set('systemPrompt', e.target.value)}
            rows={3}
            placeholder="e.g. Always be friendly. Refer parents to call 0800 123 456 for urgent queries."
            className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2d9d6f] transition resize-none"
          />
        </div>

        {/* Knowledge base */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#9aa7bd] font-bold mb-1">Knowledge base</label>
          <p className="text-xs text-[#54607a] mb-2">Paste your nursery content here — fees, Ofsted info, opening hours, FAQs, policies. The AI will use this to answer parents accurately.</p>
          <textarea
            value={form.knowledge}
            onChange={(e) => set('knowledge', e.target.value)}
            rows={8}
            placeholder="E.g.&#10;Fees: £55/day for full-time, £32/day for part-time&#10;Opening hours: Mon–Fri 7:30am–6:00pm&#10;Ofsted rating: Outstanding (2023)&#10;..."
            className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2d9d6f] transition resize-none font-mono"
          />
          <p className="text-xs text-[#54607a] mt-1">{form.knowledge.length} characters</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#2d9d6f] to-[#3b82f6] text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create chatbot →'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-[#0e1626] border border-[#1f2940] text-[#9aa7bd] font-semibold px-5 py-2.5 rounded-lg hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
