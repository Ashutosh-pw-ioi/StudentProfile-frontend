import type { Metadata } from 'next';
import ResultManagement from './ResultManagement';

export const metadata: Metadata = {
  title: 'Result Management',
};

export default function Page() {
  return <ResultManagement />;
}