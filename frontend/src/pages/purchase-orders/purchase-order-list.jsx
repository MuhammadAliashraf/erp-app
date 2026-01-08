import React, { useEffect, useState } from 'react';
import { Plus, Search, FileText, Calendar, DollarSign, Eye } from 'lucide-react';
import purchaseOrderService from '@/services/purchase-order-service';
import Modal from '@/components/ui/modal';
import PurchaseOrderForm from '@/components/purchase-orders/purchase-order-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

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
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4">PO Number</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                             <p>Loading orders...</p>
                        </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                    <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                             <FileText className="h-12 w-12 text-gray-300" />
                             <p className="text-lg font-medium text-gray-900">No purchase orders found</p>
                             <p className="text-sm">Create a new order to restock inventory.</p>
                        </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-indigo-50/30 transition-colors duration-200">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
                                {order.supplier?.name?.charAt(0)}
                            </div>
                            {order.supplier?.name || 'Unknown Supplier'}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                            title="View Details"
                            onClick={() => handleView(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
