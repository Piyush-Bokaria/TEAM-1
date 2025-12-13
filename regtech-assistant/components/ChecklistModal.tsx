import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckSquare, Sparkles } from 'lucide-react';
import { ChecklistItem } from '../types';
import { Button } from './UI';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ChecklistItem[];
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({ isOpen, onClose, items }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-48px)] bg-white rounded-[16px] shadow-2xl border border-reg-border z-50 flex flex-col max-h-[600px]"
          >
             <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-reg-navy text-white rounded-t-[16px]">
                <div className="flex items-center gap-2">
                   <Sparkles size={18} className="text-reg-teal" />
                   <h3 className="font-semibold text-sm">Compliance Checklist</h3>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                   <X size={18} />
                </button>
             </div>

             <div className="p-4 overflow-y-auto flex-1 space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm">No items generated.</p>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-[8px] hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${item.checked ? 'bg-reg-teal border-reg-teal' : 'border-slate-300'}`}>
                         {item.checked && <CheckSquare size={12} className="text-white" />}
                      </div>
                      <div className="flex-1">
                         <p className={`text-sm leading-snug ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.text}</p>
                         {item.isMandatory && <span className="text-[10px] font-bold text-red-500 mt-1 inline-block bg-red-50 px-1.5 rounded">MANDATORY</span>}
                      </div>
                    </motion.div>
                  ))
                )}
             </div>

             <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-[16px]">
                <Button variant="secondary" className="w-full text-xs h-9">Export to Audit Log</Button>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};