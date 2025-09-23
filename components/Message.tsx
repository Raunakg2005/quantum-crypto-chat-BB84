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
    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
    : 'bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 text-slate-100';

  const statusColors = {
    encrypting: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    sent: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    decrypting: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    decrypted: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    error: 'bg-red-500/20 text-red-300 border-red-500/30'
  };

  return (
    <div className={`flex flex-col gap-2 ${isMe ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="flex items-center gap-1">
            {isMe ? '👤' : '🤖'} {author}
          </span>
          {time && <span>• {time}</span>}
        </div>
        {status && (
          <div className={`px-2 py-1 rounded-full text-[10px] font-medium border ${statusColors[status as keyof typeof statusColors] || statusColors.error}`}>
            {status}
          </div>
        )}
      </div>

      <div className={`p-4 rounded-2xl max-w-[85%] lg:max-w-[70%] sm:max-w-[90%] w-full shadow-lg min-w-0 ${bubbleColors} ${isMe ? 'rounded-br-md' : 'rounded-bl-md'}`}>
        {viewMode === 'encrypted' ? (
          <div
            className="font-mono break-all break-words text-sm leading-relaxed whitespace-pre-wrap w-full min-w-0"
            style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
          >
            {cipher}
          </div>
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap w-full min-w-0" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
            {decrypted ?? <em className="text-slate-400">⏳ Decrypting with quantum key...</em>}
          </div>
        )}

        {bb84 && (
          <div className="mt-4 text-xs bg-slate-800/60 backdrop-blur-sm border border-slate-600/30 rounded-lg p-3">
            <div className="text-cyan-300 font-semibold mb-2 flex items-center gap-2">
              ⚛️ Quantum Key Details
            </div>
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">🔑 Shared key:</span>
                  <CopySharedKeyButton textToCopy={bb84.shared_key} />
                </div>
                <div className="w-full">
                  <code
                    title={bb84.shared_key}
                    className="font-mono text-cyan-200 whitespace-pre-wrap break-all break-words text-sm block bg-slate-900/20 px-2 py-1 rounded"
                    style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                  >
                    {bb84.shared_key}
                  </code>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">📍 Kept positions:</span>
                <span className="text-emerald-300">{bb84.kept_positions.join(', ')}</span>
              </div>
            </div>
            
            <details className="mt-3">
              <summary className="cursor-pointer text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-2">
                🔬 Show quantum measurement data
              </summary>
              <div className="mt-3 bg-slate-900/80 rounded-lg p-3 border border-slate-700/50 max-h-48 overflow-auto">
                <div className="space-y-3">
                  <div>
                    <div className="text-orange-300 font-medium mb-1">📤 Sender bits:</div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs text-slate-300 bg-slate-800/50 p-2 rounded">{bb84.sender_bits}</pre>
                  </div>
                  <div>
                    <div className="text-blue-300 font-medium mb-1">📐 Sender bases:</div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs text-slate-300 bg-slate-800/50 p-2 rounded">{bb84.sender_bases}</pre>
                  </div>
                  <div>
                    <div className="text-green-300 font-medium mb-1">📐 Receiver bases:</div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs text-slate-300 bg-slate-800/50 p-2 rounded">{bb84.receiver_bases}</pre>
                  </div>
                  {bb84.eve_bases && (
                    <div>
                      <div className="text-red-300 font-medium mb-1">🕵️ Eve bases (eavesdropper):</div>
                      <pre className="whitespace-pre-wrap break-words font-mono text-xs text-slate-300 bg-slate-800/50 p-2 rounded">{bb84.eve_bases}</pre>
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
      className="text-xs text-slate-300 hover:text-white bg-slate-700/40 hover:bg-slate-700/60 px-2 py-1 rounded flex items-center gap-2"
      aria-label="Copy shared key"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
