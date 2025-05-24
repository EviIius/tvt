import Layout from '@/components/Layout';
import ResultsDisplay from '@/components/results/ResultsDisplay';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ClusteringAPIResult, Topic, ClusterPoint } from '@/types'; // Assuming types are defined here

// Dummy data for initial display
const dummyTopics: Topic[] = [
  { id: 'topic1', name: 'Payment Processing', count: 2502, percentage: '33.5%', summary: 'Documents related to how payments are handled.' },
  { id: 'topic2', name: 'Account Management', count: 1438, percentage: '19.2%', summary: 'Focuses on managing user accounts.' },
  { id: 'topic3', name: 'Transaction Services', count: 1057, percentage: '14.1%', summary: 'Details about various transaction services offered.' },
  { id: 'topic4', name: 'Regulatory Compliance', count: 1002, percentage: '13.4%', summary: 'Concerns legal and regulatory adherence.' },
  { id: 'topic5', name: 'Fee Structure', count: 905, percentage: '12.1%', summary: 'Information about fees and charges.' },
  { id: 'topic6', name: 'Credit Services', count: 442, percentage: '5.9%', summary: 'Relating to credit applications and management.' },
  { id: 'topic7', name: 'New Accounts', count: 136, percentage: '1.8%', summary: 'Opening and setting up new accounts.' },
];

const dummyClusterPoints: ClusterPoint[] = [
  // Sample points for topic1 (Payment Processing)
  { x: -40, y: 25, topic: 'topic1', text: 'Document about ACH transfer fees...' },
  { x: -35, y: 30, topic: 'topic1', text: 'Details on wire payment limits...' },
  { x: -30, y: 20, topic: 'topic1', text: 'Credit card processing agreement...' },
  // Sample points for topic2 (Account Management)
  { x: 10, y: -10, topic: 'topic2', text: 'How to reset your account password...' },
  { x: 15, y: -15, topic: 'topic2', text: 'Updating your contact information...' },
  { x: 5, y: -5, topic: 'topic2', text: 'Closing an existing account procedure...' },
  // Sample points for topic3 (Transaction Services)
  { x: 20, y: 40, topic: 'topic3', text: 'Overview of international money transfers...' },
  { x: 25, y: 35, topic: 'topic3', text: 'Real-time payment network details...' },
  // ... add more points for other topics to make it look like the image
  { x: -25, y: -25, topic: 'topic4', text: 'GDPR compliance statement...' },
  { x: 0, y: 0, topic: 'topic4', text: 'AML policy update...' }, 
  { x: 30, y: 10, topic: 'topic5', text: 'Schedule of service fees...' },
  { x: -10, y: 45, topic: 'topic5', text: 'Fee dispute resolution...' }, 
  { x: 40, y: -30, topic: 'topic6', text: 'Credit scoring model explained...' },
  { x: 5, y: 30, topic: 'topic6', text: 'Applying for a business loan...' }, 
  { x: -45, y: 0, topic: 'topic7', text: 'Documents required for new account...' }, 
  { x: 25, y: -40, topic: 'topic7', text: 'Welcome kit for new customers...' }, 
];

const dummyResults: ClusteringAPIResult = {
  message: 'Dummy clustering results loaded.',
  topics: dummyTopics,
  clusterPoints: dummyClusterPoints,
};

export default function ViewResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<ClusteringAPIResult | null>(dummyResults);
  const [config, setConfig] = useState<any | null>(null); // Initialize config as null
  const [allHeaders, setAllHeaders] = useState<string[] | null>(null);

  useEffect(() => {
    // In a real scenario, you would fetch results based on config or an ID
    // For now, we're using dummy data or data passed via query (if any)
    if (router.query.results) {
      try {
        setResults(JSON.parse(router.query.results as string));
      } catch (e) {
        console.error("Failed to parse results from query", e);
        // setResults(dummyResults); // Fallback to dummy if parsing fails
      }
    }
    if (router.query.config) {
      try {
        const parsedConfig = JSON.parse(router.query.config as string);
        setConfig(parsedConfig);
      } catch (e) {
        console.error("Failed to parse config from query", e);
      }
    } else if (router.isReady) { // Ensure router is ready before checking for missing config
        // Fallback to a default config if none is provided in the query
        // This is important because ResultsDisplay expects a config object
        console.warn("Config not found in query params, using default clustering config for display.");
        setConfig({ mlType: 'clustering' }); 
    }
    if (router.query.allHeaders) {
      try {
        setAllHeaders(JSON.parse(router.query.allHeaders as string));
      } catch (e) {
        console.error("Failed to parse allHeaders from query", e);
      }
    }
  }, [router.query, router.isReady]); // Added router.isReady to dependency array

  const handleBack = () => {
    // Navigate back to configure-clusters, passing existing config and headers
    router.push({
      pathname: '/configure-clusters',
      query: {
        selectedColumns: config ? JSON.stringify(config.selectedColumns) : JSON.stringify([]),
        allHeaders: allHeaders ? JSON.stringify(allHeaders) : undefined,
      },
    });
  };

  if (!results || !config) { // Also check if config is loaded
    return <Layout currentStep={3}><div className="p-8 text-center">Loading results and configuration...</div></Layout>;
  }

  return (
    <Layout currentStep={3}>
      {/* Pass the config to ResultsDisplay */}
      <ResultsDisplay results={results} config={config} onBack={handleBack} />
    </Layout>
  );
}
