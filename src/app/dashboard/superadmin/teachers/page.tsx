import type { Metadata } from 'next';
import TeachersManagement from './TeacherManagement';


export const metadata: Metadata = {
  title: 'Teacher Management',

};

export default function Page() {
  return <TeachersManagement />;
}