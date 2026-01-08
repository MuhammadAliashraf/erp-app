import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  Trash2, 
  Edit, 
  Printer, 
  Download,
  Package,
  CheckCircle2,
  Clock,
  AlertOctagon
} from 'lucide-react';
import purchaseOrderService from '@/services/purchase-order-service';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Modal from '@/components/ui/modal';
import PurchaseOrderForm from '@/components/purchase-orders/purchase-order-form';

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const data = await purchaseOrderService.getPurchaseOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order', error);
      // Optional: navigate back or show error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this purchase order? This action cannot be undone.')) {
      try {
        await purchaseOrderService.deletePurchaseOrder(id);
        navigate('/purchase-orders');
      } catch (error) {
        console.error('Failed to delete order', error);
      }
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      await purchaseOrderService.updatePurchaseOrder(id, data);
      setIsEditModalOpen(false);
      fetchOrder();
    } catch (error) {
      console.error('Failed to update order', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 animate-pulse">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <Button onClick={() => navigate('/purchase-orders')}>Back to List</Button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      'Received': 'bg-green-100 text-green-700 border-green-200',
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Draft': 'bg-gray-100 text-gray-700 border-gray-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200',
    };
    
    const icons = {
      'Received': <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
      'Pending': <Clock className="w-3.5 h-3.5 mr-1" />,
      'Draft': <FileText className="w-3.5 h-3.5 mr-1" />,
      'Cancelled': <AlertOctagon className="w-3.5 h-3.5 mr-1" />,
    };

    // Helper for icons if needed locally, for now simple text
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles['Draft']}`}>
        {icons[status]}
        {status}
        </span>
    );
  };
  
  // Dummy definition for FileText since it's used in styles above but not imported yet 
  // (Adding it to imports list now)
  const FileText = ({ className }) => <span className={className}>📄</span>;


  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/purchase-orders')}
          className="text-gray-500 hover:text-gray-900 -ml-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handlePrint} className="flex-1 sm:flex-none">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button 
            variant="default" 
            className="bg-indigo-600 hover:bg-indigo-700 flex-1 sm:flex-none"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Order
          </Button>
           <Button 
            variant="destructive" 
            size="icon"
            onClick={handleDelete}
            title="Delete Order"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-none shadow-lg bg-white print:shadow-none print:border">
                <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-indigo-600">Purchase Order</p>
                        <h1 className="text-3xl font-bold text-gray-900 mt-1">{order.orderNumber}</h1>
                        <p className="text-gray-500 text-sm mt-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            Created on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        {getStatusBadge(order.status)}
                    </div>
                </div>
                
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium uppercase text-xs tracking-wider text-left">
                                <tr>
                                    <th className="px-6 py-4">Item Details</th>
                                    <th className="px-6 py-4 text-center">Qty</th>
                                    <th className="px-6 py-4 text-right">Unit Price</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items.map((item, index) => (
                                    <tr key={item.id || index} className="group hover:bg-indigo-50/10">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.product?.name || `Product #${item.productId}`}</p>
                                                    <p className="text-xs text-gray-500">{item.product?.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600 font-medium">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            ${Number(item.unitPrice).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            ${Number(item.totalPrice).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50/50">
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right text-gray-500 font-medium">Subtotal</td>
                                    <td className="px-6 py-4 text-right text-gray-900 font-medium">${Number(order.totalAmount).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right text-gray-900 font-bold text-lg">Total Amount</td>
                                    <td className="px-6 py-4 text-right text-indigo-600 font-bold text-lg">${Number(order.totalAmount).toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

             {/* Notes Section */}
             {order.notes && (
                <Card className="border-none shadow-md bg-white print:border print:shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm uppercase tracking-wide text-gray-500">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <Card className="border-none shadow-md bg-white print:border print:shadow-none">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <CardTitle className="text-base font-semibold text-gray-900">Supplier Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div>
                        <p className="text-sm font-medium text-gray-900">{order.supplier?.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{order.supplier?.contactPerson}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                         <div className="flex items-start gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                <span className="text-xs">@</span>
                            </div>
                            <div className="break-all">
                                <p className="text-gray-500 text-xs uppercase">Email</p>
                                <p className="font-medium">{order.supplier?.email || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                             <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0">
                                <span className="text-xs">📞</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase">Phone</p>
                                <p className="font-medium">{order.supplier?.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                             <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                                <span className="text-xs">📍</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase">Address</p>
                                <p className="font-medium">{order.supplier?.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card className="border-none shadow-md bg-indigo-600 text-white print:hidden">
                <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                    <p className="text-indigo-100 text-sm mb-4">
                        If you need to change items or cancel this order, please use the Edit functionality or contact the supplier directly.
                    </p>
                </CardContent>
            </Card>

        </div>
      </div>

       <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Purchase Order"
        maxWidth="max-w-4xl"
      >
        <PurchaseOrderForm 
          order={order}
          onSubmit={handleEditSubmit} 
          isLoading={isLoading} // Reuse loading state or create separate local state
        />
      </Modal>

    </div>
  );
};

export default PurchaseOrderDetail;
