import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, Download, Eye, MoreHorizontal } from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';

interface Document {
  id: string;
  title: string;
  authority: string;
  year: string;
  status: string;
  category: string;
}

export const UserDocuments: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorityFilter, setAuthorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // BACKEND INTEGRATION POINT
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

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
      //       authority: string,
      //       year: string,
      //       status: 'Active' | 'Draft' | 'Archived',
      //       category: string
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
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // BACKEND INTEGRATION POINT
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 50MB limit. Please upload a smaller file.');
        event.target.value = '';
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
        formData.append('status', 'Draft');

        const token = localStorage.getItem('authToken');

        // BACKEND INTEGRATION POINT
        // POST /api/documents/upload
        // Expected response:
        // {
        //   success: true,
        //   data: {
        //     id: string,
        //     title: string,
        //     authority: string,
        //     year: string,
        //     status: string,
        //     category: string
        //   }
        // }
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed');
        }

        alert(`Document "${file.name}" uploaded successfully!`);

        // Refresh document list after successful upload
        await fetchDocuments();

      } catch (error) {
        console.error('Upload error:', error);
        alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
        event.target.value = '';
      }
    }
  };

  // BACKEND INTEGRATION POINT
  const handleExportList = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // GET /api/documents/export?format=csv
      // Expected response: CSV file download
      const response = await fetch('/api/documents/export?format=csv', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documents-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export document list');
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.authority.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAuthority = authorityFilter === 'all' || doc.authority === authorityFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesAuthority && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-reg-navy">Document Library</h1>
          <p className="text-slate-500 text-sm">Central repository for regulations, directives, and internal policies.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportList}>
            <Download size={16}/> Export List
          </Button>
          <Button 
            className="gap-2" 
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            <FileText size={16}/> 
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
            disabled={isUploading}
          />
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
            <select 
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-reg-teal cursor-pointer"
              value={authorityFilter}
              onChange={(e) => setAuthorityFilter(e.target.value)}
            >
              <option value="all">Authority: All</option>
              {Array.from(new Set(documents.map(d => d.authority))).map(auth => (
                <option key={auth} value={auth}>{auth}</option>
              ))}
            </select>
            <select 
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-reg-teal cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status: All</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {error ? (
            <div className="p-8 text-center text-red-500">
              Error: {error}
            </div>
          ) : (
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
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No documents found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};