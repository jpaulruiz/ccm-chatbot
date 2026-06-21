import { getLeads, getBots } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function LeadsPage() {
  const leads = getLeads();
  const bots = getBots();
  const botMap = Object.fromEntries(bots.map((b) => [b.id, b.name]));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-[#9aa7bd] text-sm mt-1">{leads.length} lead{leads.length !== 1 ? 's' : ''} captured</p>
      </div>

      {leads.length === 0 ? (
        <div className="border border-dashed border-[#1f2940] rounded-xl p-16 text-center text-[#9aa7bd]">
          <p className="text-5xl mb-4">◎</p>
          <p className="font-semibold">No leads yet</p>
          <p className="text-sm mt-2">Leads captured by your chatbots will appear here.</p>
        </div>
      ) : (
        <div className="bg-[#0e1626] border border-[#1f2940] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f2940]">
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#9aa7bd] font-bold">Name</th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#9aa7bd] font-bold">Contact</th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#9aa7bd] font-bold">Bot</th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#9aa7bd] font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-[#1f2940] last:border-0 hover:bg-[#111726] transition">
                  <td className="px-5 py-3 font-medium">{lead.name || '—'}</td>
                  <td className="px-5 py-3 text-[#9aa7bd]">{lead.email || lead.phone || '—'}</td>
                  <td className="px-5 py-3 text-[#9aa7bd]">{botMap[lead.botId] || lead.botId}</td>
                  <td className="px-5 py-3 text-[#9aa7bd]">{new Date(lead.capturedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
