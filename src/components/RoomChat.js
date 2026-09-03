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
    <div className="relative bg-gradient-to-b from-white via-[#fdfcf9] to-[#f8f6f0] border border-[#dcd6c8] rounded-3xl overflow-hidden flex flex-col h-full select-none shadow-[0_2px_4px_rgba(0,0,0,0.02),0_10px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] text-[#121417]">
      {/* Header */}
      <div className="bg-[#f5f2e9] px-4 py-2.5 border-b border-[#e5dfd2] flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <span className={`text-xs font-bold uppercase tracking-wider text-[#121417] ${oswald.className}`}>
          War Room Dispatch & Banter
        </span>
        <span className="text-[10px] text-[#767c84] font-mono bg-white px-2 py-0.5 rounded-md border border-[#ded8cb] shadow-2xs">
          {messages.length} notes
        </span>
      </div>

      {/* Message Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0 bg-gradient-to-b from-[#faf8f2] to-[#f4f1e8] shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#8c8577] text-xs py-6 font-mono italic">
            <p>War room telegraph is silent</p>
            <p className="text-[10px] text-[#a69f92] mt-0.5 not-italic">Send an encrypted dispatch to all managers</p>
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
                  <span className="font-bold text-[#121417]">
                    {msg.sender}
                  </span>
                  <span className="text-[#767c84]">({msg.franchise})</span>
                  <span className="text-[#a69f92]">{msg.time}</span>
                </div>

                <div
                  className={`px-3.5 py-2 rounded-2xl max-w-[85%] text-xs font-medium shadow-xs ${
                    isMe
                      ? "bg-gradient-to-b from-[#185341] to-[#0e3328] text-white rounded-br-xs border border-[#1b5e4a]"
                      : "bg-white text-[#121417] border border-[#ded8cb] rounded-bl-xs"
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
      <div className="p-2.5 border-t border-[#e5dfd2] bg-[#f5f2e9] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send telegraph dispatch to floor..."
          maxLength={150}
          className="flex-1 bg-white text-xs px-3.5 py-2.5 rounded-xl border border-[#d8d1c0] focus:outline-none focus:border-[#124032] text-[#121417] placeholder:text-[#9ca3af] shadow-2xs"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isCooldown}
          className="px-4 py-2.5 bg-gradient-to-b from-[#185341] to-[#0e3328] hover:to-[#09241c] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border border-[#1b5e4a] border-b-2 border-b-[#071c15] shadow-xs active:translate-y-0.5 active:border-b-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}
