"use client";

import { useLenis } from "@/hooks/useLenis";
import { usePathname } from "next/navigation";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");


  useLenis({ enabled: !isAdminRoute });

  return <>{children}</>;
}
