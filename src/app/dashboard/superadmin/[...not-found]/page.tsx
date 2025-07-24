import type { Metadata } from 'next';
import SuperAdminFallbackPage from './SuperAdminFallbackPage'

export const metadata: Metadata = {
  title: 'Super Admin Profile'
};

export default function Page() {
  return <SuperAdminFallbackPage/>;
}