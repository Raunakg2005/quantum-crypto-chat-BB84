"use client";

import { useEffect, useState } from 'react';
import { healthCheck } from './api';

export function useBackendStatus(pollInterval = 5000) {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function check() {
      const ok = await healthCheck();
      if (!mounted) return;
      setOnline(ok);
    }

    check();
    const t = setInterval(check, pollInterval);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [pollInterval]);

  return online;
}
