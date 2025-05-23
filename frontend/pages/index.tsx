import Layout from '../components/Layout';
import UploadExcel from '../components/UploadExcel';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button'; // Added import for themed Button

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const router = useRouter();

  const handleNext = () => {
    if (headers.length > 0) {
      router.push({
        pathname: '/select-columns',
        query: { headers: JSON.stringify(headers) },
      });
    }
  };

  return (
    <Layout currentStep={0}>
      <div className="bg-card rounded-xl shadow p-8 max-w-4xl mx-auto mt-8">
        <h3 className="text-xl font-bold mb-2 text-foreground">Upload Excel File</h3>
        <p className="text-muted-foreground mb-6">Upload an Excel file containing the text data you want to analyze</p>
        <UploadExcel onUpload={(file, headers) => { setFile(file); setHeaders(headers); }} />
        <div className="flex justify-end mt-8">
          <Button 
            variant="default" // Use the default primary style
            disabled={!file || headers.length === 0} 
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </Layout>
  );
}
