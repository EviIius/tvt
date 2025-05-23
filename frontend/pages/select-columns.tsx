import Layout from '@/components/Layout';
import ColumnSelection from '@/components/ColumnSelection';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';

export default function SelectColumnsPage() {
  const router = useRouter();
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    if (router.query.headers) {
      try {
        const parsedHeaders = JSON.parse(router.query.headers as string);
        setHeaders(parsedHeaders);
      } catch (error) {
        console.error("Failed to parse headers:", error);
        // Optionally, redirect to home or show an error message
        router.push('/');
      }
    } else if (router.isReady) {
      // If headers are not in query and router is ready, redirect or show error
      // This handles cases where the page is accessed directly without headers
      console.warn("No headers provided in query params.");
      // router.push('/'); // Or some error page
    }
  }, [router.query, router.isReady, router]);

  const handleNext = () => {
    // Navigate to the next step, passing selectedColumns
    // For now, let's log it
    console.log('Selected columns:', selectedColumns);
    // router.push({ pathname: '/configure-clusters', query: { selectedColumns: JSON.stringify(selectedColumns) } });
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Layout currentStep={1}>
      <div className="bg-white rounded-xl shadow p-8 max-w-4xl mx-auto mt-8">
        <h3 className="text-xl font-bold mb-2">Select Columns for Analysis</h3>
        <p className="text-gray-500 mb-6">Choose the columns from your uploaded file that you wish to include in the topic modeling analysis.</p>
        {headers.length > 0 ? (
          <ColumnSelection
            columns={headers}
            selectedColumns={selectedColumns}
            onSelectionChange={setSelectedColumns}
          />
        ) : (
          <p className="text-center text-gray-500">Loading columns or no columns found. Please ensure you have uploaded a file with headers.</p>
        )}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack}>Back</Button>
          <Button onClick={handleNext} disabled={selectedColumns.length === 0} className="bg-[#D71E28] text-white">Next</Button>
        </div>
      </div>
    </Layout>
  );
}
