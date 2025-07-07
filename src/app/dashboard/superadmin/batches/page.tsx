import type { Metadata } from 'next';
import BatchManagement from './BatchManagement';

export const metadata: Metadata = {
  title: 'Batch Management',
};

export default function Page() {
  return <BatchManagement />;
}