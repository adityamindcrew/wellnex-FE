import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const NotificationsCard = () => {
  const notifications = [
    {
      id: 1,
      type: "cancel",
      title: "Subscription Canceled",
      description: "Gourmet Delights has canceled their subscription",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "new",
      title: "New Business Sign-up",
      description: "Gourmet Delights has completed their subscription",
      time: "4 hours ago",
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'cancel':
        return (
          <div className="rounded-full bg-red-50 p-2">
            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'new':
        return (
          <div className="rounded-full bg-blue-50 p-2">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Email Notifications</CardTitle>
        <Badge variant="outline" className="ml-auto">3+</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-500">Recent Notifications</h4>
        </div>
        
        <div className="mt-4 space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id}>
              <div className="flex items-start gap-4">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <h5 className="text-sm font-medium">{notification.title}</h5>
                  <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                  <span className="text-xs text-gray-400 mt-1 block">{notification.time}</span>
                </div>
              </div>
              {notification.id !== notifications.length && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
