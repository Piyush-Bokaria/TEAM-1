import React from 'react';
import { motion } from 'framer-motion';
import { FileDiff } from 'lucide-react';
import { Card } from './UI';

interface DiffVisualizerProps {
  oldText: string;
  newText: string;
}

export const DiffVisualizer: React.FC<DiffVisualizerProps> = ({ oldText, newText }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <Card className="flex flex-col h-full bg-red-50/30 border-red-100">
        <div className="p-3 border-b border-red-100 flex items-center justify-between bg-red-50/50 rounded-t-[10px]">
          <span className="text-xs font-semibold text-red-800 uppercase tracking-wider flex items-center gap-2">
            <FileDiff size={14} /> Previous Version (v2.0)
          </span>
          <span className="text-[10px] text-red-600">Removed</span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto max-h-[500px] text-sm leading-relaxed text-slate-700 font-serif">
          {oldText.split('\n').map((line, i) => (
             <p key={i} className="mb-2 hover:bg-red-100/50 p-1 rounded transition-colors">{line}</p>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col h-full bg-emerald-50/30 border-emerald-100">
        <div className="p-3 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50 rounded-t-[10px]">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
            <FileDiff size={14} /> Current Version (v2.1)
          </span>
          <span className="text-[10px] text-emerald-600">Added / Modified</span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto max-h-[500px] text-sm leading-relaxed text-slate-800 font-serif">
           {newText.split('\n').map((line, i) => (
             <p key={i} className="mb-2 hover:bg-emerald-100/50 p-1 rounded transition-colors">{line}</p>
          ))}
        </div>
      </Card>
    </div>
  );
};