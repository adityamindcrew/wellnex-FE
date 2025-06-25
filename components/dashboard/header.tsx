import { Search } from "lucide-react"
import { useEffect, useState } from "react"

export default function Header() {
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    const fetchBusinessDetail = async () => {
      const token = localStorage.getItem('token');
      const businessId = localStorage.getItem('businessId');
      if (!token || !businessId) return;

      const response = await fetch(`https://13.61.105.209/api/business/getBusinessDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({ businessId })
      });

      if (response) {
        const data = await response.json();

        setBusiness(data.data);
      }
    };

    fetchBusinessDetail();
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="relative w-full max-w-[450px] ml-12 md:ml-0">
        {/* <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-gray-400 focus:outline-none"
        /> */}
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:block text-right">
          <div className="text-sm font-medium">{business?.name}</div>
    
        </div>
        <div className="h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-full bg-gray-200">
          <img
            src={business?.logo ? `https://13.61.105.209/uploads/business-logos/${business.logo}` : "/avatar.png"}
            alt={business?.name || "Business Logo"}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
