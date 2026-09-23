import React, { useState, useRef, useEffect } from 'react';
import { askGeminiChatbot } from '../services/geminiApi';
import { Bot, Send, User, Sparkles, X, ChevronUp, MessageSquare } from 'lucide-react';

interface AiChatbotProps {
  geminiKey: string;
  contextInfo?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({ geminiKey, contextInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am MK TRADER AI Assistant. Ask me about market technicals, RSI strategy, OTC candlestick patterns, or Forex lot sizing!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputText;
    setInputText('');
    setIsLoading(true);

    const botReplyText = await askGeminiChatbot(geminiKey, currentQuery, contextInfo);

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-orbitron font-extrabold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 group transition-all duration-300 transform hover:scale-105"
      >
        <div className="relative">
          <Bot className="w-6 h-6 stroke-[2.5]" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black"></span>
          </span>
        </div>
        <span className="text-xs uppercase tracking-wider">MK AI CHATBOT</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 w-full max-w-sm sm:max-w-md h-[480px] bg-[#121824] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0c1019] to-slate-900 border-b border-slate-800 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-xs text-cyan-400 uppercase tracking-wider">
              MK TRADER AI ASSISTANT
            </h3>
            <span className="text-[10px] text-slate-400">Powered by Gemini AI Engine</span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0d14]/80">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.sender === 'user' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs font-sans leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold rounded-tr-none'
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className={`text-[9px] block mt-1 text-right ${msg.sender === 'user' ? 'text-amber-950' : 'text-slate-500'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>Analyzing market query with Gemini AI...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={geminiKey ? "Ask AI strategy question..." : "Set Gemini Key in settings first..."}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black rounded-xl transition shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
