import { useRef, useState, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { ChatMessage } from "@/types";

const QUICK_CHIPS = [
  "วิธีทำนาเปียกสลับแห้ง",
  "คำนวณคาร์บอนเครดิต",
  "วิธีจัดการมูลสัตว์",
  "ประโยชน์ของการหยุดเผาตอซัง",
];

const DIFY_ENDPOINT = "https://api.dify.ai/v1/chat-messages";
const DIFY_KEY = import.meta.env.VITE_DIFY_API_KEY as string | undefined;

export function ChatbotPage() {
  const { messages, addMessage } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: text.trim(),
    };
    addMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(DIFY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(DIFY_KEY ? { Authorization: `Bearer ${DIFY_KEY}` } : {}),
        },
        body: JSON.stringify({
          inputs: {},
          query: text.trim(),
          response_mode: "blocking",
          user: "bolt-user-01",
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const answer = data?.answer ?? "ไม่ได้รับคำตอบจากระบบ";
      addMessage({
        id: `b-${Date.now()}`,
        role: "bot",
        text: answer,
      });
    } catch {
      addMessage({
        id: `b-${Date.now()}`,
        role: "bot",
        text: "ขออภัยครับ ระบบเครือข่ายมีปัญหา กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-5 pt-10 pb-4 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={26} />
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-emerald-700" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display">หมอข้าว</h1>
            <div className="text-xs opacity-80 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-300 rounded-full" />
              ออนไลน์
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <span className="text-sm text-stone-500 anim-blink">
                หมอข้าวกำลังพิมพ์...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick chips */}
      <div className="px-4 pb-2 shrink-0">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              disabled={loading}
              className="shrink-0 bg-white border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-emerald-50 transition-colors disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-stone-100 shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(input);
            }}
            placeholder="พิมพ์คำถาม..."
            disabled={loading}
            className="flex-1 bg-stone-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 disabled:opacity-50 hover:bg-emerald-700 active:scale-95 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div
        className={`max-w-[78%] px-4 py-2.5 shadow-sm text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-amber-500 text-white rounded-2xl rounded-br-md"
            : "bg-white text-stone-800 rounded-2xl rounded-bl-md"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
