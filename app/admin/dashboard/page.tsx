'use client'
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Search, Mail, Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import StatsOverview from "../../../components/ui/statsOverview";
import SubscriptionCard from "../../../components/ui/subscriptionCard";
import NotificationsCard from "../../../components/ui/notificationCard";
import PaymentsCard from "../../../components/ui/paymentCard";
import activeImg from "../../../app/assets/images/activeSubscription.png";
import paused from "../../../app/assets/images/paused.png";
import cancel from "../../../app/assets/images/cancel.png";
import { wellnexApi } from "@/lib/api/wellnex";
import { useDashboardSearch } from "./layout";

const ITEMS_PER_PAGE = 5;

interface BusinessListItem {
  _id: string;
  name: string;
  email: string;
  contact_name: string;
  website_url: string | null;
  instagram_url: string | null;
  logo: string | null;
  themeColor: string | null;
  isEmailVerified: boolean;
  keywords: Array<{
    name: string;
    _id: string;
  }>;
}

interface BusinessListResponse {
  docs: BusinessListItem[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

const Index = () => {
  const { searchTerm } = useDashboardSearch();
  const [allBusinesses, setAllBusinesses] = useState<BusinessListItem[]>([]);
  const [businesses, setBusinesses] = useState<BusinessListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [subscriptionCounts, setSubscriptionCounts] = useState({
    active: 0,
    paused: 0,
    cancelled: 0,
    total: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionCounts = async () => {
      try {
    
        const response = await fetch('https://wellnexai.com/api/admin/subscriptions/counts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        console.log(data);
        if (data.status === true) {
          setSubscriptionCounts(data.data);
        }
      } catch (err) {
        console.error('Error fetching subscription counts:', err);
      }
    };

    fetchSubscriptionCounts();
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const response = await wellnexApi.business.getBusinessList({
          limit: 1000, // Fetch all businesses for client-side search
          skip: 0,
          sort: 'name',
          sort_order: -1
        });
        
        if (response.data?.data?.docs) {
          setAllBusinesses(response.data.data.docs);
          setTotalItems(response.data.data.docs.length);
        } else {
          setAllBusinesses([]);
          setTotalItems(0);
        }
      } catch (err) {
        setError('Failed to fetch business list');
        console.error('Error fetching business list:', err);
        setAllBusinesses([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Filter businesses based on search term
  useEffect(() => {
    const filtered = allBusinesses.filter(business => 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setBusinesses(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, allBusinesses]);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return businesses.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Previous
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button 
          key="1"
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
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next
      </button>
    );

    return buttons;
  };

  const handleDeleteClick = (businessId: string) => {
    setBusinessToDelete(businessId);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBusinessToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!businessToDelete) return;

    try {
      setDeleteLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : '';
      const reason = "testing";

      if (!token) {
        alert('Authentication information missing. Please login again.');
        return;
      }

      const response = await fetch(`https://wellnexai.com/api/admin/business/${businessToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.status) {
        setAllBusinesses(prev => prev.filter(business => business._id !== businessToDelete));
        setBusinesses(prev => prev.filter(business => business._id !== businessToDelete));
        setShowDeleteModal(false);
        setBusinessToDelete(null);
      } else {
        alert(data.message || 'Failed to delete business');
      }
    } catch (err) { 
      console.error('Error deleting business:', err);
      alert('Failed to delete business. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {/* <Header onSearch={handleSearch} isLoading={loading} /> */}
      {/* <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1> */}
      {/* <StatsOverview /> */}
      <Card className="mt-8">
        <div className="p-6">
          <Tabs defaultValue="profiles">
            <div className="flex mb-4">
              <TabsList>
                <TabsTrigger value="profiles">Business Profiles</TabsTrigger>
              </TabsList>
              <Badge variant="outline" className="bg-gray-100 ml-2 text-[#000000]">{totalItems} Users</Badge>
            </div>
            
            <TabsContent value="profiles">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription Status</TableHead>
                      <TableHead>Services Offered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-red-500">
                          {error}
                        </TableCell>
                      </TableRow>
                    ) : businesses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No businesses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      getCurrentPageItems().map((business) => (
                        <TableRow key={business._id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {business.logo && (
                                <img 
                                  src={`https://wellnexai.com/uploads/business-logos/${business.logo}`}
                                  alt={`${business.name} logo`}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              )}
                              <span>{business.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{business.email}</TableCell>
                          <TableCell>
                            {/* <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200"> */}
                              {/* Active */}
                            {/* </Badge> */}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              <></>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {/* <button className="text-gray-500 hover:text-gray-700">
                                <Eye className="h-4 w-4" />
                              </button> */}
                              <button className="text-gray-500 hover:text-gray-700">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleDeleteClick(business._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Showing {startItem} to {endItem} of {totalItems} businesses
                </span>
                <div className="flex items-center gap-2">
                  {renderPaginationButtons()}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="p-8 text-center text-gray-500">
                Users tab content will appear here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <SubscriptionCard 
          type="active"
          count={subscriptionCounts.active}
          label="Active Subscriptions"
          description="Businesses currently utilizing services with active billing cycles."
          color="green"
          imageSrc={activeImg}
        />
        
        <SubscriptionCard 
          type="pending"
          count={subscriptionCounts.paused}
          label="Paused Subscriptions"
          description="Businesses that have temporarily suspended their subscriptions"
          color="amber"
          imageSrc={paused}
        />
        
        <SubscriptionCard 
          type="canceled"
          count={subscriptionCounts.cancelled}
          label="Canceled Subscriptions"
          description="Businesses that have terminated their subscriptions."
          color="red"
          imageSrc={cancel}
        />
      </div>
      
      {/* Notifications & Payments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* <NotificationsCard /> */}
        <PaymentsCard />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Business</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this business? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
