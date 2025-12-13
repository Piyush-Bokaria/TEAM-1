import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: { title: string; ref: string }[];
}

export const AskAI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your Compliance Assistant. I can answer questions based on your indexed regulations (DORA, MiFID II, GDPR). How can I help today?"
    }
  ]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    // Simulate AI delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Under DORA Article 5, financial entities are required to establish an internal governance and control framework. This must ensure effective and prudent management of ICT risk to achieve a high level of digital operational resilience. The management body is ultimately accountable for this implementation.",
        sources: [
          { title: 'DORA Regulation (EU) 2022/2554', ref: 'Article 5, Paragraph 1' },
          { title: 'DORA Regulation (EU) 2022/2554', ref: 'Article 5, Paragraph 2' }
        ]
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-xl border border-reg-border shadow-sm overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50" ref={scrollRef}>
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-reg-navy text-white' : 'bg-reg-teal text-white'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`max-w-[80%] space-y-2`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-reg-navy text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
                
                {/* Citations */}
                {msg.sources && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.sources.map((src, idx) => (
                      <button key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-reg-teal/30 text-reg-teal rounded-lg text-xs font-medium hover:bg-reg-teal/5 transition-colors">
                        <BookOpen size={12} />
                        {src.title} • {src.ref}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-reg-teal text-white flex items-center justify-center">
                 <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
           <div className="relative">
             <input 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Ask a question about your regulations..."
               className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-reg-teal focus:bg-white transition-all text-sm"
             />
             <button 
               onClick={handleSend}
               disabled={!query.trim() || loading}
               className="absolute right-2 top-2 p-1.5 bg-reg-navy text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <Send size={16} />
             </button>
           </div>
           <p className="text-xs text-center text-slate-400 mt-2">
             AI generated responses can be inaccurate. Always verify with the source text.
           </p>
        </div>
      </div>

      {/* Side Panel - Evidence / History */}
      <div className="w-80 hidden lg:flex flex-col gap-4">
        <Card className="flex-1 p-4 bg-reg-surface border-slate-200">
           <h3 className="font-semibold text-reg-navy text-sm mb-3 flex items-center gap-2">
             <Sparkles size={14} className="text-reg-teal"/> Suggested Questions
           </h3>
           <div className="space-y-2">
             {["What are the reporting requirements for major ICT incidents?", "Explain the 'Digital Operational Resilience' definition.", "Who is responsible for third-party risk management?"].map((q, i) => (
               <button key={i} onClick={() => { setQuery(q); }} className="w-full text-left text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-reg-teal hover:text-reg-teal transition-colors">
                 {q}
               </button>
             ))}
           </div>
        </Card>

        <Card className="flex-1 p-4">
           <h3 className="font-semibold text-reg-navy text-sm mb-3">Sources in Context</h3>
           <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-2">
              <div className="flex items-start justify-between">
                <p className="text-xs font-bold text-blue-800">DORA Regulation</p>
                <ExternalLink size={12} className="text-blue-500" />
              </div>
              <p className="text-[10px] text-blue-600 mt-1">Article 5 referenced in last answer.</p>
           </div>
        </Card>
      </div>
    </div>
  );
};