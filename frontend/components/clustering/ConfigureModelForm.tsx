import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoCircledIcon } from '@radix-ui/react-icons'; // Or any other suitable icon

const machineLearningTypes = [
  { value: 'clustering', label: 'Clustering' },
  { value: 'classification', label: 'Classification (Coming Soon)', disabled: true },
  { value: 'regression', label: 'Regression (Coming Soon)', disabled: true },
];

const clusteringAlgorithms = [
  { value: 'kmeans', label: 'K-means' },
  { value: 'dbscan', label: 'DBSCAN (Coming Soon)', disabled: true },
  // Add other clustering algorithms here
];

export default function ConfigureModelForm() {
  const router = useRouter();
  const [allHeaders, setAllHeaders] = useState<string[]>([]); // Store all headers from previous page
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [mlType, setMlType] = useState<string>('clustering');
  const [algorithm, setAlgorithm] = useState<string>('kmeans');
  const [numClusters, setNumClusters] = useState<number>(3);

  useEffect(() => {
    if (router.query.selectedColumns) {
      try {
        const parsedColumns = JSON.parse(router.query.selectedColumns as string);
        if (Array.isArray(parsedColumns) && parsedColumns.every(c => typeof c === 'string')) {
          setSelectedColumns(parsedColumns);
        } else {
          console.error('Parsed selected columns are not an array of strings:', parsedColumns);
        }
      } catch (error) {
        console.error('Failed to parse selected columns from query:', error);
      }
    }
    // Persist all headers to pass back if user navigates back
    if (router.query.allHeaders) { 
      try {
        const parsedAllHeaders = JSON.parse(router.query.allHeaders as string);
        if (Array.isArray(parsedAllHeaders) && parsedAllHeaders.every(h => typeof h === 'string')) {
          setAllHeaders(parsedAllHeaders);
        } else {
          console.error('Parsed allHeaders are not an array of strings:', parsedAllHeaders);
        }
      } catch (error) {
        console.error('Failed to parse allHeaders from query:', error);
      }
    } else if (router.isReady && !router.query.selectedColumns && !router.query.allHeaders) {
      console.warn('No selected columns or allHeaders provided in query params.');
    }
  }, [router.query, router.isReady]);

  const handleNext = async () => {
    console.log('Configuration:', { mlType, algorithm, numClusters, selectedColumns });
    // Pass allHeaders along to the next step if needed, or just the config
    router.push({ 
      pathname: '/view-results', 
      query: { 
        config: JSON.stringify({ mlType, algorithm, numClusters, selectedColumns }),
        allHeaders: JSON.stringify(allHeaders) // Pass allHeaders to results page if needed
      } 
    });
  };

  const handleBack = () => {
    router.push({ 
      pathname: '/select-columns', 
      query: { 
        headers: JSON.stringify(allHeaders), // Pass all original headers back
        selectedColumns: JSON.stringify(selectedColumns) // Pass current selection back
      } 
    });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Configure Model</CardTitle>
        <CardDescription>Set the parameters for your machine learning task.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ml-type">Type of Machine Learning</Label>
          <Select value={mlType} onValueChange={setMlType}>
            <SelectTrigger id="ml-type">
              <SelectValue placeholder="Select ML Type" />
            </SelectTrigger>
            <SelectContent>
              {machineLearningTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} disabled={type.disabled}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {mlType === 'clustering' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="algorithm">Clustering Algorithm</Label>
              <Select value={algorithm} onValueChange={setAlgorithm}>
                <SelectTrigger id="algorithm">
                  <SelectValue placeholder="Select Algorithm" />
                </SelectTrigger>
                <SelectContent>
                  {clusteringAlgorithms.map((alg) => (
                    <SelectItem key={alg.value} value={alg.value} disabled={alg.disabled}>
                      {alg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="num-clusters">Number of Clusters (K): {numClusters}</Label>
              <Slider
                id="num-clusters"
                min={2}
                max={100} // As per the image
                step={1}
                value={[numClusters]}
                onValueChange={(value) => setNumClusters(value[0])}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground">
                Select the number of clusters to generate (2-100).
              </p>
            </div>
          </>
        )}
        {/* Add sections for other ML types (classification, regression) here when implemented */}

        <Alert>
          <InfoCircledIcon className="h-4 w-4" /> {/* Adjust icon as needed */}
          <AlertTitle>What happens next?</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Your data (selected columns) will be sent for processing with the chosen configuration.</li>
              <li>The system will generate insights based on the selected algorithm.</li>
              <li>Results and visualizations will be prepared for you to review.</li>
            </ul>
            <p className="mt-2">This process may take a few moments depending on the size and complexity of your data.</p>
          </AlertDescription>
        </Alert>

      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </CardFooter>
    </Card>
  );
}
