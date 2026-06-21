import { AppSidebar } from '@/components/app-sidebar';
import { TopBar } from '@/components/top-bar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
