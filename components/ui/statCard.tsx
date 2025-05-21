import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  imageSrc?: string | StaticImageData;
  color?: string;
}

const StatCard = ({ value, label, icon, imageSrc, color = "blue" }: StatCardProps) => {
  const getColorClasses = () => {
    switch(color) {
      case 'blue':
        return 'text-blue-600 bg-blue-50';
      case 'green':
        return 'text-green-600 bg-green-50';
      case 'amber':
        return 'text-amber-600 bg-amber-50';
      case 'purple':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
          <div className="text-sm text-[#6B7280] mt-1">{label}</div>
            <div className="text-2xl font-bold">{value}</div>
       
          </div>
          <div className="p-3 rounded-full">
            {imageSrc ? (
              <Image src={imageSrc} alt={label} width={40} height={40} className="object-contain" />
            ) : icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
