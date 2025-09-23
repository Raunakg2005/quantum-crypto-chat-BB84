"use client";

import React from 'react';
import { useState } from 'react';
import { useBackendStatus } from '../utils/backend';

export default function BackendStatusBanner() {
  const status = useBackendStatus(5000);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (status === null) return null; // still checking
  if (status) return null; // online

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 py-3 px-4 text-sm flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-amber-400 dark:bg-amber-500 rounded-full"></span>
        <span>Backend connection unavailable. Please check your backend service configuration.</span>
      </div>
      <div>
        <button 
          className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 underline transition-colors" 
          onClick={() => setDismissed(true)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
