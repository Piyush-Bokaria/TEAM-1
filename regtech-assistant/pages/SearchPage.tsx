import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Building, ChevronRight } from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Mock results
  const results = [
    { 
      id: '1', 
      title: 'Digital Operational Resilience Act (DORA)', 
      snippet: '...financial entities shall maintain a comprehensive <strong>digital operational resilience</strong> testing programme as an integral part of the ICT risk management framework...',
      regulator: 'EU Parliament',
      date: '2023-01-16',
      relevance: 98,
      type: 'Regulation'
    },
    { 
      id: '2', 
      title: 'Guidelines on ICT and security risk management', 
      snippet: '...financial institutions should establish and maintain a sound ICT and security risk management framework...',
      regulator: 'EBA',
      date: '2022-11-20',
      relevance: 85,
      type: 'Guideline'
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Search Bar & Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
           <div className="flex-1 relative">
             <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
             <input 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-reg-teal focus:border-transparent outline-none shadow-sm"
               placeholder="Search for obligation keywords (e.g., 'third-party risk', 'reporting timelines')..."
             />
           </div>
           <Button className="px-6">Search</Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" className="text-xs py-1.5 h-8 gap-2"><Filter size={14}/> All Filters</Button>
           <select className="bg-white border border-slate-300 text-xs rounded px-2 py-1.5 h-8 outline-none focus:border-reg-teal">
              <option>Jurisdiction: All</option>
              <option>EU</option>
              <option>US</option>
              <option>UK</option>
           </select>
           <select className="bg-white border border-slate-300 text-xs rounded px-2 py-1.5 h-8 outline-none focus:border-reg-teal">
              <option>Sector: Banking</option>
              <option>Securities</option>
              <option>Insurance</option>
           </select>
           <select className="bg-white border border-slate-300 text-xs rounded px-2 py-1.5 h-8 outline-none focus:border-reg-teal">
              <option>Date: Last Year</option>
           </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto space-y-4 pr-2">
         {query && <p className="text-sm text-slate-500 mb-2">Found {results.length} results for "{query}"</p>}
         
         {results.map((r) => (
           <Card key={r.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
             <div onClick={() => navigate(`/documents/${r.id}`)}>
               <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="info">{r.type}</Badge>
                      <span className="text-xs text-slate-500 font-mono">{r.regulator}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-reg-navy group-hover:text-reg-teal transition-colors">
                      {r.title}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end">
                     <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{r.relevance}% Match</div>
                  </div>
               </div>
               
               <div 
                 className="mt-3 text-sm text-slate-600 leading-relaxed pl-3 border-l-2 border-slate-200"
                 dangerouslySetInnerHTML={{ __html: r.snippet }} 
               />
               
               <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex gap-4">
                     <span className="flex items-center gap-1"><Calendar size={14}/> {r.date}</span>
                     <span className="flex items-center gap-1"><Building size={14}/> Financial Services</span>
                  </div>
                  <div className="flex items-center text-reg-teal opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Open Document <ChevronRight size={16} />
                  </div>
               </div>
             </div>
           </Card>
         ))}
      </div>
    </div>
  );
};