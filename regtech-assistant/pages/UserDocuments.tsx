import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, Download, Eye, MoreHorizontal } from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';

const mockDocuments = [
  { id: '1', title: 'DORA Regulation (EU) 2022/2554', authority: 'EU Parliament', year: '2022', status: 'Active', category: 'Cybersecurity' },
  { id: '2', title: 'MiFID II Directive 2014/65/EU', authority: 'ESMA', year: '2014', status: 'Active', category: 'Securities' },
  { id: '3', title: 'AML Fifth Directive', authority: 'EU Commission', year: '2018', status: 'Archived', category: 'Anti-Money Laundering' },
  { id: '4', title: 'Internal Data Privacy Policy', authority: 'Internal', year: '2023', status: 'Draft', category: 'Policy' },
  { id: '5', title: 'Basel III Framework', authority: 'BCBS', year: '2010', status: 'Active', category: 'Banking' },
];

export const UserDocuments: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = mockDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.authority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-reg-navy">Document Library</h1>
          <p className="text-slate-500 text-sm">Central repository for regulations, directives, and internal policies.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2"><Download size={16}/> Export List</Button>
           <Button className="gap-2"><FileText size={16}/> Upload Document</Button>
        </div>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, authority, or ID..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-reg-teal focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-reg-teal cursor-pointer">
                <option>Authority: All</option>
                <option>EU Parliament</option>
                <option>ESMA</option>
                <option>Internal</option>
             </select>
             <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-reg-teal cursor-pointer">
                <option>Status: All</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Archived</option>
             </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">Document Name</th>
                <th className="px-6 py-3">Authority</th>
                <th className="px-6 py-3">Year / Version</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-reg-navy flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-reg-teal group-hover:shadow-sm transition-all">
                       <FileText size={16} />
                    </div>
                    {doc.title}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{doc.authority}</td>
                  <td className="px-6 py-4 text-slate-600">{doc.year}</td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                        {doc.category}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={doc.status === 'Active' ? 'success' : doc.status === 'Archived' ? 'neutral' : 'warning'}>
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => navigate(`/documents/${doc.id}`)} className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-reg-navy" title="View">
                          <Eye size={16} />
                       </button>
                       <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-reg-navy" title="More">
                          <MoreHorizontal size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDocs.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No documents found matching your filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};