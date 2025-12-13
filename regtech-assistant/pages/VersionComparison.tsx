import React, { useState } from 'react';
import { GitCompare, ArrowRight } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { DiffVisualizer } from '../components/DiffVisualizer';

const MOCK_OLD_TEXT = `
REGULATION PROPOSAL 2020

Article 5
Governance

1. Financial entities shall have an internal governance framework for ICT risk.

2. The management body shall define arrangements related to ICT risk.
`;

const MOCK_NEW_TEXT = `
REGULATION (EU) 2022/2554

Article 5
Governance and organisation

1. Financial entities shall have in place an internal governance and control framework that ensures an effective and prudent management of ICT risk to achieve a high level of digital operational resilience.

2. The management body of the financial entity shall define, approve, oversee and be accountable for the implementation of all arrangements related to the ICT risk management framework.
`;

export const VersionComparison: React.FC = () => {
  const [docA, setDocA] = useState('dora-v1');
  const [docB, setDocB] = useState('dora-v2');
  const [showDiff, setShowDiff] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-reg-navy">Version Comparison</h1>
        <p className="text-slate-500 text-sm">Compare regulatory drafts to identify new obligations.</p>
      </div>

      <Card className="p-4 mb-4 flex flex-col md:flex-row items-center gap-4 bg-slate-50 border-slate-200">
         <div className="flex-1 w-full">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Original Version</label>
            <select 
              value={docA}
              onChange={(e) => setDocA(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-reg-teal focus:ring-1 focus:ring-reg-teal outline-none"
            >
              <option value="dora-v1">DORA Proposal (2020)</option>
              <option value="mifid-v1">MiFID I</option>
            </select>
         </div>

         <div className="text-slate-400">
            <ArrowRight size={20} />
         </div>

         <div className="flex-1 w-full">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">New Version</label>
             <select 
              value={docB}
              onChange={(e) => setDocB(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-reg-teal focus:ring-1 focus:ring-reg-teal outline-none"
            >
              <option value="dora-v2">DORA Final Text (2022)</option>
              <option value="mifid-v2">MiFID II</option>
            </select>
         </div>

         <div className="w-full md:w-auto mt-4 md:mt-auto">
            <Button onClick={() => setShowDiff(true)} className="w-full md:w-auto gap-2">
               <GitCompare size={16} /> Compare
            </Button>
         </div>
      </Card>

      <div className="flex-1 overflow-hidden bg-white rounded-xl border border-reg-border">
         {showDiff ? (
           <div className="h-full p-4">
              <DiffVisualizer oldText={MOCK_OLD_TEXT} newText={MOCK_NEW_TEXT} />
           </div>
         ) : (
           <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <GitCompare size={48} className="mb-4 opacity-20" />
              <p>Select two documents to visualize changes.</p>
           </div>
         )}
      </div>
    </div>
  );
};