import type { Metadata } from 'next';
import SuperAdminProfile from './SuperAdminProfile';

export const metadata: Metadata = {
  title: 'Super Admin Profile'
};

export default function Page() {
  return <SuperAdminProfile/>;
}