import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadStatus {
  fileName: string;
  success: boolean;
  error?: string;
}

export const AdminUploadPage: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadStatus[]>([]);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const uploadSingleFile = async (file: File): Promise<UploadStatus> => {
    try {
      // Validate file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        return {
          fileName: file.name,
          success: false,
          error: 'File size exceeds 50MB limit'
        };
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, '')); // filename without extension
      formData.append('status', 'Draft');

      // Get auth token (adjust based on your auth implementation)
      const token = localStorage.getItem('authToken');

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

      return {
        fileName: file.name,
        success: true
      };

    } catch (error) {
      return {
        fileName: file.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }
    
    setUploading(true);
    setUploadResults([]);
    setShowResults(false);
    
    try {
      // Upload all files in parallel
      const results = await Promise.all(
        files.map(file => uploadSingleFile(file))
      );
      
      setUploadResults(results);
      setShowResults(true);

      // If all uploads succeeded, clear files after 3 seconds
      const allSucceeded = results.every(r => r.success);
      if (allSucceeded) {
        setTimeout(() => {
          setShowResults(false);
          setFiles([]);
          setUploadResults([]);
        }, 3000);
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload process failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const successCount = uploadResults.filter(r => r.success).length;
  const failureCount = uploadResults.filter(r => !r.success).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-reg-navy">Document Ingestion</h1>
        <p className="text-slate-500 mt-2">Upload regulatory texts (PDF, XML) for Gemini processing and vectorization.</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.xml,.doc"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      <Card className={`h-64 border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center ${isDragging ? 'border-reg-teal bg-reg-teal/5 scale-[1.02]' : 'border-slate-300'}`}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`w-full h-full flex flex-col items-center justify-center ${uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <UploadCloud className={`w-8 h-8 transition-colors ${isDragging ? 'text-reg-teal' : 'text-slate-400'}`} />
          </div>
          <h3 className="text-lg font-semibold text-reg-navy">Drag & drop regulatory files</h3>
          <p className="text-slate-500 mt-2 text-sm max-w-sm">
            Supported formats: PDF, DOCX, XML. Max size: 50MB.
          </p>
        </div>
      </Card>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <h3 className="font-medium text-slate-700">Ready to Upload</h3>
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white border border-reg-border rounded-[10px] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-reg-navy/5 rounded flex items-center justify-center text-reg-navy">
                    <File size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-reg-navy">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {!uploading && (
                  <button onClick={() => setFiles(files.filter(f => f !== file))} className="text-slate-400 hover:text-red-500">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}

            <div className="flex justify-end pt-4">
              {showResults ? (
                <div className="w-full space-y-2">
                  {successCount > 0 && (
                    <Badge variant="success" className="px-4 py-2 text-sm flex items-center gap-2">
                      <CheckCircle size={16} /> {successCount} file{successCount > 1 ? 's' : ''} uploaded successfully
                    </Badge>
                  )}
                  {failureCount > 0 && (
                    <div className="space-y-2">
                      <Badge variant="error" className="px-4 py-2 text-sm flex items-center gap-2 bg-red-100 text-red-700">
                        <AlertCircle size={16} /> {failureCount} file{failureCount > 1 ? 's' : ''} failed to upload
                      </Badge>
                      {uploadResults.filter(r => !r.success).map((result, i) => (
                        <p key={i} className="text-xs text-red-600 pl-4">
                          • {result.fileName}: {result.error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={handleUpload} isLoading={uploading} className="w-full sm:w-auto" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Start Ingestion Pipeline'}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};