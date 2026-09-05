"use client";

import { useState, useRef, useEffect } from "react";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

export default function RoomChat({
  messages = [],
  onSendMessage,
  currentManager = "",
  currentFranchise = "",
}) {
  const [inputText, setInputText] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isCooldown) return;

    if (text.length > 150) {
      return alert("Message too long (max 150 characters)");
    }

    onSendMessage(text);
    setInputText("");

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] border border-[#d4be8c]/25 rounded-3xl overflow-hidden flex flex-col h-full select-none shadow-[0_12px_28px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(212,190,140,0.15)] text-white">
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/40 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="bg-[#06140e] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-wider text-[#ecdcb8] ${oswald.className}`}>
          War Room Dispatch & Banter
        </span>
        <span className="text-[10px] text-white/60 font-mono bg-[#040c08] px-2 py-0.5 rounded-md border border-white/10 shadow-xs">
          {messages.length} notes
        </span>
      </div>

      {/* Message Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0 bg-[#040c08]/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/40 text-xs py-6 font-mono italic">
            <p>War room telegraph is silent</p>
            <p className="text-[10px] text-white/30 mt-0.5 not-italic">Send an encrypted dispatch to all managers</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === currentManager;

            return (
              <div
                key={msg.id || msg.timestamp}
                className={`flex flex-col text-xs ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono">
                  <span className="font-bold text-[#ecdcb8]">
                    {msg.sender}
                  </span>
                  <span className="text-[#34d399]/80">({msg.franchise})</span>
                  <span className="text-white/40">{msg.time}</span>
                </div>

                <div
                  className={`px-3.5 py-2 rounded-2xl max-w-[85%] text-xs font-medium shadow-xs ${
                    isMe
                      ? "bg-gradient-to-b from-[#185341] to-[#0e3328] text-white rounded-br-xs border border-[#34d399]/40"
                      : "bg-[#0d2218]/90 text-white/95 border border-white/10 rounded-bl-xs"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Field */}
      <div className="p-2.5 border-t border-white/10 bg-[#06140e] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send telegraph dispatch to floor..."
          maxLength={150}
          className="flex-1 bg-[#040c08] text-xs px-3.5 py-2.5 rounded-xl border border-[#d4be8c]/25 focus:outline-none focus:border-[#34d399] text-white placeholder:text-white/30 shadow-inner"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isCooldown}
          className="px-4 py-2.5 bg-gradient-to-b from-[#1c5d46] to-[#0e3328] hover:from-[#237357] hover:to-[#124032] disabled:opacity-40 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border border-[#34d399]/40 border-b-2 border-b-[#051711] shadow-xs active:translate-y-0.5 active:border-b-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}
