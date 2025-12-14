import React, { useState, useEffect } from 'react';
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

// BACKEND INTEGRATION POINT
// Expected API response for GET /api/admin/dashboard/activity:
// [
//   { name: string, ingest: number, error: number }
// ]
interface ActivityData {
  name: string;
  ingest: number;
  error: number;
}

export const AdminDashboard: React.FC = () => {
  const [uploads, setUploads] = useState<DocumentMetadata[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // BACKEND INTEGRATION POINT
  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');

      // BACKEND INTEGRATION POINT
      // Fetch recent uploads/ingestion history
      // Expected response: Array of DocumentMetadata
      // {
      //   id: string,
      //   title: string,
      //   regulator: string,
      //   jurisdiction: string,
      //   date: string (ISO format),
      //   status: 'processing' | 'active' | 'error',
      //   version: string,
      //   sector: string
      // }
      const uploadsResponse = await fetch('/api/admin/ingestion/recent', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!uploadsResponse.ok) {
        throw new Error('Failed to fetch ingestion history');
      }

      const uploadsData = await uploadsResponse.json();
      setUploads(uploadsData.data || uploadsData);

      // BACKEND INTEGRATION POINT
      // Fetch weekly activity data for chart
      // Expected response:
      // [
      //   { name: 'Mon', ingest: 12, error: 1 },
      //   { name: 'Tue', ingest: 19, error: 0 },
      //   ...
      // ]
      const activityResponse = await fetch('/api/admin/dashboard/activity', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!activityResponse.ok) {
        throw new Error('Failed to fetch activity data');
      }

      const activityResponseData = await activityResponse.json();
      setActivityData(activityResponseData.data || activityResponseData);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // BACKEND INTEGRATION POINT
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file size (50MB limit)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 50MB limit');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
        formData.append('status', 'processing');

        const token = localStorage.getItem('authToken');

        // BACKEND INTEGRATION POINT
        // POST /api/documents/upload
        // Expected response:
        // {
        //   success: true,
        //   data: { id, title, regulator, jurisdiction, date, status, version, sector }
        // }
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        
        // Add new upload to the list
        setUploads([result.data, ...uploads]);

      } catch (err) {
        console.error('Upload error:', err);
        alert('Upload failed. Please try again.');
      }
    }
  };

  // BACKEND INTEGRATION POINT
  const handleSyncExternalFeeds = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // POST /api/admin/sync-feeds
      const response = await fetch('/api/admin/sync-feeds', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      // Refresh dashboard data after sync
      await fetchDashboardData();

    } catch (err) {
      console.error('Sync error:', err);
      alert('Failed to sync external feeds');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-reg-navy">Data Ingestion</h1>
           <p className="text-slate-500 text-sm mt-1">Manage regulatory sources and monitor ingestion pipeline.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleSyncExternalFeeds}>
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
            {activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#64748B" />
                  <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="ingest" fill="#0B1B2B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="error" fill="#FFB020" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No activity data available
              </div>
            )}
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
              {uploads.length > 0 ? (
                uploads.map((doc) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No ingestion history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};