import Navbar from '@/components/Navbar';
import ActionButtons from '@/components/ActionButtons';
import MainTable from '@/components/MainTable';
import SidebarTable from '@/components/SidebarTable';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Navbar />

      <main className="mx-auto max-w-7xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Sisi Kiri */}
          <div className="md:col-span-8 flex flex-col gap-8">
            <ActionButtons />
            <MainTable />
          </div>

          {/* Sisi Kanan */}
          <div className="md:col-span-4">
            <SidebarTable />
          </div>

        </div>
      </main>
    </div>
  );
}