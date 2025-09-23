"use client";

import React, { useState } from 'react';

type Props = {
  cipher: string;
  decrypted?: string | null;
  author?: 'me' | 'them' | string;
  time?: string;
  viewMode?: 'encrypted' | 'decrypted';
  status?: 'encrypting' | 'sent' | 'decrypting' | 'decrypted' | 'error';
  bb84?: {
    sender_bits: string;
    sender_bases: string;
    receiver_bases: string;
    kept_positions: number[];
    shared_key: string;
    eve_bases?: string | null;
  } | null;
};

export default function Message({ cipher, decrypted = null, author = 'them', time, viewMode = 'encrypted', status = 'sent', bb84 = null }: Props) {
  const isMe = author === 'me';
  const bubbleColors = isMe 
    ? 'bg-blue-600 text-white' 
    : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100';

  const statusColors = {
    encrypting: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    sent: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    decrypting: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    decrypted: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
  };

  return (
    <div className={`flex flex-col gap-2 ${isMe ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-3">
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <span className="flex items-center gap-1">
            {author}
          </span>
          {time && <span>• {time}</span>}
        </div>
        {status && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[status as keyof typeof statusColors] || statusColors.error}`}>
            {status}
          </div>
        )}
      </div>

      <div className={`p-4 rounded-lg max-w-[85%] lg:max-w-[70%] sm:max-w-[90%] w-full shadow-sm min-w-0 ${bubbleColors} ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'} transition-colors`}>
        {viewMode === 'encrypted' ? (
          <div
            className="font-mono break-all break-words text-sm leading-relaxed whitespace-pre-wrap w-full min-w-0"
            style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
          >
            {cipher}
          </div>
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap w-full min-w-0" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
            {decrypted ?? <em className="text-blue-600 dark:text-blue-400">Decrypting with quantum key...</em>}
          </div>
        )}

        {bb84 && (
          <div className="mt-4 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3 transition-colors">
            <div className="text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-2">
              Quantum Key Details
            </div>
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Shared key:</span>
                  <CopySharedKeyButton textToCopy={bb84.shared_key} />
                </div>
                <div className="w-full">
                  <code
                    title={bb84.shared_key}
                    className="font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all break-words text-sm block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 transition-colors"
                    style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                  >
                    {bb84.shared_key}
                  </code>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">Kept positions:</span>
                <span className="text-gray-800 dark:text-gray-200">{bb84.kept_positions.join(', ')}</span>
              </div>
            </div>
            
            <details className="mt-3">
              <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-2">
                Show quantum measurement data
              </summary>
              <div className="mt-3 bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-600 max-h-48 overflow-auto transition-colors">
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-700 dark:text-gray-300 font-medium mb-1">Sender bits:</div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 transition-colors">{bb84.sender_bits}</pre>
                  </div>
                  <div>
                    <div className="text-gray-700 dark:text-gray-300 font-medium mb-1">Sender bases:</div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 transition-colors">{bb84.sender_bases}</pre>
                  </div>
                  <div>
                    <div className="text-gray-700 dark:text-gray-300 font-medium mb-1">Receiver bases:</div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 transition-colors">{bb84.receiver_bases}</pre>
                  </div>
                  {bb84.eve_bases && (
                    <div>
                      <div className="text-red-600 dark:text-red-400 font-medium mb-1">Eve bases (eavesdropper):</div>
                      <pre className="whitespace-pre-wrap break-words font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 transition-colors">{bb84.eve_bases}</pre>
                    </div>
                  )}
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

function CopySharedKeyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // no-op: clipboard may be unavailable in some environments
      console.error('copy failed', e);
    }
  };

  return (
    <button
      onClick={doCopy}
      className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 transition-colors"
      aria-label="Copy shared key"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
