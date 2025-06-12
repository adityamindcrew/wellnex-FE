import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  type: 'active' | 'pending' | 'canceled'|'canceled at period end';
  count: number;
  label: string;
  description: string;
  color: string;
  icon?: React.ReactNode;
  imageSrc?: string | StaticImageData;
}

const SubscriptionCard = ({ 
  type, 
  count, 
  label, 
  description,
  icon,
  imageSrc,
  // color
}: SubscriptionCardProps) => {
  
  const titleColorClass = {
    active: "text-[#19B100]",
    pending: "text-[#FF6F00]",
    canceled: "text-[#DC2626]",
    "canceled at period end" :"text-[#DC2626]"
  }[type];
  
  return (
    <Card>
      <CardHeader className="flex flex-row p-2">
        {imageSrc ? (
          <Image src={imageSrc} alt={label} width={28} height={28} className="object-contain" />
        ) : (
          icon
        )}
        <CardTitle className={cn("ml-2 text-base font-medium", titleColorClass)}>{label}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="text-xl">Count: {count}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
