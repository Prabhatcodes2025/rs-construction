import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const sitePath = path.join(dataDir, "site-data.json");
const leadsPath = path.join(dataDir, "leads.json");

export type Lead = {
  id: string; createdAt: string; source: string; status: "New" | "Contacted" | "Closed";
  name: string; mobile: string; email?: string; location?: string; plotSize?: string;
  service?: string; message?: string;
};

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try { return JSON.parse(await fs.readFile(file, "utf8")) as T; } catch { return fallback; }
}
async function writeJson(file: string, value: unknown) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

export async function getSiteData() { return readJson<Record<string, unknown>>(sitePath, {}); }
export async function saveSiteData(data: Record<string, unknown>) { await writeJson(sitePath, data); }
export async function getLeads() { return readJson<Lead[]>(leadsPath, []); }
export async function addLead(input: Omit<Lead, "id" | "createdAt" | "status">) {
  const leads = await getLeads();
  const lead: Lead = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "New" };
  leads.unshift(lead); await writeJson(leadsPath, leads); return lead;
}
export async function saveLeads(leads: Lead[]) { await writeJson(leadsPath, leads); }
