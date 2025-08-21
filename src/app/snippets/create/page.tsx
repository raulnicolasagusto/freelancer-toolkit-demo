'use client';

import { Suspense } from 'react';
import CreateContent from './CreateContent';

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <CreateContent />
    </Suspense>
  );
}