import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

const dataDir = path.join(process.cwd(), "data");
const sitePath = path.join(dataDir, "site-data.json");
const leadsPath = path.join(dataDir, "leads.json");
const siteBlobPath = "rs-construction/data/site-data.json";
const leadsBlobPath = "rs-construction/data/leads.json";
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN));
const requiredServices = [
  { id: "s1", name: "Residential Construction", description: "Custom homes designed around your family, site and future." },
  { id: "s2", name: "Commercial Construction", description: "Efficient, durable workplaces and commercial environments." },
  { id: "s3", name: "Architectural Planning", description: "Site-responsive planning, elevations and coordinated drawings." },
  { id: "s4", name: "Interior Design", description: "Considered interiors from spatial planning to final styling." },
  { id: "s5", name: "Renovation & Remodelling", description: "Careful structural, functional and finish upgrades that unlock more value from existing spaces." },
  { id: "s6", name: "Project Management", description: "Professional control over schedule, quality, budget and coordinated site teams." },
  { id: "s7", name: "Turnkey Construction Solutions", description: "One accountable partner from first concept and approvals to final handover." },
];

export type Lead = {
  id: string; createdAt: string; source: string; status: "New" | "Contacted" | "Converted" | "Closed";
  name: string; mobile: string; email?: string; location?: string; plotSize?: string;
  service?: string; message?: string; notes?: string;
};

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try { return JSON.parse(await fs.readFile(file, "utf8")) as T; } catch { return fallback; }
}
async function writeJson(file: string, value: unknown) {
  if (process.env.VERCEL) throw new Error("Durable storage is not configured. Connect a Vercel Blob store.");
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

async function readBlobJson<T>(pathname: string, fallback: T) {
  if (!useBlob()) return fallback;
  try {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result?.stream) return fallback;
    return JSON.parse(await new Response(result.stream).text()) as T;
  } catch {
    return fallback;
  }
}

async function writeBlobJson(pathname: string, value: unknown) {
  await put(pathname, JSON.stringify(value, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

export function storageStatus() {
  return {
    provider: useBlob() ? "Vercel Blob" : process.env.VERCEL ? "Not configured" : "Local files",
    durable: useBlob() || !process.env.VERCEL,
  };
}

export async function getSiteData() {
  const bundled = await readJson<Record<string, unknown>>(sitePath, {});
  const stored = useBlob() ? await readBlobJson(siteBlobPath, bundled) : bundled;
  const currentServices = Array.isArray(stored.services) ? stored.services as Array<Record<string, unknown>> : [];
  const services = requiredServices.map(required => ({ ...required, ...(currentServices.find(item => item.id === required.id) || {}), name: required.name }));
  const extras = currentServices.filter(item => !requiredServices.some(required => required.id === item.id));
  return { ...stored, services: [...services, ...extras] } as Record<string, unknown>;
}
export async function saveSiteData(data: Record<string, unknown>) {
  if (useBlob()) return writeBlobJson(siteBlobPath, data);
  await writeJson(sitePath, data);
}
export async function getLeads() {
  const bundled = await readJson<Lead[]>(leadsPath, []);
  return useBlob() ? readBlobJson(leadsBlobPath, bundled) : bundled;
}
export async function addLead(input: Omit<Lead, "id" | "createdAt" | "status">) {
  const leads = await getLeads();
  const lead: Lead = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "New" };
  leads.unshift(lead); await saveLeads(leads); return lead;
}
export async function saveLeads(leads: Lead[]) {
  if (useBlob()) return writeBlobJson(leadsBlobPath, leads);
  await writeJson(leadsPath, leads);
}
