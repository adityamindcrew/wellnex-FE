"use client"
import Header from "./header";
import Sidebar from "./sidebar";
import { createContext, useContext, useState } from "react";

// Create context for dashboard search
export const DashboardSearchContext = createContext({
  searchTerm: "",
  setSearchTerm: (term: string) => {},
  isLoading: false,
  setIsLoading: (loading: boolean) => {},
});

export function useDashboardSearch() {
  return useContext(DashboardSearchContext);
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <DashboardSearchContext.Provider value={{ searchTerm, setSearchTerm, isLoading, setIsLoading }}>
      <div className="flex min-h-screen bg-white overflow-x-hidden w-full">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="hidden md:block w-px bg-gray-200 min-h-screen" />
        <div className="flex-1 flex flex-col min-h-screen w-full">
          <Header onHamburgerClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 overflow-auto bg-white w-full">{children}</main>
        </div>
      </div>
    </DashboardSearchContext.Provider>
  );
} 