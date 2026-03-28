import { SimulatorProvider } from './context/SimulatorContext';
import Layout from './components/Layout';

export default function App() {
  return (
    <SimulatorProvider>
      <Layout />
    </SimulatorProvider>
  );
}
