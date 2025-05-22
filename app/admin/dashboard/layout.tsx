import Sidebar from "./sidebar";
import Header from "./header";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:block   bg-white min-h-screen">
        <Sidebar />
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 overflow-auto  bg-white">{children}</main>
      </div>
    </div>
  );
} 