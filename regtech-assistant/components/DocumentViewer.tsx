import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  ListChecks, 
  Sparkles, 
  History,
} from 'lucide-react';
import { Button, Badge, Card } from './UI';
import { extractClauses, generateChecklist } from '../services/geminiService';
import { Clause, ChecklistItem } from '../types';
import { DiffVisualizer } from './DiffVisualizer';
import { ChecklistModal } from './ChecklistModal';

const MOCK_DOC_TEXT = `
REGULATION (EU) 2022/2554 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL
of 14 December 2022
on digital operational resilience for the financial sector.

CHAPTER II
ICT RISK MANAGEMENT

Article 5
Governance and organisation

1. Financial entities shall have in place an internal governance and control framework that ensures an effective and prudent management of ICT risk to achieve a high level of digital operational resilience.

2. The management body of the financial entity shall define, approve, oversee and be accountable for the implementation of all arrangements related to the ICT risk management framework referred to in Article 6(1).

Article 6
ICT risk management framework

1. Financial entities shall have a sound, comprehensive and well-documented ICT risk management framework as part of their overall risk management system, which enables them to address ICT risk quickly, efficiently and comprehensively and to ensure a high level of digital operational resilience.

2. The ICT risk management framework shall include at least strategies, policies, procedures, ICT protocols and tools that are necessary to safeguard the confidentiality, integrity and availability of information assets.
`;

const MOCK_OLD_TEXT = `
REGULATION PROPOSAL 2020

Article 5
Governance

1. Financial entities shall have an internal governance framework for ICT risk.

2. The management body shall define arrangements related to ICT risk.
`;

export const DocumentViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clauses' | 'diff'>('clauses');
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const extracted = await extractClauses(MOCK_DOC_TEXT);
    setClauses(extracted);
    setLoading(false);
    setAnalyzed(true);
  };

  const handleGenerateChecklist = async () => {
    setIsChecklistOpen(true);
    if (checklist.length === 0) {
      setLoading(true);
      const list = await generateChecklist("DORA Regulation", clauses.length > 0 ? clauses : [{title: 'Article 5', content: 'Governance...', riskLevel: 'high', id:'1', page: 1, tags:[]}]);
      setChecklist(list);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <ChecklistModal 
        isOpen={isChecklistOpen} 
        onClose={() => setIsChecklistOpen(false)} 
        items={checklist}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="p-2"><ArrowLeft size={20}/></Button>
          <div>
            <h2 className="font-bold text-reg-navy text-lg">DORA Regulation (Final)</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="bg-slate-200 px-1.5 rounded">v2.1</span>
              <span>• Effective Jan 2025</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {!analyzed && activeTab === 'clauses' && (
             <Button onClick={handleAnalyze} disabled={loading} variant="secondary" className="gap-2">
               <Sparkles size={16} /> {loading ? 'Analyzing...' : 'Analyze with Gemini'}
             </Button>
           )}
           <Button onClick={handleGenerateChecklist} variant="outline" className="gap-2">
              <ListChecks size={16}/> Generate Checklist
           </Button>
           <Button variant="ghost" className="p-2"><Share2 size={18}/></Button>
        </div>
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-[12px] w-fit mb-4">
           <button 
             onClick={() => setActiveTab('clauses')}
             className={`px-4 py-2 text-sm font-medium rounded-[8px] transition-all ${activeTab === 'clauses' ? 'bg-white text-reg-navy shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Clause Analysis
           </button>
           <button 
             onClick={() => setActiveTab('diff')}
             className={`px-4 py-2 text-sm font-medium rounded-[8px] transition-all flex items-center gap-2 ${activeTab === 'diff' ? 'bg-white text-reg-navy shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <History size={14} /> Compare Versions
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
           {activeTab === 'diff' ? (
              <DiffVisualizer oldText={MOCK_OLD_TEXT} newText={MOCK_DOC_TEXT} />
           ) : (
             <div className="flex gap-6 h-full">
               {/* PDF View */}
               <Card className="flex-1 h-full flex flex-col overflow-hidden">
                  <div className="bg-slate-50 p-2 border-b border-reg-border text-center text-xs text-slate-500">Viewing: DORA_Final_EN.pdf</div>
                  <div className="p-8 overflow-y-auto h-full bg-slate-50/30">
                     <pre className="font-serif whitespace-pre-wrap text-slate-800 leading-relaxed max-w-3xl mx-auto">{MOCK_DOC_TEXT}</pre>
                  </div>
               </Card>
               
               {/* Analysis Sidebar */}
               <div className="w-[350px] overflow-y-auto pr-1 space-y-4">
                  {!analyzed && !loading && (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-[12px]">
                       <Sparkles className="mx-auto mb-3 text-slate-300" size={32}/>
                       <p className="text-sm text-slate-500">Run Gemini analysis to extract obligations and risk levels.</p>
                    </div>
                  )}
                  
                  {clauses.map((clause) => (
                   <Card key={clause.id} className="p-4 border-l-4 border-l-reg-teal cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-reg-navy text-sm">{clause.title}</h4>
                        <Badge variant={clause.riskLevel === 'high' ? 'error' : 'warning'}>
                           {clause.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-2">{clause.content}</p>
                   </Card>
                 ))}
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};