'use client';

import React, { Suspense } from 'react';
import ModelsContent from './ModelsContent';

export default function ModelsPageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ModelsContent />
    </Suspense>
  );
}