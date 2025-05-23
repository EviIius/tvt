import Layout from '@/components/Layout';
import ConfigureModelForm from '@/components/clustering/ConfigureModelForm';

export default function ConfigureClustersPage() {
  return (
    <Layout currentStep={2}>
      <ConfigureModelForm />
    </Layout>
  );
}
