import StatCard from "./statCard";
import { Users, Briefcase, BarChart4, Building } from "lucide-react";
import leads from "../../app/assets/images/leads.png"
import active from "../../app/assets/images/active.png"
import interaction from "../../app/assets/images/intercation.png"
import success from "../../app/assets/images/success.png"

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
      <StatCard 
        value="245" 
        label="Number of Leads" 
        imageSrc={leads}
   
      />
      <StatCard 
        value="1,253" 
        label="Active Services" 
        imageSrc={active}
   
      />
      <StatCard 
        value="3.45k" 
        label="User Intercation" 
        imageSrc={interaction}
  
      />
      <StatCard 
        value="246" 
        label="Success Rate" 
        imageSrc={success}
      />
    </div>
  );
};

export default StatsOverview;
