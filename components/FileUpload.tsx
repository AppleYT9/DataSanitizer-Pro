
import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { DataRow } from '../types';

interface FileUploadProps {
  onDataUploaded: (data: DataRow[], fileName: string, fileSize: number) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataUploaded, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Currently only CSV files are supported.');
      return;
    }
    setError(null);

    // @ts-ignore - Papa is global
    window.Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        onDataUploaded(results.data, file.name, file.size);
      },
      error: (err: any) => {
        setError('Failed to parse file: ' + err.message);
      }
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center min-h-[400px] cursor-pointer ${
          isDragging ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
        } ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onChange} 
          className="hidden" 
          accept=".csv"
        />
        
        {isLoading ? (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Dataset...</h3>
            <p className="text-slate-500">Profiling columns and generating AI recommendations.</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Upload className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Click or drag to upload</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Choose a CSV file to get started. We'll handle the profiling and suggest cleaning tasks.
            </p>
            <div className="flex items-center justify-center gap-6 text-slate-400 text-sm font-medium">
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> CSV Supported</span>
              <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> Max 50MB</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};
