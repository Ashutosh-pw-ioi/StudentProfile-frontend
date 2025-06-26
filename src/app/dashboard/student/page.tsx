import type { Metadata } from 'next';
import StudentProfile from './StudentProfile';

export const metadata: Metadata = {
  title: 'Student Profile',
  description: 'Manage your student profile',
};

export default function Page() {
  return <StudentProfile />;
}