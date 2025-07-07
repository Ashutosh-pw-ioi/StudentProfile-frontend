import type { Metadata } from 'next';
import StudentManagement from './StudentManagement';

export const metadata: Metadata = {
  title: 'Student Management',
};

export default function Page() {
  return <StudentManagement />;
}