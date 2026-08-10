import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export const metadata = {
  title: 'Admin Dashboard — BatalaBandi',
  description: 'BatalaBandi Admin Control Panel',
  icons: { icon: '/logo.png' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
