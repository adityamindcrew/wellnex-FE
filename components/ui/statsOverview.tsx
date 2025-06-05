import { useEffect, useState } from "react";
import StatCard from "./statCard";
import { Users, Briefcase, BarChart4, Building } from "lucide-react";
import leads from "../../app/assets/images/leads.png"
import active from "../../app/assets/images/active.png"
import interaction from "../../app/assets/images/intercation.png"
import success from "../../app/assets/images/success.png"

interface LeadCounts {
  leads: number;
  activeServices: number;
  userInteraction: number;
  successRate: number;
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
        const response = await fetch("https://wellnexai.com/api/admin/lead-counts", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats({
          leads: data.data?.totalLeads ?? 0,
          activeServices: data.data?.activeServices ?? 0,
          userInteraction: data.data?.userInteraction ?? 0,
          successRate: data.data?.successRate ?? 0,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
      <StatCard 
        value={loading ? "..." : String(stats?.leads ?? 0)} 
        label="Number of Leads" 
        imageSrc={leads}
      />
      <StatCard 
        value={loading ? "..." : String(stats?.activeServices ?? 0)} 
        label="Active Services" 
        imageSrc={active}
      />
      <StatCard 
        value={loading ? "..." : String(stats?.userInteraction ?? 0)} 
        label="User Intercation" 
        imageSrc={interaction}
      />
      <StatCard 
        value={loading ? "..." : String(stats?.successRate ?? 0)} 
        label="Success Rate" 
        imageSrc={success}
      />
      {error && <div className="col-span-full text-red-500 text-center">{error}</div>}
    </div>
  );
};

export default StatsOverview;
