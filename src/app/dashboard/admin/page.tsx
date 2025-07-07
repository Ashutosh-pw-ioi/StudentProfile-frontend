import type { Metadata } from 'next';
import AdminProfile from './AdminProfile';

export const metadata: Metadata = {
  title: 'Student Management'
};

export default function Page() {
  return <AdminProfile/>;
}