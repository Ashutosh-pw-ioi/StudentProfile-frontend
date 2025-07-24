import type { Metadata } from 'next';
import AdminFallbackPage from './AdminFallbackPage';

export const metadata: Metadata = {
  title: 'Student Management'
};

export default function Page() {
  return <AdminFallbackPage />;
}