import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button"; // Import the Button component

interface UploadExcelProps {
  onUpload: (file: File, headers: string[]) => void;
}

export default function UploadExcel({ onUpload }: UploadExcelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const processExcelFile = async (file: File) => {
    try {
      setError('');
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setError('Please upload an Excel file (.xlsx or .xls)');
        return;
      }
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (jsonData.length === 0) {
        setError('The Excel file is empty');
        return;
      }
      // Ensure headers are strings and filter out empty/invalid ones
      const rawHeaders = jsonData[0] as any[]; // Get the first row
      if (!rawHeaders || rawHeaders.length === 0) {
        setError('No columns found in the Excel file');
        return;
      }
      
      const headers = rawHeaders
        .map(header => header !== null && header !== undefined ? String(header).trim() : '')
        .filter(header => header !== '');

      if (headers.length === 0) {
        setError('No valid column headers found in the Excel file. Please ensure the first row contains text.');
        return;
      }
      setFileName(file.name);
      onUpload(file, headers);
    } catch (err) {
      setError('Failed to process the Excel file. Please try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processExcelFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processExcelFile(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-200 ${isDragging ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-primary/20 p-4 mb-2">
            <FileSpreadsheet className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Upload Excel File</h3>
            <p className="text-sm text-muted-foreground">Drag and drop your Excel file here, or click to browse</p>
          </div>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
          <Button type="button" variant="outline" onClick={handleButtonClick}>
            <Upload className="h-5 w-5 mr-2" /> Browse Files
          </Button>
        </div>
      </div>
      {fileName && (
        <div className="flex items-center justify-between rounded-lg border border-border p-3 mt-2 bg-secondary/50">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{fileName}</span>
          </div>
          <Button variant="link" size="sm" onClick={() => { setFileName(''); setError(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}>Change</Button>
        </div>
      )}
      {error && <div className="rounded-lg bg-destructive/20 p-3 text-destructive mt-2">{error}</div>}
    </div>
  );
}
