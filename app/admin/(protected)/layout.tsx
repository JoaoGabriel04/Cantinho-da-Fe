import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutContent } from "./AdminLayoutContent";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) redirect("/admin/login");

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </div>
  );
}
