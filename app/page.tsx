"use client";

import React, { useState, useEffect } from 'react';
import ChatInput from '../components/ChatInput';
import Message from '../components/Message';
import * as api from '../utils/api';

type Msg = {
  id: string;
  cipher: string;
  plain?: string;
  keyBits?: string;
  bb84?: {
    sender_bits: string;
    sender_bases: string;
    receiver_bases: string;
    kept_positions: number[];
    shared_key: string;
    eve_bases?: string | null;
  };
  author: 'me' | 'them';
  status?: 'encrypting' | 'sent' | 'decrypting' | 'decrypted' | 'error';
  time: string;
};

type BB84Data = {
  sender_bits: string;
  sender_bases: string;
  receiver_bases: string;
  kept_positions: number[];
  shared_key: string;
  eve_bases?: string | null;
};

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [viewMode, setViewMode] = useState<'encrypted' | 'decrypted'>('encrypted');

  const send = async (text: string) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
    // optimistic message with status
  const optimistic: Msg = { id, cipher: '...', plain: undefined, author: 'me', time: new Date().toLocaleTimeString(), keyBits: undefined, status: 'encrypting' };
    setMessages((m) => [optimistic, ...m]);

    // Backend-only flow: request BB84 key details then encrypt with returned shared key
  const bb84 = (await api.generateKey(256)) as unknown as BB84Data;
  const keyBits = bb84.shared_key;
    // already optimistic.status='encrypting'
    const enc = await api.encrypt(text, keyBits);
    const cipher = enc.cipher_hex as string;
    optimistic.cipher = cipher;
    optimistic.keyBits = keyBits;
    optimistic.bb84 = bb84;
    // do NOT set optimistic.plain until decrypt is run
    optimistic.status = 'sent';
    setMessages((m) => [optimistic, ...m.filter((x) => x.id !== id)]);
  };

  useEffect(() => {
    if (viewMode !== 'decrypted') return;

    (async () => {
      for (const m of messages) {
        if (m.keyBits && m.cipher && !m.plain) {
          try {
            m.status = 'decrypting';
            setMessages((cur) => [...cur]);
            const dec = await api.decrypt(m.cipher, m.keyBits);
            m.plain = dec.message;
            m.status = 'decrypted';
          } catch {
            m.plain = '[decrypt error]';
            m.status = 'error';
          }
        }
      }
      setMessages((cur) => [...cur]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <main className="relative max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Quantum Crypto Chat
          </h1>
          <p className="text-slate-300 text-lg">BB84 Quantum Key Distribution Demo</p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-6">
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              checked={viewMode === 'encrypted'} 
              onChange={() => setViewMode('encrypted')}
              className="w-4 h-4 text-cyan-400 bg-slate-800 border-slate-600 focus:ring-cyan-400 focus:ring-2"
            />
            <span className="text-slate-200 font-medium">🔒 Encrypted View</span>
          </label>
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              checked={viewMode === 'decrypted'} 
              onChange={() => setViewMode('decrypted')}
              className="w-4 h-4 text-cyan-400 bg-slate-800 border-slate-600 focus:ring-cyan-400 focus:ring-2"
            />
            <span className="text-slate-200 font-medium">🔓 Decrypted View</span>
          </label>
        </div>

        <div className="backdrop-blur-sm bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-6 min-h-[400px] shadow-2xl">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 py-12">
              <div className="text-6xl mb-4">⚛️</div>
              <p className="text-lg">No messages yet — send one to experience quantum encryption!</p>
            </div>
          )}
          <div className="flex flex-col-reverse space-y-reverse space-y-4">
            {messages.map((m) => (
              <Message
                key={m.id}
                cipher={m.cipher}
                decrypted={viewMode === 'decrypted' ? m.plain : undefined}
                author={m.author}
                time={m.time}
                viewMode={viewMode}
                status={m.status}
                bb84={m.bb84}
              />
            ))}
          </div>
        </div>

        <div className="backdrop-blur-sm bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 shadow-xl">
          <ChatInput onSend={send} placeholder="Type your quantum-encrypted message..." />
        </div>
      </main>
    </div>
  );
}
