import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";

interface SubscriptionCardProps {
  type: 'active' | 'pending' | 'canceled';
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
  
  return (
    <Card>
      <CardHeader className="flex flex-row p-4">
        {imageSrc ? (
          <Image src={imageSrc} alt={label} width={32} height={32} className="object-contain" />
        ) : (
          icon
        )}
        <CardTitle className="text-base font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="text-xl">Count: {count}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
