import { useEffect, useState } from "react";
import StatCard from "./statCard";
import leads from "../../app/assets/images/leads.png"
import interaction from "../../app/assets/images/intercation.png"

interface LeadCounts {
  leads: number;
  userInteraction: number;
}

const StatsOverview = () => {
  const [stats, setStats] = useState<LeadCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("${process.env.NEXT_API_URL}/admin/lead-counts", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats({
          leads: data.data?.totalLeads ?? 0,
          userInteraction: data.data?.totalBusiness ?? 0,
        });
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
      <StatCard 
        value={loading ? "..." : String(stats?.leads ?? 0)} 
        label="Number of Leads" 
        imageSrc={leads}
      />
      <StatCard 
        value={loading ? "..." : String(stats?.userInteraction ?? 0)} 
        label="Total businesses" 
        imageSrc={interaction}
      />
      {error && <div className="col-span-full text-red-500 text-center">{error}</div>}
    </div>
  );
};

export default StatsOverview;
