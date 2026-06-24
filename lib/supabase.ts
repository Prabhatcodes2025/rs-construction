import type { Lead } from "./store";

const siteSettingsKey = "site_data";

function config() {
  return {
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()?.replace(/\/$/, ""),
  };
}

export function supabaseConfigured() {
  const current = config();
  return Boolean(current.url && current.serviceRoleKey);
}

async function request(path: string, init: RequestInit = {}) {
  const current = config();
  if (!current.url || !current.serviceRoleKey) throw new Error("Database not connected");
  const response = await fetch(`${current.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: current.serviceRoleKey,
      Authorization: `Bearer ${current.serviceRoleKey}`,
      "content-type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await response.text().catch(() => "Supabase request failed"));
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

export async function readSiteDataFromSupabase(fallback: Record<string, unknown>) {
  const rows = await request(`site_settings?select=data&key=eq.${siteSettingsKey}&limit=1`) as Array<{ data?: Record<string, unknown> }> | null;
  return rows?.[0]?.data || fallback;
}

export async function saveSiteDataToSupabase(data: Record<string, unknown>) {
  await request("site_settings", {
    body: JSON.stringify({ data, key: siteSettingsKey, updated_at: new Date().toISOString() }),
    headers: { Prefer: "resolution=merge-duplicates" },
    method: "POST",
  });
}

export async function readLeadsFromSupabase(fallback: Lead[]) {
  const enquiryRows = await request("enquiries?select=payload&order=created_at.desc") as Array<{ payload?: Lead }> | null;
  const popupRows = await request("popup_leads?select=payload&order=created_at.desc") as Array<{ payload?: Lead }> | null;
  const leads = [...(enquiryRows || []), ...(popupRows || [])].map(row => row.payload).filter(Boolean) as Lead[];
  return leads.length ? leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : fallback;
}

export async function saveLeadToSupabase(lead: Lead) {
  const table = lead.source.toLowerCase().includes("popup") ? "popup_leads" : "enquiries";
  await request(table, {
    body: JSON.stringify({
      created_at: lead.createdAt,
      email: lead.email || null,
      message: lead.message || null,
      name: lead.name,
      payload: lead,
      phone: lead.mobile,
      source: lead.source,
      status: lead.status,
    }),
    method: "POST",
  });
}

export async function saveLeadsToSupabase(leads: Lead[]) {
  await request("enquiries?id=gte.0", { method: "DELETE" });
  await request("popup_leads?id=gte.0", { method: "DELETE" });
  const enquiries = leads.filter(lead => !lead.source.toLowerCase().includes("popup"));
  const popupLeads = leads.filter(lead => lead.source.toLowerCase().includes("popup"));
  const rows = (items: Lead[]) => items.map(lead => ({
    created_at: lead.createdAt,
    email: lead.email || null,
    message: lead.message || null,
    name: lead.name,
    payload: lead,
    phone: lead.mobile,
    source: lead.source,
    status: lead.status,
  }));
  if (enquiries.length) await request("enquiries", { body: JSON.stringify(rows(enquiries)), method: "POST" });
  if (popupLeads.length) await request("popup_leads", { body: JSON.stringify(rows(popupLeads)), method: "POST" });
}
