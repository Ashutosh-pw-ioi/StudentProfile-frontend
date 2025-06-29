import type { Metadata } from 'next';
import AcademicsSection from './AcademicSection';

export const metadata: Metadata = {
  title: 'Academics',
  description: 'View your academic progress and courses',
};

export default function Page() {
  return <AcademicsSection />;
}