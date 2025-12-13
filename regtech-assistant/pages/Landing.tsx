import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileSearch, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/UI';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-reg-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
           <Shield className="w-10 h-10 text-reg-teal" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-reg-navy tracking-tight">
          Regulatory intelligence for <br/> <span className="text-reg-teal">modern compliance teams</span>.
        </h1>
        
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Automate regulatory ingestion, instantly analyze obligations, and visualize diffs between jurisdictional updates with our Gemini-powered engine.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/dashboard">
             <Button variant="secondary" className="px-8 py-3 text-base">Launch User Dashboard</Button>
          </Link>
          <Link to="/admin">
             <Button variant="outline" className="px-8 py-3 text-base">Admin Portal</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          {[
            { icon: FileSearch, title: "Smart Ingestion", desc: "Drag & drop PDF regulations. Auto-tagging of authoritative sources." },
            { icon: Zap, title: "Instant Analysis", desc: "Gemini extracts obligations and risk levels in seconds." },
            { icon: CheckCircle2, title: "Audit Ready", desc: "Immutable logs and human-in-the-loop verification flows." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-reg-border shadow-sm">
              <feature.icon className="w-8 h-8 text-reg-navy mb-4" />
              <h3 className="text-lg font-semibold text-reg-navy mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};