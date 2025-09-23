"use client";

import React, { useState, useEffect } from 'react';
import ChatInput from '../components/ChatInput';
import Message from '../components/Message';
import ThemeToggle from '../components/ThemeToggle';
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
  const optimistic: Msg = { id, cipher: '...', plain: undefined, author: 'me', time: new Date().toLocaleTimeString(), keyBits: undefined, status: 'encrypting' };
    setMessages((m) => [optimistic, ...m]);

  const bb84 = (await api.generateKey(256)) as unknown as BB84Data;
  const keyBits = bb84.shared_key;
    const enc = await api.encrypt(text, keyBits);
    const cipher = enc.cipher_hex as string;
    optimistic.cipher = cipher;
    optimistic.keyBits = keyBits;
    optimistic.bb84 = bb84;
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
  }, [viewMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-light text-gray-800 dark:text-gray-200 mb-2">
              Quantum Crypto Chat
            </h1>
            <p className="text-gray-600 dark:text-gray-400">BB84 Quantum Key Distribution</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-center gap-8 mb-6">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={viewMode === 'encrypted'} 
              onChange={() => setViewMode('encrypted')}
              className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Encrypted View</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={viewMode === 'decrypted'} 
              onChange={() => setViewMode('decrypted')}
              className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Decrypted View</span>
          </label>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 min-h-[400px] shadow-sm transition-colors">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-16">
              <p className="text-lg">No messages yet</p>
              <p className="text-sm mt-2">Send a message to start quantum-encrypted communication</p>
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

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm transition-colors">
          <ChatInput onSend={send} placeholder="Type your message..." />
        </div>
      </main>
    </div>
  );
}
