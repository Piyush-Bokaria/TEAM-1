import React, { useState } from 'react';
import { ClipboardList, Plus, ChevronDown, ChevronRight, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneratedItem {
  id: string;
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  owner: string;
  sourceRef: string;
}

export const ChecklistGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      setItems([
        {
          id: '1',
          task: 'Define and approve the ICT risk management framework.',
          priority: 'High',
          owner: 'Management Body',
          sourceRef: 'DORA Art. 5(2)'
        },
        {
          id: '2',
          task: 'Implement identification mechanisms for all ICT supported business functions.',
          priority: 'High',
          owner: 'IT Operations',
          sourceRef: 'DORA Art. 8(1)'
        },
        {
          id: '3',
          task: 'Conduct a business impact analysis (BIA) for severe business disruptions.',
          priority: 'Medium',
          owner: 'Risk Committee',
          sourceRef: 'DORA Art. 11(3)'
        }
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-reg-navy">Checklist Generator</h1>
        <p className="text-slate-500">Transform complex regulatory texts into actionable operational tasks.</p>
      </div>

      {/* Input Section */}
      <Card className="p-8 border-reg-teal/30 shadow-md">
        <label className="block text-sm font-medium text-reg-navy mb-2">What regulation or topic do you need a checklist for?</label>
        <div className="flex gap-4">
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., DORA Third Party Risk Management requirements..."
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-reg-teal focus:border-transparent text-sm"
          />
          <Button onClick={handleGenerate} disabled={isGenerating || !topic} className="px-8" isLoading={isGenerating}>
            Generate
          </Button>
        </div>
        <div className="mt-4 flex gap-2 text-xs text-slate-500">
           <span className="font-semibold">Try:</span>
           <button onClick={() => setTopic("Incident Reporting under GDPR")} className="hover:text-reg-teal underline">Incident Reporting under GDPR</button>
           <span>•</span>
           <button onClick={() => setTopic("MiFID II Best Execution")} className="hover:text-reg-teal underline">MiFID II Best Execution</button>
        </div>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-semibold text-reg-navy flex items-center gap-2">
                <ClipboardList size={18} className="text-reg-teal"/> Generated Draft Checklist
              </h3>
              <Badge variant="warning">Draft - Review Required</Badge>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all hover:shadow-sm group">
                  <div 
                    className="p-4 flex items-center gap-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    <div className="text-slate-400 group-hover:text-reg-teal transition-colors">
                      {expandedId === item.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-reg-navy">{item.task}</p>
                    </div>
                    <Badge variant={item.priority === 'High' ? 'error' : 'info'}>{item.priority}</Badge>
                    <div className="text-xs text-slate-500 w-32 text-right">{item.owner}</div>
                  </div>
                  
                  {expandedId === item.id && (
                    <div className="bg-slate-50 px-12 py-4 border-t border-slate-100 text-sm">
                       <div className="flex items-start gap-3">
                          <FileText size={16} className="text-slate-400 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Source Evidence:</span>
                            <p className="text-slate-600 mt-1 italic">"{item.task}..." derived from <span className="font-medium text-reg-navy">{item.sourceRef}</span></p>
                            <button className="text-reg-teal text-xs font-medium mt-2 flex items-center gap-1 hover:underline">
                               Open Document <ArrowRight size={12} />
                            </button>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
               <Button variant="outline" className="gap-2">Export to CSV</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};