import "remixicon/fonts/remixicon.css";
import { verifyServerAuth } from "@/lib/auth-server";
import AdminLayoutClient from "@/components/admin/layout/AdminLayoutClient";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side auth verification - redirects to /login if not authenticated
    await verifyServerAuth();

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
