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
import { Search, Mail, Eye, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import StatsOverview from "../../../components/ui/statsOverview";
import SubscriptionCard from "../../../components/ui/subscriptionCard";
import NotificationsCard from "../../../components/ui/notificationCard";
import PaymentsCard from "../../../components/ui/paymentCard";
import activeImg from "../../../app/assets/images/active.png";
import paused from "../../../app/assets/images/paused.png";
import cancel from "../../../app/assets/images/cancel.png";
import { wellnexApi, BusinessListItem } from "@/lib/api/wellnex";

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const [businesses, setBusinesses] = useState<BusinessListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        const response = await wellnexApi.business.getBusinessList({
          limit: 10,
          skip: skip,
          sort: 'name',
          sort_order: -1
        });
        
        if (response.data?.data?.data) {
          setBusinesses(response.data.data.data);
          setTotalItems(response.data.data.total);
        } else {
          setBusinesses([]);
          setTotalItems(0);
        }
      } catch (err) {
        setError('Failed to fetch business list');
        console.error('Error fetching business list:', err);
        setBusinesses([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [currentPage]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <>
      {/* <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1> */}
      <StatsOverview />
      <Card className="mt-8">
        <div className="p-6">
          <Tabs defaultValue="profiles">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="profiles">Business Profiles</TabsTrigger>
                {/* <TabsTrigger value="users">Users</TabsTrigger> */}
              </TabsList>
              
            
            </div>
            
            <TabsContent value="profiles">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Subscription Status</TableHead>
                      <TableHead>Industry Verticals</TableHead>
                      <TableHead>Contact Address</TableHead>
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
                      businesses.map((business) => (
                        <TableRow key={business.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                {business.logo ? (
                                  <img src={business.logo} alt={business.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="bg-primary text-white rounded-full w-full h-full flex items-center justify-center">
                                    {business.name.charAt(0)}
                                  </div>
                                )}
                              </Avatar>
                              <span>{business.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                              {business.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{business.industry}</TableCell>
                          <TableCell className="text-gray-600">{business.email}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <button className="text-gray-500 hover:text-gray-700">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
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
                <Pagination>
                  <div className="flex items-center gap-1">
                    <button 
                      className="px-2 py-1 text-xs rounded border disabled:opacity-50" 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button 
                          key={pageNumber} 
                          className={`px-2 py-1 text-xs rounded ${currentPage === pageNumber ? 'bg-primary text-white' : 'border'}`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button 
                      className="px-2 py-1 text-xs rounded border disabled:opacity-50"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    >
                      Next
                    </button>
                  </div>
                </Pagination>
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
      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        <SubscriptionCard 
          type="active"
          count={120}
          label="Active Subscriptions"
          description="Businesses currently utilizing services with active billing cycles."
          color="green"
          imageSrc={activeImg}
        />
        
        <SubscriptionCard 
          type="pending"
          count={16}
          label="Paused Subscriptions"
          description="Businesses that have temporarily suspended their subscriptions"
          color="amber"
          imageSrc={paused}
        />
        
        <SubscriptionCard 
          type="canceled"
          count={30}
          label="Canceled Subscriptions"
          description="Businesses that have terminated their subscriptions."
          color="red"
          imageSrc={cancel}
        />
      </div>
      
      {/* Notifications & Payments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <NotificationsCard />
        <PaymentsCard />
      </div>
    </>
  );
};

export default Index;
