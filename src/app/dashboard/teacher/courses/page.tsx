import type { Metadata } from 'next';
import CourseManagement from './CourseManagement';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'View your Courses',
};

export default function Page() {
  return <CourseManagement />;
}