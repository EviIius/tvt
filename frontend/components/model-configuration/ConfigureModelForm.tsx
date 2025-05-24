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
  { value: 'regression', label: 'Regression' }, // Enabled
];

const clusteringAlgorithms = [
  { value: 'kmeans', label: 'K-means' },
  { value: 'dbscan', label: 'DBSCAN (Coming Soon)', disabled: true },
  // Add other clustering algorithms here
];

const regressionAlgorithms = [
  { value: 'linear', label: 'Linear Regression' },
  { value: 'polynomial', label: 'Polynomial Regression (Coming Soon)', disabled: true },
  // Add other regression algorithms here
];

export default function ConfigureModelForm() {
  const router = useRouter();
  const [allHeaders, setAllHeaders] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [mlType, setMlType] = useState<string>('clustering');
  const [algorithm, setAlgorithm] = useState<string>('kmeans'); // Default to kmeans
  const [numClusters, setNumClusters] = useState<number>(3);
  const [polynomialDegree, setPolynomialDegree] = useState<number>(2); // Example for regression

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

  // Update algorithm when mlType changes to a valid default
  useEffect(() => {
    if (mlType === 'clustering') {
      setAlgorithm('kmeans');
    } else if (mlType === 'regression') {
      setAlgorithm('linear');
    }
    // Add more conditions if other ML types are enabled
  }, [mlType]);

  const handleNext = async () => {
    let config: any = { mlType, algorithm, selectedColumns };
    if (mlType === 'clustering') {
      config.numClusters = numClusters;
    } else if (mlType === 'regression') {
      if (algorithm === 'polynomial') {
        config.polynomialDegree = polynomialDegree;
      }
      // Add other regression-specific params
    }
    console.log('Configuration:', config);
    router.push({
      pathname: '/view-results',
      query: {
        config: JSON.stringify(config),
        allHeaders: JSON.stringify(allHeaders)
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

  const renderAlgorithmOptions = () => {
    if (mlType === 'clustering') {
      return clusteringAlgorithms;
    } else if (mlType === 'regression') {
      return regressionAlgorithms;
    }
    return [];
  };

  const getAlgorithmLabel = () => {
    if (mlType === 'clustering') return 'Clustering Algorithm';
    if (mlType === 'regression') return 'Regression Algorithm';
    return 'Algorithm';
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

        {/* Algorithm Selection - Dynamic based on mlType */}
        <div className="space-y-2">
          <Label htmlFor="algorithm">{getAlgorithmLabel()}</Label>
          <Select value={algorithm} onValueChange={setAlgorithm} disabled={renderAlgorithmOptions().length === 0}>
            <SelectTrigger id="algorithm">
              <SelectValue placeholder={`Select ${getAlgorithmLabel()}`} />
            </SelectTrigger>
            <SelectContent>
              {renderAlgorithmOptions().map((alg) => (
                <SelectItem key={alg.value} value={alg.value} disabled={alg.disabled}>
                  {alg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {mlType === 'clustering' && (
          <>
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

        {mlType === 'regression' && algorithm === 'polynomial' && (
          <div className="space-y-2">
            <Label htmlFor="poly-degree">Polynomial Degree: {polynomialDegree}</Label>
            <Slider
              id="poly-degree"
              min={2}
              max={10}
              step={1}
              value={[polynomialDegree]}
              onValueChange={(value) => setPolynomialDegree(value[0])}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground">
              Select the degree for polynomial regression (2-10).
            </p>
          </div>
        )}
        
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
