import Sidebar from "@/components/layout/Sidebar";
import { StudentProvider } from "@/hooks/useStudent";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </StudentProvider>
  );
}
