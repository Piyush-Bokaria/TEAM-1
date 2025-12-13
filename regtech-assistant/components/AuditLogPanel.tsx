import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, User, ShieldAlert } from 'lucide-react';
import { AuditLogItem } from '../types';

interface AuditLogPanelProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
}

export const AuditLogPanel: React.FC<AuditLogPanelProps> = ({ isOpen, onClose, logs }) => {
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
          >
             <div className="p-6 border-b border-reg-border flex items-center justify-between bg-slate-50">
                <div>
                   <h2 className="text-lg font-bold text-reg-navy">Audit Trail</h2>
                   <p className="text-xs text-slate-500">Immutable record of system activities.</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                   <X size={20} className="text-slate-600" />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {logs.map((log) => (
                  <div key={log.id} className="relative pl-6 pb-6 border-l border-slate-200 last:border-0 last:pb-0 group">
                     <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-reg-border group-hover:border-reg-teal transition-colors" />
                     
                     <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-mono text-slate-400">{log.timestamp}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{log.role}</span>
                     </div>
                     
                     <h4 className="text-sm font-semibold text-reg-navy mb-1">{log.action}</h4>
                     <p className="text-sm text-slate-600 mb-2">{log.details}</p>
                     
                     <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                        <User size={12} /> {log.user}
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};