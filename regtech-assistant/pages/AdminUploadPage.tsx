import React, { useState } from 'react';
import { UploadCloud, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminUploadPage: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    // Simulate ingest
    await new Promise(r => setTimeout(r, 2000));
    setUploading(false);
    setSuccess(true);
    setTimeout(() => {
        setSuccess(false);
        setFiles([]);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-reg-navy">Document Ingestion</h1>
        <p className="text-slate-500 mt-2">Upload regulatory texts (PDF, XML) for Gemini processing and vectorization.</p>
      </div>

      <Card className={`h-64 border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center ${isDragging ? 'border-reg-teal bg-reg-teal/5 scale-[1.02]' : 'border-slate-300'}`}>
         <div 
           onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
           onDragLeave={() => setIsDragging(false)}
           onDrop={handleDrop}
           className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
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
                  <button onClick={() => setFiles(files.filter(f => f !== file))} className="text-slate-400 hover:text-red-500">
                    <X size={18} />
                  </button>
               </div>
             ))}

             <div className="flex justify-end pt-4">
                {success ? (
                   <Badge variant="success" className="px-4 py-2 text-sm flex items-center gap-2">
                      <CheckCircle size={16} /> Ingestion Started Successfully
                   </Badge>
                ) : (
                   <Button onClick={handleUpload} isLoading={uploading} className="w-full sm:w-auto">
                     Start Ingestion Pipeline
                   </Button>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};