import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '../lib/utils';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// file uploading
interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  onError: (message: string) => void;
}

export function FileUploader({ file, onFileSelect, onFileClear, onError }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateAndSet = (f: File) => {
    if (!f.name.toLowerCase().endsWith('.csv')) {
      onError('Invalid file type. Please upload a CSV file.');
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      onError(`File too large (${(f.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.`);
      return;
    }
    onFileSelect(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) validateAndSet(f);
    // Reset input so re-selecting the same file triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSet(f);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={file ? `Uploaded file: ${file.name}. Press Enter to replace.` : 'Upload a CSV file. Press Enter or drag and drop.'}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2',
          'dark:bg-zinc-800/50 dark:border-zinc-600',
          isDragOver
            ? 'border-zinc-900 bg-zinc-100 dark:border-zinc-300 dark:bg-zinc-700/50'
            : 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-400 dark:hover:border-zinc-500',
        )}
      >
        <Upload className={cn(
          'w-8 h-8 mx-auto mb-2 transition-colors',
          isDragOver ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-400',
        )} />
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {isDragOver
            ? 'Drop your CSV file here'
            : file
              ? file.name
              : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-zinc-500 mt-1">CSV files only, max 10MB</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept=".csv"
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {file && (
        <div className="flex items-center justify-between mt-2 px-2">
          <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
            {file.name} ({(file.size / 1024).toFixed(0)} KB)
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileClear();
            }}
            className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            aria-label="Remove uploaded file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
