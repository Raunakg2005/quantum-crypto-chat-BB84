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
    <div className="w-full bg-red-600 text-white py-2 px-4 text-sm flex items-center justify-between">
      <div>
        Backend unreachable — please start the backend (see README) or set NEXT_PUBLIC_API_BASE to a running server.
      </div>
      <div>
        <button className="underline mr-2" onClick={() => setDismissed(true)}>Dismiss</button>
      </div>
    </div>
  );
}
