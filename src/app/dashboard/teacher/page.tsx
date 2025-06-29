import type { Metadata } from 'next';
import TeacherProfile from './TeacherProfile';

export const metadata: Metadata = {
  title: 'Teacher Profile',
  description: 'Manage your teacher profile',
};

export default function Page() {
  return <TeacherProfile />;
}