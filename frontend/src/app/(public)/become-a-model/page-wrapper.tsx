'use client';

import React, { Suspense } from 'react';
import BecomeModelContent from './BecomeModelContent';

export default function BecomeModelPageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <BecomeModelContent />
    </Suspense>
  );
}