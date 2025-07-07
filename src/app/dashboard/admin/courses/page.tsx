import type { Metadata } from 'next';
import CourseManagement from './CourseManagement';


export const metadata: Metadata = {
  title: 'Course Management'
};

export default function Page() {
  return <CourseManagement />;
}