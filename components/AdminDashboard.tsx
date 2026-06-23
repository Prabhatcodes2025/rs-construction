"use client";

import {
  BarChart3, BriefcaseBusiness, Check, CheckCircle2, Download, Edit3, Eye, FolderKanban,
  ImageIcon, LogOut, Menu, MessageSquareText, Package, Plus, Save, Search, Settings,
  Star, Trash2, Users, Wrench, X, XCircle
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type Item = Record<string, unknown>;
type StorageState = { provider: string; durable: boolean };
type Field = {
  key: string; label: string;
  type?: "text" | "textarea" | "number" | "select" | "image" | "list" | "checkbox";
  options?: string[]; required?: boolean; full?: boolean;
};
type ModalState = { module: string; index: number | null; draft: Item; title: string } | null;
type DeleteState = { module: string; index: number; label: string } | null;

const navigation = [
  ["projects", "Projects", FolderKanban], ["packages", "Packages", Package],
  ["services", "Services", Wrench], ["team", "Team members", Users],
  ["testimonials", "Testimonials", Star], ["hero", "Hero content", BriefcaseBusiness],
  ["gallery", "Gallery", ImageIcon], ["settings", "Contact details", Settings],
  ["seo", "SEO", Search],
] as const;

const schemas: Record<string, Field[]> = {
  projects: [
    { key: "title", label: "Project title", required: true }, { key: "type", label: "Project type", required: true },
    { key: "category", label: "Category", type: "select", options: ["Ongoing", "Completed"], required: true },
    { key: "location", label: "Location", required: true }, { key: "area", label: "Area" },
    { key: "status", label: "Status" }, { key: "completion", label: "Completion percentage", type: "number" },
    { key: "stage", label: "Construction stage" }, { key: "expectedCompletion", label: "Expected completion" },
    { key: "description", label: "Short description", type: "textarea", full: true },
    { key: "highlights", label: "Key highlights", type: "textarea", full: true },
    { key: "materials", label: "Materials used", type: "textarea", full: true },
    { key: "image", label: "Project image", type: "image", full: true },
    { key: "gallery", label: "Gallery image URLs", type: "list", full: true },
    { key: "ctaText", label: "CTA text" }, { key: "displayOrder", label: "Display order", type: "number" },
    { key: "featured", label: "Featured project", type: "checkbox" },
  ],
  packages: [
    { key: "name", label: "Package name", required: true }, { key: "price", label: "Price per sq.ft", required: true },
    { key: "gstText", label: "GST text" }, { key: "features.Steel", label: "Steel" },
    { key: "features.Windows", label: "Windows" }, { key: "features.Flooring", label: "Flooring" },
    { key: "features.Paint", label: "Paint" }, { key: "features.Electrical", label: "Electrical" },
    { key: "bestFor", label: "Best for" }, { key: "description", label: "Description", type: "textarea", full: true },
    { key: "featureList", label: "Features list", type: "list", full: true },
    { key: "highlighted", label: "Highlight / best value", type: "checkbox" },
    { key: "displayOrder", label: "Display order", type: "number" },
  ],
  services: [
    { key: "name", label: "Service name", required: true },
    { key: "description", label: "Short description", type: "textarea", full: true },
    { key: "detailedDescription", label: "Detailed description", type: "textarea", full: true },
    { key: "icon", label: "Icon name" }, { key: "image", label: "Service image", type: "image", full: true },
    { key: "features", label: "Features", type: "list", full: true }, { key: "benefits", label: "Benefits", type: "list", full: true },
    { key: "ctaText", label: "CTA text" }, { key: "displayOrder", label: "Display order", type: "number" },
    { key: "active", label: "Active", type: "checkbox" },
  ],
  team: [
    { key: "name", label: "Full name", required: true }, { key: "role", label: "Role / designation", required: true },
    { key: "image", label: "Profile image", type: "image", full: true },
    { key: "bio", label: "Short profile", type: "textarea", full: true },
    { key: "displayOrder", label: "Display order", type: "number" },
  ],
  testimonials: [
    { key: "name", label: "Client name", required: true }, { key: "location", label: "Location" },
    { key: "quote", label: "Testimonial", type: "textarea", required: true, full: true },
    { key: "rating", label: "Rating (1–5)", type: "number" },
    { key: "status", label: "Visibility", type: "select", options: ["Published", "Draft"] },
    { key: "displayOrder", label: "Display order", type: "number" },
  ],
  hero: [
    { key: "headline", label: "Main headline", required: true },
    { key: "subheadline", label: "Supporting message", type: "textarea", full: true },
    { key: "image", label: "Hero image", type: "image", full: true },
  ],
  settings: [
    { key: "phone", label: "Primary phone", required: true }, { key: "secondaryPhone", label: "Secondary phone" },
    { key: "email", label: "Business email", required: true },
    { key: "address", label: "Office address", type: "textarea", full: true },
    { key: "map", label: "Google Maps link", full: true }, { key: "social.whatsapp", label: "WhatsApp link", full: true },
  ],
  seo: [
    { key: "homeTitle", label: "Homepage SEO title", required: true, full: true },
    { key: "homeDescription", label: "Homepage meta description", type: "textarea", full: true },
  ],
  gallery: [{ key: "url", label: "Image URL", type: "image", required: true, full: true }],
};

const defaults: Record<string, Item> = {
  projects: { title: "", type: "Residential", category: "Ongoing", location: "", area: "", status: "Planning", completion: 0, stage: "Planning", expectedCompletion: "", description: "", highlights: "", materials: "", image: "/images/project-residence.png", gallery: [], ctaText: "Project enquiry", displayOrder: 0, featured: false },
  packages: { name: "", price: "₹0", gstText: "GST as applicable", features: {}, bestFor: "", description: "", featureList: [], highlighted: false, displayOrder: 0 },
  services: { name: "", description: "", detailedDescription: "", icon: "House", image: "", features: [], benefits: [], ctaText: "Discuss this service", displayOrder: 0, active: true },
  team: { name: "", role: "", image: "/images/rakesh-profile.png", bio: "", displayOrder: 0 },
  testimonials: { name: "", location: "Bengaluru", quote: "", rating: 5, status: "Published", displayOrder: 0 },
  gallery: { url: "" },
};

const moduleLabels: Record<string, string> = {
  projects: "Project", packages: "Package", services: "Service", team: "Team member",
  testimonials: "Testimonial", gallery: "Gallery image", hero: "Hero content",
  settings: "Contact details", seo: "SEO settings",
};

function valueOf(value: unknown) { return value == null ? "" : String(value); }
function formatDate(value: unknown, includeTime = false) {
  const date = new Date(valueOf(value));
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  if (!includeTime) return `${day}/${month}/${year}`;
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes} UTC`;
}
function getNested(item: Item, key: string) {
  return key.split(".").reduce<unknown>((value, part) => value && typeof value === "object" ? (value as Item)[part] : "", item);
}
function setNested(item: Item, key: string, value: unknown): Item {
  const parts = key.split(".");
  if (parts.length === 1) return { ...item, [key]: value };
  const [head, ...rest] = parts;
  return { ...item, [head]: setNested((item[head] || {}) as Item, rest.join("."), value) };
}
function normalizeDraft(module: string, draft: Item) {
  return schemas[module].reduce((result, field) => {
    const value = getNested(result, field.key);
    if (field.type === "number") return setNested(result, field.key, Number(value) || 0);
    if (field.type === "list" && typeof value === "string") return setNested(result, field.key, value.split(/\n|,/).map(item => item.trim()).filter(Boolean));
    return result;
  }, draft);
}
function displayName(module: string, item: Item) {
  if (module === "projects") return valueOf(item.title);
  if (module === "gallery") return valueOf(item.url).split("/").pop() || "Gallery image";
  return valueOf(item.name) || moduleLabels[module];
}

export function AdminDashboard({ initial }: { initial: { site: Record<string, unknown>; leads: Item[]; storage: StorageState } }) {
  const [site, setSite] = useState(initial.site);
  const [leads, setLeads] = useState(initial.leads);
  const [tab, setTab] = useState("overview");
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [source, setSource] = useState("All");
  const [moduleSearch, setModuleSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>(null);
  const [leadModal, setLeadModal] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const projects = Array.isArray(site.projects) ? site.projects as Item[] : [];
  const packages = Array.isArray(site.packages) ? site.packages as Item[] : [];
  const counts = useMemo(() => ({
    enquiries: leads.length,
    new: leads.filter(item => item.status === "New").length,
    contacted: leads.filter(item => item.status === "Contacted").length,
    converted: leads.filter(item => item.status === "Converted").length,
    projects: projects.length,
    ongoing: projects.filter(item => item.category === "Ongoing").length,
    completed: projects.filter(item => item.category === "Completed").length,
    packages: packages.length,
  }), [leads, packages.length, projects]);

  const filteredLeads = leads.filter(item =>
    (status === "All" || item.status === status) &&
    (source === "All" || valueOf(item.source).includes(source)) &&
    `${item.name} ${item.mobile} ${item.email} ${item.location} ${item.source}`.toLowerCase().includes(search.toLowerCase())
  );

  function notify(type: "success" | "error", text: string) {
    setToast({ type, text });
    if (typeof window !== "undefined") window.setTimeout(() => setToast(null), 3200);
  }
  function markSite(next: Record<string, unknown>) { setSite(next); setDirty(true); }
  function markLeads(next: Item[]) { setLeads(next); setDirty(true); }
  function selectTab(name: string) { setTab(name); setMobile(false); setModuleSearch(""); setModuleFilter("All"); }

  async function save() {
    if (!dirty) return notify("success", "Everything is already saved.");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/data", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ site, leads }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save changes. Please try again.");
      setDirty(false);
      notify("success", "Changes saved successfully.");
    } catch {
      notify("error", "Unable to save changes. Please try again.");
    } finally { setSaving(false); }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login"); router.refresh();
  }
  async function uploadImage(file: File) {
    const form = new FormData(); form.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Image upload failed.");
    return String(result.path);
  }

  function moduleItems(module: string): Item[] {
    if (module === "gallery") return (Array.isArray(site.gallery) ? site.gallery : []).map(url => ({ url })) as Item[];
    return Array.isArray(site[module]) ? site[module] as Item[] : [];
  }
  function openAdd(module: string) {
    setModal({ module, index: null, draft: { id: crypto.randomUUID(), ...defaults[module] }, title: `Add ${moduleLabels[module]}` });
  }
  function openEdit(module: string, index: number) {
    const item = moduleItems(module)[index];
    const draft = schemas[module].reduce((result, field) => {
      const value = getNested(result, field.key);
      return field.type === "list" && Array.isArray(value) ? setNested(result, field.key, value.join("\n")) : result;
    }, structuredClone(item));
    setModal({ module, index, draft, title: `Edit ${moduleLabels[module]}` });
  }
  function openSingleton(module: string) {
    setModal({ module, index: 0, draft: structuredClone((site[module] || {}) as Item), title: `Edit ${moduleLabels[module]}` });
  }
  function commitModal(event: FormEvent) {
    event.preventDefault();
    if (!modal) return;
    const clean = normalizeDraft(modal.module, modal.draft);
    if (["hero", "settings", "seo"].includes(modal.module)) {
      markSite({ ...site, [modal.module]: clean });
    } else {
      const items = moduleItems(modal.module);
      const next = modal.index == null ? [...items, clean] : items.map((item, index) => index === modal.index ? clean : item);
      markSite({ ...site, [modal.module]: modal.module === "gallery" ? next.map(item => item.url) : next });
    }
    notify("success", `${moduleLabels[modal.module]} ${modal.index == null ? "added" : "updated"}. Save changes to publish.`);
    setModal(null);
  }
  function confirmDelete() {
    if (!deleteState) return;
    if (deleteState.module === "leads") markLeads(leads.filter((_, index) => index !== deleteState.index));
    else {
      const items: Item[] = moduleItems(deleteState.module).filter((_, index) => index !== deleteState.index);
      markSite({ ...site, [deleteState.module]: deleteState.module === "gallery" ? items.map(item => item.url) : items });
    }
    notify("success", "Item removed. Save changes to publish.");
    setDeleteState(null);
  }
  function quickAdd(module: string) { selectTab(module); openAdd(module); }

  const currentItems: Item[] = ["projects", "packages", "services", "team", "testimonials", "gallery"].includes(tab) ? moduleItems(tab) : [];
  const visibleItems = currentItems.filter(item => {
    const matchesText = JSON.stringify(item).toLowerCase().includes(moduleSearch.toLowerCase());
    const filterKey = tab === "projects" ? valueOf(item.category) : tab === "testimonials" ? valueOf(item.status || "Published") : tab === "services" ? (item.active === false ? "Inactive" : "Active") : "All";
    return matchesText && (moduleFilter === "All" || filterKey === moduleFilter);
  });

  return <main className="admin-app">
    {toast && <div className={`admin-toast ${toast.type}`}>{toast.type === "success" ? <CheckCircle2 /> : <XCircle />}<span>{toast.text}</span></div>}
    <aside className={mobile ? "admin-sidebar open" : "admin-sidebar"}>
      <div className="admin-logo"><span>RS</span><div><strong>Construction</strong><small>Content administration</small></div><button aria-label="Close navigation" onClick={() => setMobile(false)}><X /></button></div>
      <nav>
        <button className={tab === "overview" ? "active" : ""} onClick={() => selectTab("overview")}><BarChart3 />Overview</button>
        <button className={tab === "leads" ? "active" : ""} onClick={() => selectTab("leads")}><MessageSquareText />Enquiries <b>{counts.new}</b></button>
        {navigation.map(([name, label, Icon]) => <button className={tab === name ? "active" : ""} key={name} onClick={() => selectTab(name)}><Icon />{label}</button>)}
      </nav>
      <button className="admin-logout" onClick={logout}><LogOut />Logout</button>
    </aside>

    <section className="admin-main">
      <header>
        <button className="admin-menu" aria-label="Open navigation" onClick={() => setMobile(true)}><Menu /></button>
        <div><span>RS Construction</span><strong>{tab === "overview" ? "Dashboard" : navigation.find(item => item[0] === tab)?.[1] || tab}</strong></div>
        <div className="admin-save-state">{dirty && <span><i />Unsaved changes</span>}</div>
        <div className="admin-header-actions"><a href="/api/admin/export"><Download />Export CSV</a><button disabled={saving || !dirty} onClick={save}><Save />{saving ? "Saving..." : "Save changes"}</button></div>
      </header>

      <div className="admin-content">
        {tab === "overview" && <Dashboard initial={initial} counts={counts} leads={leads} quickAdd={quickAdd} viewLeads={() => selectTab("leads")} />}
        {tab === "leads" && <Enquiries leads={filteredLeads} allLeads={leads} search={search} status={status} source={source} setSearch={setSearch} setStatus={setStatus} setSource={setSource} view={lead => setLeadModal(leads.indexOf(lead))} remove={lead => setDeleteState({ module: "leads", index: leads.indexOf(lead), label: valueOf(lead.name) })} update={(lead, key, value) => markLeads(leads.map(item => item.id === lead.id ? { ...item, [key]: value } : item))} />}
        {["projects", "packages", "services", "team", "testimonials", "gallery"].includes(tab) && <ModuleList module={tab} items={visibleItems} total={currentItems.length} search={moduleSearch} filter={moduleFilter} setSearch={setModuleSearch} setFilter={setModuleFilter} add={() => openAdd(tab)} edit={item => openEdit(tab, currentItems.indexOf(item))} remove={item => setDeleteState({ module: tab, index: currentItems.indexOf(item), label: displayName(tab, item) })} />}
        {["hero", "settings", "seo"].includes(tab) && <SingletonModule module={tab} value={(site[tab] || {}) as Item} edit={() => openSingleton(tab)} />}
      </div>
    </section>

    {modal && <EditorModal state={modal} setDraft={draft => setModal({ ...modal, draft })} close={() => setModal(null)} submit={commitModal} upload={uploadImage} notify={notify} />}
    {deleteState && <ConfirmModal label={deleteState.label} cancel={() => setDeleteState(null)} confirm={confirmDelete} />}
    {leadModal != null && leads[leadModal] && <LeadModal lead={leads[leadModal]} close={() => setLeadModal(null)} update={(key, value) => markLeads(leads.map((item, index) => index === leadModal ? { ...item, [key]: value } : item))} />}
  </main>;
}

function Dashboard({ initial, counts, leads, quickAdd, viewLeads }: { initial: { storage: StorageState }; counts: Record<string, number>; leads: Item[]; quickAdd: (module: string) => void; viewLeads: () => void }) {
  const stats = [["Total enquiries", counts.enquiries], ["New enquiries", counts.new], ["Contacted", counts.contacted], ["Converted", counts.converted], ["Projects", counts.projects], ["Ongoing", counts.ongoing], ["Completed", counts.completed], ["Packages", counts.packages]];
  return <>
    {!initial.storage.durable && <div className="admin-config-warning"><XCircle /><div><strong>Vercel storage needs setup</strong><p>Connect a Vercel Blob store before saving production content or enquiries.</p></div></div>}
    <div className="admin-welcome"><div><span>Dashboard overview</span><h1>Manage the website without touching code.</h1><p>Update public content, review enquiries, and keep project information current.</p><small className={initial.storage.durable ? "storage-ok" : "storage-warning"}>Storage: {initial.storage.provider}</small></div><BriefcaseBusiness /></div>
    <div className="admin-stats expanded">{stats.map(([label, value]) => <article key={label}><small>{label}</small><strong>{value}</strong><span>Current total</span></article>)}</div>
    <div className="admin-dashboard-grid">
      <div className="admin-panel"><div className="panel-title"><div><span>Shortcuts</span><h2>Quick actions</h2></div></div><div className="quick-actions"><button onClick={() => quickAdd("projects")}><Plus />Add project</button><button onClick={() => quickAdd("services")}><Plus />Add service</button><button onClick={() => quickAdd("testimonials")}><Plus />Add testimonial</button><button onClick={viewLeads}><Eye />View enquiries</button></div></div>
      <div className="admin-panel"><h2>Lead sources</h2><div className="source-bars">{["Enquiry Popup", "Contact Form", "Package", "Project"].map(name => <div key={name}><span>{name}</span><i><b style={{ width: `${Math.min(100, Math.max(8, leads.filter(item => valueOf(item.source).includes(name)).length * 20))}%` }} /></i></div>)}</div></div>
      <div className="admin-panel recent-panel"><div className="panel-title"><div><span>Latest activity</span><h2>Recent enquiries</h2></div></div>{leads.slice(0, 5).map(lead => <div className="recent-row" key={valueOf(lead.id)}><div><strong>{valueOf(lead.name)}</strong><span>{valueOf(lead.source)} · {formatDate(lead.createdAt)}</span></div><b className={`status-badge ${valueOf(lead.status).toLowerCase()}`}>{valueOf(lead.status)}</b></div>)}</div>
      <div className="admin-panel"><div className="panel-title"><div><span>Content activity</span><h2>Recent activity</h2></div></div><div className="activity-list"><p><Check />Website content loaded successfully.</p><p><Check />{counts.projects} projects available to manage.</p><p><Check />{counts.packages} construction packages configured.</p><p><Check />Lead export and status tracking are ready.</p></div></div>
    </div>
  </>;
}

function ModuleList({ module, items, total, search, filter, setSearch, setFilter, add, edit, remove }: { module: string; items: Item[]; total: number; search: string; filter: string; setSearch: (value: string) => void; setFilter: (value: string) => void; add: () => void; edit: (item: Item) => void; remove: (item: Item) => void }) {
  const filters = module === "projects" ? ["All", "Ongoing", "Completed"] : module === "testimonials" ? ["All", "Published", "Draft"] : module === "services" ? ["All", "Active", "Inactive"] : [];
  return <div className="admin-panel module-panel">
    <div className="panel-title"><div><span>Content module</span><h1>{module === "team" ? "Team members" : module}</h1><p>{total} item{total === 1 ? "" : "s"} configured. Add and edit through safe forms.</p></div><button className="admin-add" onClick={add}><Plus />Add {moduleLabels[module]}</button></div>
    <div className="admin-filters module-filters"><label><Search /><input value={search} onChange={event => setSearch(event.target.value)} placeholder={`Search ${module}...`} /></label>{filters.length > 0 && <select value={filter} onChange={event => setFilter(event.target.value)}>{filters.map(item => <option key={item}>{item}</option>)}</select>}</div>
    {items.length === 0 ? <div className="admin-empty"><Search /><h3>No items found</h3><p>Change your search or add a new {moduleLabels[module].toLowerCase()}.</p></div> :
      <div className="admin-module-list">{items.map(item => <article key={valueOf(item.id || item.url)}>
        <ModuleSummary module={module} item={item} />
        <div className="module-actions"><button onClick={() => edit(item)}><Edit3 />Edit</button><button className="danger" onClick={() => remove(item)}><Trash2 />Delete</button></div>
      </article>)}</div>}
  </div>;
}

function ModuleSummary({ module, item }: { module: string; item: Item }) {
  const image = valueOf(item.image || item.url);
  return <div className="module-summary">
    {image ? <div className="module-thumb"><Image src={image} alt="" fill sizes="80px" /></div> : <div className="module-thumb placeholder"><ImageIcon /></div>}
    <div className="module-primary"><strong>{displayName(module, item)}</strong><span>{module === "projects" ? `${valueOf(item.type)} · ${valueOf(item.location)}` : module === "packages" ? `${valueOf(item.price)} / sq.ft · ${valueOf(item.bestFor)}` : module === "services" ? valueOf(item.description) : module === "team" ? valueOf(item.role) : module === "testimonials" ? valueOf(item.location) : valueOf(item.url)}</span></div>
    <div className="module-badges">
      {module === "projects" && <><b className={`status-badge ${valueOf(item.category).toLowerCase()}`}>{valueOf(item.category)}</b><span>{valueOf(item.completion)}%</span>{Boolean(item.featured) && <b className="status-badge featured">Featured</b>}</>}
      {module === "packages" && Boolean(item.highlighted || valueOf(item.label).toLowerCase().includes("best")) && <b className="status-badge featured">Best value</b>}
      {module === "services" && <b className={`status-badge ${item.active === false ? "closed" : "converted"}`}>{item.active === false ? "Inactive" : "Active"}</b>}
      {module === "testimonials" && <b className={`status-badge ${valueOf(item.status || "Published").toLowerCase()}`}>{valueOf(item.status || "Published")}</b>}
    </div>
  </div>;
}

function SingletonModule({ module, value, edit }: { module: string; value: Item; edit: () => void }) {
  return <div className="admin-panel module-panel"><div className="panel-title"><div><span>Website settings</span><h1>{moduleLabels[module]}</h1><p>Review the current values and open the editor when changes are needed.</p></div><button className="admin-add" onClick={edit}><Edit3 />Edit {moduleLabels[module]}</button></div><div className="singleton-preview">{schemas[module].map(field => <div key={field.key}><span>{field.label}</span><strong>{valueOf(getNested(value, field.key)) || "Not set"}</strong></div>)}</div></div>;
}

function Enquiries({ leads, allLeads, search, status, source, setSearch, setStatus, setSource, view, remove, update }: { leads: Item[]; allLeads: Item[]; search: string; status: string; source: string; setSearch: (value: string) => void; setStatus: (value: string) => void; setSource: (value: string) => void; view: (lead: Item) => void; remove: (lead: Item) => void; update: (lead: Item, key: string, value: string) => void }) {
  return <div className="admin-panel"><div className="panel-title"><div><span>Lead management</span><h1>Enquiries</h1><p>{allLeads.length} total enquiries with status and internal notes.</p></div><a href="/api/admin/export"><Download />Export CSV</a></div>
    <div className="admin-filters"><label><Search /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, phone, location..." /></label><select value={source} onChange={event => setSource(event.target.value)}><option>All</option><option>Popup</option><option>Contact Form</option><option>Package</option><option>Project</option></select><select value={status} onChange={event => setStatus(event.target.value)}><option>All</option><option>New</option><option>Contacted</option><option>Converted</option><option>Closed</option></select></div>
    {leads.length === 0 ? <div className="admin-empty"><MessageSquareText /><h3>No enquiries found</h3></div> : <div className="admin-table-wrap enquiry-table"><table><thead><tr><th>Date</th><th>Source</th><th>Customer</th><th>Project details</th><th>Status</th><th>Actions</th></tr></thead><tbody>{leads.map(lead => <tr key={valueOf(lead.id)}><td data-label="Date">{formatDate(lead.createdAt)}</td><td data-label="Source"><span className="status-badge source">{valueOf(lead.source)}</span></td><td data-label="Customer"><strong>{valueOf(lead.name)}</strong><small>{valueOf(lead.mobile)} · {valueOf(lead.email) || "No email"}</small></td><td data-label="Project"><span>{valueOf(lead.location) || "No location"} · {valueOf(lead.plotSize) || "No plot size"}</span><small>{valueOf(lead.message) || "No message"}</small></td><td data-label="Status"><select className={`lead-status ${valueOf(lead.status).toLowerCase()}`} value={valueOf(lead.status)} onChange={event => update(lead, "status", event.target.value)}><option>New</option><option>Contacted</option><option>Converted</option><option>Closed</option></select></td><td data-label="Actions"><div className="table-actions"><button onClick={() => view(lead)}><Eye />View</button><button className="danger" onClick={() => remove(lead)}><Trash2 /></button></div></td></tr>)}</tbody></table></div>}
  </div>;
}

function EditorModal({ state, setDraft, close, submit, upload, notify }: { state: NonNullable<ModalState>; setDraft: (draft: Item) => void; close: () => void; submit: (event: FormEvent) => void; upload: (file: File) => Promise<string>; notify: (type: "success" | "error", text: string) => void }) {
  return <div className="admin-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && close()}><form className="admin-modal" onSubmit={submit}>
    <header><div><span>{state.index == null ? "Create new" : "Update existing"}</span><h2>{state.title}</h2></div><button type="button" aria-label="Close editor" onClick={close}><X /></button></header>
    <div className="admin-modal-body"><div className="admin-form-grid">{schemas[state.module].map(field => <AdminField key={field.key} field={field} value={getNested(state.draft, field.key)} onChange={value => setDraft(setNested(state.draft, field.key, value))} onUpload={async file => { try { setDraft(setNested(state.draft, field.key, await upload(file))); notify("success", "Image uploaded."); } catch { notify("error", "Image upload failed."); } }} />)}</div></div>
    <footer><button type="button" className="modal-cancel" onClick={close}>Cancel</button><button className="modal-save" type="submit"><Save />Save {moduleLabels[state.module]}</button></footer>
  </form></div>;
}

function AdminField({ field, value, onChange, onUpload }: { field: Field; value: unknown; onChange: (value: unknown) => void; onUpload: (file: File) => void }) {
  const text = Array.isArray(value) ? value.join("\n") : valueOf(value);
  if (field.type === "checkbox") return <label className={`admin-field checkbox-field ${field.full ? "full" : ""}`}><input type="checkbox" checked={Boolean(value)} onChange={event => onChange(event.target.checked)} /><span><Check />{field.label}</span></label>;
  if (field.type === "image") return <label className={`admin-field image-field ${field.full ? "full" : ""}`}><span>{field.label}</span>{text && <div className="admin-image-preview"><Image src={text} alt="" fill sizes="180px" /></div>}<input value={text} onChange={event => onChange(event.target.value)} placeholder="/images/example.png or uploaded URL" required={field.required} /><input type="file" accept="image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => event.target.files?.[0] && onUpload(event.target.files[0])} /></label>;
  if (field.type === "textarea" || field.type === "list") return <label className={`admin-field ${field.full ? "full" : ""}`}><span>{field.label}{field.type === "list" && " (one per line)"}</span><textarea rows={field.type === "list" ? 4 : 3} value={text} required={field.required} onChange={event => onChange(event.target.value)} /></label>;
  if (field.type === "select") return <label className={`admin-field ${field.full ? "full" : ""}`}><span>{field.label}</span><select value={text} required={field.required} onChange={event => onChange(event.target.value)}>{field.options?.map(option => <option key={option}>{option}</option>)}</select></label>;
  return <label className={`admin-field ${field.full ? "full" : ""}`}><span>{field.label}</span><input type={field.type || "text"} value={text} required={field.required} onChange={event => onChange(event.target.value)} /></label>;
}

function ConfirmModal({ label, cancel, confirm }: { label: string; cancel: () => void; confirm: () => void }) {
  return <div className="admin-modal-backdrop"><div className="confirm-modal"><div className="confirm-icon"><Trash2 /></div><h2>Delete {label}?</h2><p>Are you sure you want to delete this item? This change will be applied after you save.</p><div><button onClick={cancel}>Cancel</button><button className="danger" onClick={confirm}>Delete</button></div></div></div>;
}

function LeadModal({ lead, close, update }: { lead: Item; close: () => void; update: (key: string, value: string) => void }) {
  return <div className="admin-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && close()}><div className="admin-modal lead-modal"><header><div><span>Enquiry details</span><h2>{valueOf(lead.name)}</h2></div><button onClick={close}><X /></button></header><div className="admin-modal-body"><div className="lead-detail-grid">{[["Phone", lead.mobile], ["Email", lead.email], ["Plot location", lead.location], ["Plot size", lead.plotSize], ["Source", lead.source], ["Date", formatDate(lead.createdAt, true)], ["Message", lead.message]].map(([label, value]) => <div key={String(label)}><span>{String(label)}</span><strong>{valueOf(value) || "Not provided"}</strong></div>)}</div><label className="admin-field"><span>Status</span><select value={valueOf(lead.status)} onChange={event => update("status", event.target.value)}><option>New</option><option>Contacted</option><option>Converted</option><option>Closed</option></select></label><label className="admin-field"><span>Internal notes</span><textarea rows={5} value={valueOf(lead.notes)} onChange={event => update("notes", event.target.value)} placeholder="Add follow-up notes for the team..." /></label></div><footer><button className="modal-save" onClick={close}>Done</button></footer></div></div>;
}
