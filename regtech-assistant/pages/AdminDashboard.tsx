import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { UploadCloud, FileText, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { DocumentMetadata } from '../types';

const mockActivityData = [
  { name: 'Mon', ingest: 12, error: 1 },
  { name: 'Tue', ingest: 19, error: 0 },
  { name: 'Wed', ingest: 8, error: 2 },
  { name: 'Thu', ingest: 24, error: 0 },
  { name: 'Fri', ingest: 15, error: 1 },
];

const mockRecentUploads: DocumentMetadata[] = [
  { id: '1', title: 'MiFID II - Delegated Regulation 2024', regulator: 'ESMA', jurisdiction: 'EU', date: '2024-03-15', status: 'processing', version: '2.1', sector: 'Securities' },
  { id: '2', title: 'DORA Implementation Guidelines', regulator: 'EBA', jurisdiction: 'EU', date: '2024-03-10', status: 'active', version: '1.0', sector: 'Cybersecurity' },
  { id: '3', title: 'BSA/AML Examination Manual Update', regulator: 'FFIEC', jurisdiction: 'US', date: '2024-02-28', status: 'active', version: '4.5', sector: 'Banking' },
];

export const AdminDashboard: React.FC = () => {
  const [uploads, setUploads] = useState<DocumentMetadata[]>(mockRecentUploads);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulation of drop
    const newDoc: DocumentMetadata = {
      id: Math.random().toString(),
      title: 'Uploaded Regulation Draft.pdf',
      regulator: 'Pending',
      jurisdiction: 'Global',
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
      version: '0.1',
      sector: 'General'
    };
    setUploads([newDoc, ...uploads]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-reg-navy">Data Ingestion</h1>
           <p className="text-slate-500 text-sm mt-1">Manage regulatory sources and monitor ingestion pipeline.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw size={16} /> Sync External Feeds
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <Card className={`h-full border-2 border-dashed transition-colors p-8 flex flex-col items-center justify-center text-center ${isDragging ? 'border-reg-teal bg-reg-teal/5' : 'border-slate-200'}`} >
             <div 
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
               className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
             >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8 text-reg-navy" />
                </div>
                <h3 className="text-lg font-semibold text-reg-navy">Drag & drop regulatory PDF</h3>
                <p className="text-slate-500 mt-2 max-w-sm">
                  Or click to browse. Supports PDF, XML, and DOCX. Max file size 50MB.
                </p>
                <div className="mt-6 flex gap-3 w-full max-w-md">
                   <div className="flex-1 bg-white border border-slate-200 rounded p-2 text-left text-sm text-slate-400">Select jurisdiction...</div>
                   <Button>Upload</Button>
                </div>
             </div>
          </Card>
        </div>

        {/* Stats */}
        <Card className="p-6">
          <h3 className="font-semibold text-reg-navy mb-4">Ingestion Volume (Weekly)</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockActivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#64748B" />
                <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="ingest" fill="#0B1B2B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="error" fill="#FFB020" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-slate-500">
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-reg-navy"></div> Successful</div>
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-reg-amber"></div> Needs Review</div>
          </div>
        </Card>
      </div>

      {/* List */}
      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-reg-navy">Ingestion History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">Document Name</th>
                <th className="px-6 py-3">Regulator</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {uploads.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 group transition-colors">
                  <td className="px-6 py-4 font-medium text-reg-navy flex items-center gap-3">
                    <FileText size={16} className="text-slate-400" />
                    {doc.title}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{doc.regulator}</td>
                  <td className="px-6 py-4 text-slate-600">{doc.date}</td>
                  <td className="px-6 py-4">
                    {doc.status === 'processing' && <Badge variant="warning"><RefreshCw className="w-3 h-3 inline mr-1 animate-spin"/> Processing</Badge>}
                    {doc.status === 'active' && <Badge variant="success">Active</Badge>}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-reg-teal hover:underline font-medium">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};