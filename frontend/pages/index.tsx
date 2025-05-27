import Layout from '@/components/Layout';
import UploadFile from '@/components/UploadExcel'; // Renamed from UploadExcel
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const router = useRouter();

  const handleNext = () => {
    // For non-Excel files, headers might be empty or a placeholder.
    // The actual processing and header extraction for these will be done on the backend.
    if (file) { // Ensure file is present before proceeding
      router.push({
        pathname: '/select-columns',
        query: { headers: JSON.stringify(headers), fileName: file.name }, // Pass fileName
      });
    }
  };

  return (
    <Layout currentStep={0}>
      <div className="bg-card rounded-xl shadow p-8 max-w-4xl mx-auto mt-8">
        {/* Changed title and description */}
        <h3 className="text-xl font-bold mb-2 text-foreground">Upload Data File</h3>
        <p className="text-muted-foreground mb-6">Upload an Excel, CSV, Pickle, or Parquet file containing the data you want to analyze</p>
        <UploadFile onUpload={(file, headers) => { setFile(file); setHeaders(headers); }} /> {/* Renamed component */}
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleNext} 
            disabled={!file} // Button disabled if no file is uploaded
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </Layout>
  );
}
