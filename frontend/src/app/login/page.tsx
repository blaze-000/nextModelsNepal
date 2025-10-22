import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import LoginPageClient from "./LoginPageClient";

export default async function LoginPage() {
    // Server-side check - redirect to dashboard if already authenticated
    const authenticated = await isAuthenticated();

    if (authenticated) {
        redirect("/admin/dashboard");
    }

    return <LoginPageClient />;
}
