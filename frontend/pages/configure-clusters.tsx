import Layout from '@/components/Layout';
import ConfigureModelForm from '@/components/model-configuration/ConfigureModelForm';

export default function ConfigureClustersPage() {
  return (
    <Layout currentStep={2}>
      <ConfigureModelForm />
    </Layout>
  );
}
