import React, { useState, useEffect } from 'react';
import { GitCompare, ArrowRight, Loader2 } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { DiffVisualizer } from '../components/DiffVisualizer';

interface Document {
  id: string;
  title: string;
  version: string;
}

export const VersionComparison: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docA, setDocA] = useState('');
  const [docB, setDocB] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [diffData, setDiffData] = useState<{old: string, new: string} | null>(null);

  // BACKEND INTEGRATION POINT
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    
    try {
      const token = localStorage.getItem('authToken');

      // BACKEND INTEGRATION POINT
      // GET /api/documents
      // Expected response:
      // {
      //   data: [
      //     {
      //       id: string,
      //       title: string,
      //       version: string
      //     }
      //   ]
      // }
      const response = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const result = await response.json();
      setDocuments(result.data || result.documents || result);

    } catch (err) {
      console.error('Fetch documents error:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  // BACKEND INTEGRATION POINT
  const handleCompare = async () => {
    if (!docA || !docB) return;
    setIsComparing(true);
    
    try {
      const token = localStorage.getItem('authToken');

      // BACKEND INTEGRATION POINT
      // POST /api/ai/compare
      // Request body:
      // {
      //   sourceDocId: string,
      //   targetDocId: string
      // }
      // Expected response:
      // {
      //   sourceText: string,
      //   targetText: string,
      //   differences: [
      //     {
      //       type: 'added' | 'removed' | 'modified',
      //       content: string,
      //       lineNumber: number
      //     }
      //   ]
      // }
      const response = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sourceDocId: docA, targetDocId: docB })
      });
      
      if (!response.ok) throw new Error('Comparison failed');
      
      const data = await response.json();
      setDiffData({ old: data.sourceText, new: data.targetText });
      setShowDiff(true);

    } catch (err) {
      console.error('Comparison error:', err);
      alert('Failed to compare documents. Please try again.');
    } finally {
      setIsComparing(false);
    }
  };

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
              disabled={loadingDocs}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-reg-teal focus:ring-1 focus:ring-reg-teal outline-none"
            >
              <option value="">Select Document...</option>
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.title} ({d.version})</option>
              ))}
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
              disabled={loadingDocs}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-reg-teal focus:ring-1 focus:ring-reg-teal outline-none"
            >
              <option value="">Select Document...</option>
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.title} ({d.version})</option>
              ))}
            </select>
         </div>

         <div className="w-full md:w-auto mt-4 md:mt-auto">
            <Button 
              onClick={handleCompare} 
              disabled={isComparing || !docA || !docB} 
              className="w-full md:w-auto gap-2"
              isLoading={isComparing}
            >
               <GitCompare size={16} /> Compare
            </Button>
         </div>
      </Card>

      <div className="flex-1 overflow-hidden bg-white rounded-xl border border-reg-border">
         {showDiff && diffData ? (
           <div className="h-full p-4">
              <DiffVisualizer oldText={diffData.old} newText={diffData.new} />
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