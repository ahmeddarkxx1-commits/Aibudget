import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 px-6 pt-24 lg:pt-8 lg:px-10 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
