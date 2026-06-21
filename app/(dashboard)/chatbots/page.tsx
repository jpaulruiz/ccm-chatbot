import { getBots } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function ChatbotsPage() {
  const bots = getBots();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Chatbots</h1>
          <p className="text-[#9aa7bd] text-sm mt-1">{bots.length} chatbot{bots.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/chatbots/new"
          className="bg-gradient-to-r from-[#2d9d6f] to-[#3b82f6] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          + New chatbot
        </Link>
      </div>

      {bots.length === 0 ? (
        <div className="border border-dashed border-[#1f2940] rounded-xl p-16 text-center text-[#9aa7bd]">
          <p className="text-5xl mb-4">◈</p>
          <p className="font-semibold text-lg">No chatbots yet</p>
          <p className="text-sm mt-2">Create your first chatbot, add a knowledge base, then copy the embed script.</p>
          <Link href="/chatbots/new" className="inline-block mt-5 bg-gradient-to-r from-[#2d9d6f] to-[#3b82f6] text-white text-sm font-semibold px-5 py-2 rounded-lg">
            Create chatbot
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {bots.map((bot) => (
            <Link
              key={bot.id}
              href={`/chatbots/${bot.id}`}
              className="flex items-center justify-between bg-[#0e1626] border border-[#1f2940] rounded-xl px-5 py-4 hover:border-[#2d9d6f55] transition group"
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-10 h-10 rounded-full grid place-items-center text-white font-bold text-base"
                  style={{ background: `linear-gradient(135deg, ${bot.primaryColor}, #3b82f6)` }}
                >
                  {bot.name[0]}
                </span>
                <div>
                  <p className="font-semibold">{bot.name}</p>
                  <p className="text-xs text-[#9aa7bd] mt-0.5">{bot.greeting.slice(0, 60)}{bot.greeting.length > 60 ? '…' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-xs text-[#9aa7bd]">Messages</p>
                  <p className="font-bold">{bot.messageCount || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#9aa7bd]">Leads</p>
                  <p className="font-bold">{bot.leadCount || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#9aa7bd]">Knowledge</p>
                  <p className="font-bold text-xs">{bot.knowledge ? '✓ Set' : '—'}</p>
                </div>
                <span className="text-[#9aa7bd] group-hover:text-white transition">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
