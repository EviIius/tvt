import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ColumnSelection from '@/components/ColumnSelection';
import { Button } from '@/components/ui/button';

export default function SelectColumnsPage() {
  const router = useRouter();
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    let initialHeaders: string[] = [];
    let initialSelectedColumns: string[] = [];

    if (router.query.headers) {
      try {
        const parsedHeaders = JSON.parse(router.query.headers as string);
        if (Array.isArray(parsedHeaders) && parsedHeaders.every(h => typeof h === 'string')) {
          initialHeaders = parsedHeaders;
        } else {
          console.error("Parsed headers are not an array of strings:", parsedHeaders);
        }
      } catch (error) {
        console.error("Failed to parse headers from query:", error);
      }
    }

    if (router.query.selectedColumns) {
      try {
        const parsedSelectedColumns = JSON.parse(router.query.selectedColumns as string);
        if (Array.isArray(parsedSelectedColumns) && parsedSelectedColumns.every(c => typeof c === 'string')) {
          initialSelectedColumns = parsedSelectedColumns;
        } else {
          console.error("Parsed selected columns are not an array of strings:", parsedSelectedColumns);
        }
      } catch (error) {
        console.error("Failed to parse selected columns from query:", error);
      }
    }

    setHeaders(initialHeaders);
    setSelectedColumns(initialSelectedColumns);

    if (router.isReady && !router.query.headers) {
      console.warn("No headers provided in query params. Displaying with no columns.");
      // setHeaders([]); // Already handled by initialHeaders default
      // setSelectedColumns([]); // Already handled by initialSelectedColumns default
    }
  }, [router.query, router.isReady]);

  const handleNext = () => {
    console.log('Selected columns:', selectedColumns);
    router.push({ 
      pathname: '/configure-clusters', 
      query: { 
        selectedColumns: JSON.stringify(selectedColumns),
        allHeaders: JSON.stringify(headers) // Pass all headers to the configure page
      } 
    });
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!router.isReady) {
    return <Layout currentStep={1}><div className="p-8 text-center">Loading page...</div></Layout>;
  }

  return (
    <Layout currentStep={1}>
      <div className="bg-card rounded-xl shadow p-8 max-w-4xl mx-auto mt-8">
        <h3 className="text-xl font-semibold mb-1 text-foreground">Select Columns</h3>
        <p className="text-muted-foreground mb-6">
          Choose the columns from your dataset that you want to include in the topic modeling analysis.
        </p>
        
        <ColumnSelection
          columns={headers}
          selectedColumns={selectedColumns}
          onSelectionChange={setSelectedColumns}
        />

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
          <Button
            onClick={handleBack}
            variant="outline"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedColumns.length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </Layout>
  );
}
