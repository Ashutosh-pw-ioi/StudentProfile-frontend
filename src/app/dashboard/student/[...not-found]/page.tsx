import type { Metadata } from 'next';
import StudentFallbackPage from './StudentFallbackPage';

export const metadata: Metadata = {
  title: 'Student Profile',
  description: 'Manage your student profile',
};

export default function Page() {
  return <StudentFallbackPage />;
}