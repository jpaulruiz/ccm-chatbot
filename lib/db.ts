import fs from 'fs';
import path from 'path';
import type { DB, Bot, Lead } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function ensureDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function readDB(): DB {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) {
    const empty: DB = { bots: [], leads: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as DB;
}

export function writeDB(db: DB): void {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getBots(): Bot[] {
  return readDB().bots;
}

export function getBot(id: string): Bot | undefined {
  return readDB().bots.find((b) => b.id === id);
}

export function createBot(bot: Bot): Bot {
  const db = readDB();
  db.bots.push(bot);
  writeDB(db);
  return bot;
}

export function updateBot(id: string, updates: Partial<Bot>): Bot | null {
  const db = readDB();
  const idx = db.bots.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  db.bots[idx] = { ...db.bots[idx], ...updates };
  writeDB(db);
  return db.bots[idx];
}

export function deleteBot(id: string): boolean {
  const db = readDB();
  const before = db.bots.length;
  db.bots = db.bots.filter((b) => b.id !== id);
  db.leads = db.leads.filter((l) => l.botId !== id);
  writeDB(db);
  return db.bots.length < before;
}

export function getLeads(botId?: string): Lead[] {
  const db = readDB();
  return botId ? db.leads.filter((l) => l.botId === botId) : db.leads;
}

export function addLead(lead: Lead): Lead {
  const db = readDB();
  db.leads.push(lead);
  const bot = db.bots.find((b) => b.id === lead.botId);
  if (bot) bot.leadCount = (bot.leadCount || 0) + 1;
  writeDB(db);
  return lead;
}
