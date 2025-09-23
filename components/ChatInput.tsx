import React, { useState } from 'react';

type Props = {
  onSend: (text: string) => void | Promise<void>;
  placeholder?: string;
};

export default function ChatInput({ onSend, placeholder = 'Type a message...' }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    try {
      setSending(true);
      await onSend(trimmed);
      setText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex gap-3 items-center">
      <input
        aria-label="message-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={sending}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { submit(); } }}
        className="flex-1 px-4 py-3 rounded-xl bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
      />
      <button
        type="submit"
        disabled={sending || text.trim().length === 0}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
      >
        {sending ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Encrypting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            🚀 Send
          </span>
        )}
      </button>
    </form>
  );
}
