"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ContestantsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const seasonId = params.seasonId as string;

  useEffect(() => {
    // Redirect to season detail page with contestants tab
    router.replace(
      `/admin/events/${eventId}/seasons/${seasonId}?tab=contestants`
    );
  }, [eventId, seasonId, router]);

  return null;
}
