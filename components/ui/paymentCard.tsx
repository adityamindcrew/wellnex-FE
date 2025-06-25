import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

interface Payment {
  number: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  customer: {
    id: string;
    name: string | null;
    email: string;
  };
}

const PaymentsCard = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 2;

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${process.env.NEXT_API_URL}/admin/subscriptions/payments?limit=25&skip=0&status=paid`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.status === true) {
          setAllPayments(data.data.payments);
          const totalCount = data.data.total || data.data.payments.length;
          setTotalItems(totalCount);
          setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE));
        } else {
          setError('Failed to fetch payments');
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('An error occurred while fetching payments');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPayments();
  }, []);

  useEffect(() => {
    // Calculate the slice of payments to show for current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPayments(allPayments.slice(startIndex, endIndex));
  }, [currentPage, allPayments]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        className="px-3 py-1 text-sm rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
      >
        Previous
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          className="px-3 py-1 text-sm rounded border hover:bg-gray-50"
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-3 py-1 text-sm rounded ${
            currentPage === i 
              ? 'bg-black text-white' 
              : 'border hover:bg-gray-50'
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2">...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          className="px-3 py-1 text-sm rounded border hover:bg-gray-50"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        className="px-3 py-1 text-sm rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
      >
        Next
      </button>
    );

    return buttons;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Payments</CardTitle>
 
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-500">Recent Transactions</h4>
        </div>
        
        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No payments found</div>
          ) : (
            payments.map((payment, index) => (
              <div key={payment.number}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium">{payment.customer.name || 'N/A'}</h5>
                    <p className="text-xs text-gray-500 mt-1">{payment.customer.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatAmount(payment.amount, payment.currency)}</span>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(payment.created)}</p>
                  </div>
                </div>
                {index !== payments.length - 1 && <Separator className="my-4" />}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Showing {startItem} to {endItem} of {totalItems} payments
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {renderPaginationButtons()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsCard;
