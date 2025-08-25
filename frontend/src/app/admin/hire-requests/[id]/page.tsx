"use client";

import React from 'react';
import { useParams } from 'next/navigation';

export default function HireRequestPage() {
  const { id } = useParams() as { id: string };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Hire Request Details</h1>
      <p className="text-gray-600">Request ID: {id}</p>
      <p className="text-gray-600 mt-4">Hire request details functionality coming soon.</p>
    </div>
  );
}