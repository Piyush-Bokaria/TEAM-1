import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, GitCompare, ClipboardList, Clock, ArrowRight, TrendingUp, ShieldAlert } from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Documents Uploaded', value: '142', sub: '+12 this month', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Regulations Indexed', value: '28', sub: 'Across 4 jurisdictions', icon: ShieldAlert, color: 'text-reg-teal', bg: 'bg-reg-teal/10' },
    { label: 'Latest Update', value: 'EU AI Act', sub: 'Detected today', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const activityFeed = [
    { id: 1, action: 'Checklist Generated', target: 'DORA Article 5 - Governance', time: '2 hours ago', user: 'You' },
    { id: 2, action: 'Document Uploaded', target: 'Internal IT Security Policy v2.pdf', time: '5 hours ago', user: 'You' },
    { id: 3, action: 'Version Comparison', target: 'MiFID II v1.0 vs v1.1', time: 'Yesterday', user: 'System' },
    { id: 4, action: 'Regulation Update', target: 'GDPR Amendment (Draft)', time: '2 days ago', user: 'System' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-reg-navy">Compliance Overview</h1>
        <p className="text-slate-500">Welcome back. Here is the latest activity in your workspace.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <Card key={i} className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{m.label}</p>
              <h3 className="text-3xl font-bold text-reg-navy mt-2">{m.value}</h3>
              <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
            </div>
            <div className={`p-3 rounded-xl ${m.bg} ${m.color}`}>
              <m.icon size={24} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-reg-navy flex items-center gap-2">
              <Clock size={18} className="text-reg-teal" /> Recent Activity
            </h3>
            <Button variant="ghost" className="text-xs h-8">View Full Log</Button>
          </div>
          <div className="space-y-6">
            {activityFeed.map((item, idx) => (
              <div key={item.id} className="flex gap-4 relative">
                {idx !== activityFeed.length - 1 && (
                  <div className="absolute left-[19px] top-8 bottom-[-24px] w-px bg-slate-100"></div>
                )}
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 z-10">
                   <div className="w-2 h-2 bg-reg-teal rounded-full"></div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-reg-navy">{item.action}</p>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{item.target}</p>
                  <p className="text-xs text-slate-400 mt-1">by {item.user}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 h-fit bg-gradient-to-br from-reg-navy to-slate-900 text-white border-none">
           <h3 className="font-semibold mb-4">Quick Actions</h3>
           <div className="space-y-3">
             <button 
                onClick={() => navigate('/documents')}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
             >
               <span className="flex items-center gap-3"><FileText size={16}/> Upload Regulation</span>
               <ArrowRight size={16} className="opacity-50" />
             </button>
             <button 
                onClick={() => navigate('/compare')}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
             >
               <span className="flex items-center gap-3"><GitCompare size={16}/> Compare Versions</span>
               <ArrowRight size={16} className="opacity-50" />
             </button>
             <button 
                onClick={() => navigate('/checklists')}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
             >
               <span className="flex items-center gap-3"><ClipboardList size={16}/> Generate Checklist</span>
               <ArrowRight size={16} className="opacity-50" />
             </button>
           </div>
           
           <div className="mt-8 pt-6 border-t border-white/10">
             <p className="text-xs text-slate-400 mb-2">Need help?</p>
             <button 
                onClick={() => navigate('/ask-ai')}
                className="w-full py-2 bg-reg-teal hover:bg-reg-tealDark rounded-lg text-sm font-semibold transition-colors"
             >
               Ask Compliance AI
             </button>
           </div>
        </Card>
      </div>
    </div>
  );
};