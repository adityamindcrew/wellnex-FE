import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="bg-black text-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="font-semibold text-lg">WellnexAI</div>
          <div className="hidden md:block">
            <button className="px-3 py-1 bg-black text-white rounded-md text-sm font-medium">
              Dashboard
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search" 
              className="pl-10 w-[200px] bg-gray-800 border-gray-700 text-white focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <div className="bg-primary rounded-full w-full h-full flex items-center justify-center text-sm font-medium">
                JS
              </div>
            </Avatar>
            <span className="ml-2 text-sm font-medium hidden md:block">Alex Smith</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
