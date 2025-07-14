import type { Metadata } from 'next';
import TeacherFallbackPage from './TeacherFallbackPage';

export const metadata: Metadata = {
  title: 'Teacher Profile',
  description: 'Manage your teacher profile',
};

export default function Page() {
  return <TeacherFallbackPage />;
}