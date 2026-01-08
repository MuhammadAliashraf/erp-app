import React, { useEffect, useState } from 'react';
import { Plus, Search, FileText, Calendar, DollarSign, Eye } from 'lucide-react';
import purchaseOrderService from '@/services/purchase-order-service';
import Modal from '@/components/ui/modal';
import PurchaseOrderForm from '@/components/purchase-orders/purchase-order-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await purchaseOrderService.getAllPurchaseOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      await purchaseOrderService.createPurchaseOrder(data);
      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Failed to create order', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Received': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (order) => {
    // Navigate to detail page
    // Assuming we have a route or we can make the row clickable
    // For now, let's use a navigate hook if thiscomponent was inside a generic route
    // But since this is a top level component, we need to import useNavigate
    window.location.href = `/purchase-orders/${order.id}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Purchase Orders</h1>
          <p className="text-gray-500 mt-1">Manage procurement and supplier orders.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
             <div className="relative w-full sm:w-96 group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <Input
                type="search"
                placeholder="Search by PO# or Supplier..."
                className="pl-10 w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[100px] text-xs uppercase font-semibold">PO Number</TableHead>
                  <TableHead className="text-xs uppercase font-semibold">Supplier</TableHead>
                  <TableHead className="text-xs uppercase font-semibold">Date</TableHead>
                  <TableHead className="text-xs uppercase font-semibold">Status</TableHead>
                  <TableHead className="text-right text-xs uppercase font-semibold">Total</TableHead>
                  <TableHead className="text-right text-xs uppercase font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                             <p>Loading orders...</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                             <FileText className="h-12 w-12 text-gray-300" />
                             <p className="text-lg font-medium text-gray-900">No purchase orders found</p>
                             <p className="text-sm">Create a new order to restock inventory.</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="group hover:bg-slate-50/50">
                      <TableCell className="font-medium text-gray-900">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
                                {order.supplier?.name?.charAt(0)}
                            </div>
                            {order.supplier?.name || 'Unknown Supplier'}
                         </div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`rounded-full ${getStatusColor(order.status)} border-0 px-2.5 py-0.5`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-gray-900">
                        ${Number(order.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                            title="View Details"
                            onClick={() => handleView(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Purchase Order"
        maxWidth="max-w-4xl"
      >
        <PurchaseOrderForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </Modal>
    </div>
  );
};

export default PurchaseOrderList;
