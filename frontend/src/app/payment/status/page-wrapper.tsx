'use client';

import React, { Suspense } from 'react';
import PaymentStatusContent from './PaymentStatusContent';

export default function PaymentStatusPageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}