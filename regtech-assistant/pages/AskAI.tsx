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

interface SuggestedQuestion {
  id: string;
  text: string;
}

interface Source {
  title: string;
  reference: string;
  lastUsed?: string;
}

export const AskAI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const [recentSources, setRecentSources] = useState<Source[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // BACKEND INTEGRATION POINT
  // Fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setInitialLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');

      // BACKEND INTEGRATION POINT
      // GET /api/ai/chat/history
      // Expected response:
      // {
      //   messages: [
      //     {
      //       id: string,
      //       sender: 'user' | 'ai',
      //       text: string,
      //       sources?: [{ title: string, ref: string }],
      //       timestamp: string
      //     }
      //   ]
      // }
      const historyResponse = await fetch('/api/ai/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        const chatHistory = historyData.messages || historyData.data || [];
        
        // If no history, show welcome message
        if (chatHistory.length === 0) {
          setMessages([
            {
              id: 'welcome',
              sender: 'ai',
              text: "Hello! I am your Compliance Assistant. I can answer questions based on your indexed regulations (DORA, MiFID II, GDPR). How can I help today?"
            }
          ]);
        } else {
          setMessages(chatHistory);
        }
      }

      // BACKEND INTEGRATION POINT
      // GET /api/ai/suggested-questions
      // Expected response:
      // {
      //   questions: [
      //     { id: string, text: string }
      //   ]
      // }
      const questionsResponse = await fetch('/api/ai/suggested-questions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        setSuggestedQuestions(questionsData.questions || questionsData.data || []);
      }

      // BACKEND INTEGRATION POINT
      // GET /api/ai/recent-sources
      // Expected response:
      // {
      //   sources: [
      //     { title: string, reference: string, lastUsed: string }
      //   ]
      // }
      const sourcesResponse = await fetch('/api/ai/recent-sources', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (sourcesResponse.ok) {
        const sourcesData = await sourcesResponse.json();
        setRecentSources(sourcesData.sources || sourcesData.data || []);
      }

    } catch (err) {
      console.error('Failed to fetch initial data:', err);
      setError('Failed to load chat data');
      // Show welcome message on error
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "Hello! I am your Compliance Assistant. I can answer questions based on your indexed regulations (DORA, MiFID II, GDPR). How can I help today?"
        }
      ]);
    } finally {
      setInitialLoading(false);
    }
  };

  // BACKEND INTEGRATION POINT
  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    const currentQuery = query;
    setQuery('');
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');

      // BACKEND INTEGRATION POINT
      // POST /api/ai/chat
      // Request body:
      // {
      //   query: string,
      //   conversationId?: string
      // }
      // Expected response:
      // {
      //   id: string,
      //   text: string,
      //   sources: [
      //     { title: string, ref: string }
      //   ],
      //   conversationId: string
      // }
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentQuery,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMsg: Message = {
        id: data.id || (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || data.response || 'I apologize, but I could not generate a response.',
        sources: data.sources || []
      };

      setMessages(prev => [...prev, aiMsg]);

      // Update recent sources if new ones were provided
      if (data.sources && data.sources.length > 0) {
        setRecentSources(prev => {
          const newSources = data.sources.map((s: any) => ({
            title: s.title,
            reference: s.ref,
            lastUsed: new Date().toISOString()
          }));
          return [...newSources, ...prev].slice(0, 5);
        });
      }

    } catch (err) {
      console.error('AI chat error:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'I apologize, but I encountered an error processing your question. Please try again.',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (initialLoading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-slate-500">Loading chat...</div>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

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
                {msg.sources && msg.sources.length > 0 && (
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
             {suggestedQuestions.length > 0 ? (
               suggestedQuestions.map((q) => (
                 <button key={q.id} onClick={() => { setQuery(q.text); }} className="w-full text-left text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-reg-teal hover:text-reg-teal transition-colors">
                   {q.text}
                 </button>
               ))
             ) : (
               <p className="text-xs text-slate-400 text-center py-4">No suggestions available</p>
             )}
           </div>
        </Card>

        <Card className="flex-1 p-4">
           <h3 className="font-semibold text-reg-navy text-sm mb-3">Sources in Context</h3>
           {recentSources.length > 0 ? (
             recentSources.slice(0, 3).map((source, idx) => (
               <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-2">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-bold text-blue-800">{source.title}</p>
                    <ExternalLink size={12} className="text-blue-500" />
                  </div>
                  <p className="text-[10px] text-blue-600 mt-1">{source.reference} referenced recently.</p>
               </div>
             ))
           ) : (
             <p className="text-xs text-slate-400 text-center py-4">No recent sources</p>
           )}
        </Card>
      </div>
    </div>
  );
};