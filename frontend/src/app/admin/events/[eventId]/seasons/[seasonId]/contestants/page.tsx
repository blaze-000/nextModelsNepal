"use client";

import React from 'react';
import { useParams } from 'next/navigation';

export default function ContestantsPage() {
  const { eventId, seasonId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Contestants Management</h1>
      <p className="text-gray-600">Event ID: {eventId}</p>
      <p className="text-gray-600">Season ID: {seasonId}</p>
      <p className="text-gray-600 mt-4">Contestants management functionality coming soon.</p>
    </div>
  );
}