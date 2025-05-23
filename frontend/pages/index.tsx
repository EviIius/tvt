import Layout from '../components/Layout';
import UploadExcel from '../components/UploadExcel';
import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Added import

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const router = useRouter(); // Added router instance

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
      <div className="bg-white rounded-xl shadow p-8 max-w-4xl mx-auto mt-8">
        <h3 className="text-xl font-bold mb-2">Upload Excel File</h3>
        <p className="text-gray-500 mb-6">Upload an Excel file containing the text data you want to analyze</p>
        <UploadExcel onUpload={(file, headers) => { setFile(file); setHeaders(headers); }} />
        <div className="flex justify-end mt-8">
          <button 
            className="bg-[#D71E28] text-white px-6 py-2 rounded font-semibold disabled:bg-gray-400"
            disabled={!file || headers.length === 0} 
            onClick={handleNext} // Added onClick handler
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}
