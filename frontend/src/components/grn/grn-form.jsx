import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ArrowLeft, Save, Search } from 'lucide-react';
import purchaseOrderService from '@/services/purchase-order-service';
import grnService from '@/services/grn-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const GrnForm = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPo, setSelectedPo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      items: [],
      notes: '',
      receivedDate: new Date().toISOString().split('T')[0]
    }
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "items"
  });

  // Fetch Pending Purchase Orders
  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const data = await purchaseOrderService.getAllPurchaseOrders();
        // Show all POs suitable for receiving (not fully received or cancelled)
        const activePOs = data.filter(po => po.status !== 'Received' && po.status !== 'Cancelled'); 
        console.log('Available POs for GRN:', activePOs);
        setPurchaseOrders(activePOs);
      } catch (error) {
        console.error('Failed to fetch POs', error);
      }
    };
    fetchPOs();
  }, []);

  const handlePoSelect = async (poId) => {
    if (!poId) return;
    setIsLoading(true);
    try {
      const data = await purchaseOrderService.getPurchaseOrder(poId);
      setSelectedPo(data);
      
      // Map PO items to GRN items form
      const formItems = data.items.map(item => ({
        productId: item.productId,
        productName: item.product?.name,
        sku: item.product?.sku,
        orderedQuantity: item.quantity,
        receivedQuantity: item.quantity, // Default to full receipt
        unitPrice: item.unitPrice,
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      }));
      
      replace(formItems);
    } catch (error) {
      console.error('Failed to fetch PO details', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedPo) return;
    
    try {
      setIsLoading(true);
      const payload = {
        purchaseOrderId: selectedPo.id,
        supplierId: selectedPo.supplierId,
        receivedDate: data.receivedDate,
        notes: data.notes,
        items: data.items.map(item => ({
          productId: item.productId,
          receivedQuantity: Number(item.receivedQuantity),
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.receivedQuantity) * Number(item.unitPrice)
        }))
      };

      await grnService.createGrn(payload);
      navigate('/grn');
    } catch (error) {
      console.error('Failed to create GRN', error);
      alert('Failed to create GRN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
        return sum + (Number(item.receivedQuantity || 0) * Number(item.unitPrice || 0));
    }, 0);
  };

  const watchedItems = watch('items');

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/grn')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Goods Receiving Note</h1>
          <p className="text-gray-500">Receive items against a Purchase Order.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Purchase Order</Label>
                  <Select onValueChange={handlePoSelect} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO..." />
                    </SelectTrigger>
                    <SelectContent>
                      {purchaseOrders.map(po => (
                        <SelectItem key={po.id} value={po.id.toString()}>
                          {po.orderNumber} - {po.supplier?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <Label>Received Date</Label>
                   <Input type="date" {...register('receivedDate')} />
                </div>
              </div>

               {selectedPo && (
                  <div className="bg-slate-50 p-4 rounded-lg text-sm space-y-2 border border-slate-100">
                      <div className="flex justify-between">
                          <span className="text-gray-500">Supplier:</span>
                          <span className="font-medium">{selectedPo.supplier?.name}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-gray-500">Order Date:</span>
                          <span className="font-medium">{new Date(selectedPo.createdAt).toLocaleDateString()}</span>
                      </div>
                  </div>
              )}
            </CardContent>
          </Card>

          {fields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Items Received</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Ordered</TableHead>
                        <TableHead className="w-32">Received Qty</TableHead>
                        <TableHead className="w-32">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-xs text-gray-500">{item.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-gray-500">
                            {item.orderedQuantity}
                          </TableCell>
                          <TableCell>
                            <Input 
                                type="number" 
                                min="0"  
                                {...register(`items.${index}.receivedQuantity`, { required: true, min: 0 })}
                                className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                             <div className="relative">
                                <span className="absolute left-2 top-1.5 text-gray-500 text-xs">$</span>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    {...register(`items.${index}.unitPrice`, { required: true, min: 0 })}
                                    className="h-8 pl-5"
                                />
                             </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${(Number(watch(`items.${index}.receivedQuantity`)) * Number(watch(`items.${index}.unitPrice`))).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
          )}

           <Card>
            <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea 
                    placeholder="Any notes regarding the delivery condition or variances..." 
                    {...register('notes')}
                />
            </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
            <Card className="bg-slate-900 text-white border-none">
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Summary</h3>
                    <div className="space-y-2 mb-6 text-slate-300">
                        <div className="flex justify-between">
                            <span>Total Items</span>
                            <span>{fields.length}</span>
                        </div>
                         <div className="flex justify-between text-white text-lg font-bold border-t border-slate-700 pt-2">
                            <span>Total Value</span>
                            <span>${calculateTotal(watchedItems || []).toFixed(2)}</span>
                        </div>
                    </div>
                    <Button 
                        onClick={handleSubmit(onSubmit)} 
                        disabled={isLoading || fields.length === 0}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                        {isLoading ? 'Processing...' : 'Post GRN'}
                    </Button>
                     <p className="text-xs text-center text-slate-400 mt-3">
                        Posting will update inventory levels immediately.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default GrnForm;
