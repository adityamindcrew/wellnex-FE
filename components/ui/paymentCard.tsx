import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PaymentsCard = () => {
  const payments = [
    {
      id: 1,
      company: "Natural Technologies",
      date: "May 4, 2025",
      amount: "$1,250.00",
      status: "completed"
    },
    {
      id: 2,
      company: "GreenLeaf Organics",
      date: "May 3, 2025",
      amount: "$899.00",
      status: "pending"
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Payments</CardTitle>
        <Badge variant="outline" className="ml-auto">View all</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-500">Recent Transactions</h4>
        </div>
        
        <div className="mt-4 space-y-4">
          {payments.map((payment) => (
            <div key={payment.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium">{payment.company}</h5>
                  <p className="text-xs text-gray-500 mt-1">{payment.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{payment.amount}</span>
                  <Badge 
                    variant="outline" 
                    className={`block mt-1 text-xs ${
                      payment.status === 'completed' 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}
                  >
                    {payment.status === 'completed' ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              </div>
              {payment.id !== payments.length && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsCard;
