'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Bot } from '@/lib/types';

const COLORS = ['#2d9d6f', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
const TABS = ['Setup', 'Knowledge', 'Embed'] as const;
type Tab = typeof TABS[number];

type Framework = 'HTML' | 'Next.js' | 'React' | 'Vue' | 'Svelte' | 'Astro' | 'WordPress' | 'Shopify' | 'PHP' | 'Laravel';

function getSnippet(framework: Framework, src: string): string {
  switch (framework) {
    case 'HTML':
      return `<!-- Paste before </body> -->\n<script src="${src}" defer></script>`;
    case 'Next.js':
      return `// app/layout.tsx\nimport Script from 'next/script';\n\nexport default function RootLayout({ children }) {\n  return (\n    <html>\n      <body>\n        {children}\n        <Script src="${src}" strategy="lazyOnload" />\n      </body>\n    </html>\n  );\n}`;
    case 'React':
      return `// Add to your root component (e.g. App.tsx)\nimport { useEffect } from 'react';\n\nuseEffect(() => {\n  const s = document.createElement('script');\n  s.src = '${src}';\n  s.defer = true;\n  document.body.appendChild(s);\n}, []);`;
    case 'Vue':
      return `// main.ts or App.vue <script setup>\nimport { onMounted } from 'vue';\n\nonMounted(() => {\n  const s = document.createElement('script');\n  s.src = '${src}';\n  s.defer = true;\n  document.body.appendChild(s);\n});`;
    case 'Svelte':
      return `<!-- +layout.svelte -->\n<svelte:head>\n  <script src="${src}" defer><\/script>\n</svelte:head>`;
    case 'Astro':
      return `---\n// src/layouts/Layout.astro\n---\n<html>\n  <body>\n    <slot />\n    <script src="${src}" defer></script>\n  </body>\n</html>`;
    case 'WordPress':
      return `// functions.php\nfunction ccm_chatbot_script() {\n  wp_enqueue_script(\n    'ccm-chatbot',\n    '${src}',\n    [],\n    null,\n    true // load in footer\n  );\n}\nadd_action( 'wp_enqueue_scripts', 'ccm_chatbot_script' );`;
    case 'Shopify':
      return `{%- comment -%}\n  Add to theme.liquid just before </body>\n{%- endcomment -%}\n<script src="${src}" defer></script>`;
    case 'PHP':
      return `<?php\n// Add before closing </body> tag\n?>\n<script src="<?php echo '${src}'; ?>" defer></script>`;
    case 'Laravel':
      return `{{-- Add to your Blade layout (e.g. app.blade.php) before </body> --}}\n<script src="{{ '${src}' }}" defer></script>`;
  }
}

const FRAMEWORKS: Framework[] = ['HTML', 'Next.js', 'React', 'Vue', 'Svelte', 'Astro', 'WordPress', 'Shopify', 'PHP', 'Laravel'];

export default function BotDetail({ bot: initial }: { bot: Bot }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('Setup');
  const [bot, setBot] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [framework, setFramework] = useState<Framework>('HTML');
  const fileRef = useRef<HTMLInputElement>(null);

  function set(k: keyof Bot, v: string) {
    setBot((b) => ({ ...b, [k]: v }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/bots/${bot.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bot),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${bot.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/bots/${bot.id}`, { method: 'DELETE' });
    router.push('/chatbots');
  }

  // Knowledge file upload — reads txt/pdf/md and appends text
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    set('knowledge', bot.knowledge ? bot.knowledge + '\n\n--- ' + file.name + ' ---\n' + text : text);
    if (fileRef.current) fileRef.current.value = '';
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const widgetSrc = `${origin}/api/widget?botId=${bot.id}`;
  const embedSnippet = getSnippet(framework, widgetSrc);

  function copyEmbed() {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-full grid place-items-center text-white font-bold"
            style={{ background: `linear-gradient(135deg, ${bot.primaryColor}, #3b82f6)` }}
          >
            {bot.name[0]}
          </span>
          <div>
            <h1 className="text-xl font-bold">{bot.name}</h1>
            <p className="text-xs text-[#9aa7bd]">Created {new Date(bot.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-red-400 hover:text-red-300 border border-red-900/40 px-3 py-1.5 rounded-lg transition"
        >
          {deleting ? 'Deleting…' : 'Delete bot'}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'Total messages', value: bot.messageCount || 0 },
          { label: 'Leads captured', value: bot.leadCount || 0 },
        ].map((s) => (
          <div key={s.label} className="bg-[#0e1626] border border-[#1f2940] rounded-xl px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-[#9aa7bd] font-bold">{s.label}</p>
            <p className="text-2xl font-extrabold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#1f2940]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition border-b-2 -mb-px ${
              tab === t
                ? 'border-[#2d9d6f] text-white'
                : 'border-transparent text-[#9aa7bd] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* --- SETUP TAB --- */}
      {tab === 'Setup' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#9aa7bd] font-bold mb-2">Bot name</label>
            <input
              value={bot.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2d9d6f] transition"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#9aa7bd] font-bold mb-2">Welcome message</label>
            <input
              value={bot.greeting}
              onChange={(e) => set('greeting', e.target.value)}
              className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2d9d6f] transition"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#9aa7bd] font-bold mb-2">Brand colour</label>
            <div className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('primaryColor', c)}
                  className="w-8 h-8 rounded-full border-2 transition"
                  style={{ background: c, borderColor: bot.primaryColor === c ? '#fff' : 'transparent' }}
                />
              ))}
              <input
                type="color"
                value={bot.primaryColor}
                onChange={(e) => set('primaryColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-[#1f2940] bg-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#9aa7bd] font-bold mb-2">Custom instructions</label>
            <textarea
              value={bot.systemPrompt}
              onChange={(e) => set('systemPrompt', e.target.value)}
              rows={3}
              placeholder="e.g. Always be friendly. Refer parents to call 0800 123 456 for urgent queries."
              className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2d9d6f] transition resize-none"
            />
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="bg-gradient-to-r from-[#2d9d6f] to-[#3b82f6] text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>
      )}

      {/* --- KNOWLEDGE TAB --- */}
      {tab === 'Knowledge' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Knowledge base</p>
              <p className="text-xs text-[#9aa7bd] mt-0.5">The AI reads this to answer questions accurately. Paste or upload your content.</p>
            </div>
            <span className="text-xs text-[#9aa7bd]">{bot.knowledge.length} chars</span>
          </div>

          {/* File upload */}
          <div
            className="border-2 border-dashed border-[#1f2940] rounded-xl p-6 text-center cursor-pointer hover:border-[#2d9d6f] transition"
            onClick={() => fileRef.current?.click()}
          >
            <p className="text-2xl mb-1">📄</p>
            <p className="text-sm text-[#9aa7bd]">
              <span className="text-[#2d9d6f] font-semibold">Click to upload</span> a .txt, .md, or .csv file
            </p>
            <p className="text-xs text-[#54607a] mt-1">File contents will be added to the knowledge base</p>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.csv,.json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <textarea
            value={bot.knowledge}
            onChange={(e) => set('knowledge', e.target.value)}
            rows={14}
            placeholder="Paste your nursery info here — fees, opening hours, Ofsted rating, FAQs, policies, staff details…"
            className="w-full bg-[#0a0f1b] border border-[#1f2940] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2d9d6f] transition resize-none font-mono"
          />

          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="bg-gradient-to-r from-[#2d9d6f] to-[#3b82f6] text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save knowledge'}
            </button>
            {bot.knowledge && (
              <button
                onClick={() => { set('knowledge', ''); }}
                className="text-xs text-red-400 border border-red-900/40 px-4 py-2.5 rounded-lg hover:text-red-300 transition"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- EMBED TAB --- */}
      {tab === 'Embed' && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold mb-1">Your embed script</p>
            <p className="text-xs text-[#9aa7bd]">Select your platform, copy the snippet, and paste it into your site. The chat widget appears instantly.</p>
          </div>

          {/* Framework selector */}
          <div className="flex flex-wrap gap-1.5">
            {FRAMEWORKS.map((f) => (
              <button
                key={f}
                onClick={() => { setFramework(f); setCopied(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  framework === f
                    ? 'bg-gradient-to-r from-[#2d9d6f] to-[#3b82f6] text-white border-transparent'
                    : 'bg-[#0a0f1b] border-[#1f2940] text-[#9aa7bd] hover:text-white hover:border-[#2d9d6f55]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Code card */}
          <div className="bg-[#0a0f1b] border border-[#1f2940] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1f2940] bg-[#0c1220]">
              <span className="text-xs text-[#9aa7bd] font-mono">{framework} · embed snippet</span>
              <button
                onClick={copyEmbed}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
                  copied
                    ? 'bg-[#0e1c14] border-[#1c3a26] text-green-400'
                    : 'bg-[#0e1626] border-[#1f2940] text-[#eef2f8] hover:bg-[#152038]'
                }`}
              >
                {copied ? '✓ Copied' : '⎘ Copy'}
              </button>
            </div>
            <pre className="px-5 py-4 text-sm font-mono text-[#9ece6a] overflow-x-auto whitespace-pre leading-relaxed">
              {embedSnippet}
            </pre>
          </div>

          {/* Preview link */}
          <div className="border border-[#1f2940] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Preview your widget</p>
              <p className="text-xs text-[#9aa7bd] mt-0.5">Open the chat widget in isolation to test it.</p>
            </div>
            <a
              href={`/embed/${bot.id}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm bg-[#0e1626] border border-[#1f2940] px-4 py-2 rounded-lg hover:border-[#2d9d6f55] transition"
            >
              Open preview ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
