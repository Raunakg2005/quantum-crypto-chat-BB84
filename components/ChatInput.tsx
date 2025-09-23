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
        className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
      <button
        type="submit"
        disabled={sending || text.trim().length === 0}
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {sending ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Sending...
          </span>
        ) : (
          'Send'
        )}
      </button>
    </form>
  );
}
