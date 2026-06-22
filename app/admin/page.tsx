import { AdminDashboard } from "@/components/AdminDashboard";
import { isAdmin } from "@/lib/security";
import { getLeads, getSiteData } from "@/lib/store";
import { redirect } from "next/navigation";
export const dynamic="force-dynamic"; export const metadata={title:"Admin Dashboard"};
export default async function Page(){if(!await isAdmin())redirect("/admin/login");return <AdminDashboard initial={{site:await getSiteData(),leads:await getLeads() as unknown as Array<Record<string,unknown>>}}/>}
