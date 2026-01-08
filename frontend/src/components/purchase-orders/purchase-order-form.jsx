import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Calendar } from 'lucide-react';
import supplierService from '@/services/supplier-service';
import productService from '@/services/product-service';

const purchaseOrderSchema = z.object({
  supplierId: z.coerce.number().min(1, 'Supplier is required'),
  orderDate: z.string().min(1, 'Order date is required'),
  status: z.enum(['Pending', 'Received', 'Cancelled', 'Draft']).default('Pending'),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.coerce.number().min(1, 'Product is required'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.coerce.number().min(0, 'Price must be non-negative'),
  })).min(1, 'At least one item is required'),
});

const PurchaseOrderForm = ({ order, onSubmit, isLoading }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
      supplierId: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchItems = watch('items');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, productsData] = await Promise.all([
          supplierService.getAllSuppliers(),
          productService.getAllProducts(),
        ]);
        setSuppliers(suppliersData);
        setProducts(productsData);

        // If order exists, reset form with order data
        if (order) {
            reset({
                supplierId: order.supplier?.id || order.supplierId,
                orderDate: new Date(order.orderDate).toISOString().split('T')[0],
                status: order.status,
                notes: order.notes,
                items: order.items.map(item => ({
                    productId: item.productId || item.product?.id,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                }))
            });
        }
      } catch (error) {
        console.error('Failed to load form data', error);
      }
    };
    fetchData();
  }, [order, reset]);

  const handleProductChange = (index, productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  const calculateTotal = () => {
    return watchItems.reduce((sum, item) => {
      return sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0));
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Order Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="supplierId">Supplier</Label>
            <Controller
              control={control}
              name="supplierId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.supplierId && <p className="text-xs text-red-500">{errors.supplierId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderDate">Order Date</Label>
            <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10" />
                <Input type="date" id="orderDate" {...register('orderDate')} className="pl-10 bg-white" />
            </div>
            {errors.orderDate && <p className="text-xs text-red-500">{errors.orderDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} defaultValue="Pending">
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
           <Label htmlFor="notes">Notes</Label>
           <Textarea id="notes" placeholder="Optional notes for this order" {...register('notes')} className="bg-white" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
           <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Order Items</h3>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-white border rounded-lg shadow-sm hover:border-indigo-200 transition-colors">
            <div className="col-span-5 space-y-2">
              <Label className="text-xs">Product</Label>
              <Controller
                control={control}
                name={`items.${index}.productId`}
                render={({ field: renderField }) => (
                  <Select 
                    onValueChange={(val) => {
                      renderField.onChange(val);
                      handleProductChange(index, val);
                    }} 
                    value={renderField.value ? String(renderField.value) : undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={String(p.id)}>{p.name} (Stock: {p.stockQuantity})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.items?.[index]?.productId && <p className="text-xs text-red-500">{errors.items[index].productId.message}</p>}
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-xs">Price</Label>
              <Input 
                type="number" 
                step="0.01"
                {...register(`items.${index}.unitPrice`)} 
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-xs">Quantity</Label>
              <Input 
                type="number" 
                {...register(`items.${index}.quantity`)} 
              />
              {errors.items?.[index]?.quantity && <p className="text-xs text-red-500">{errors.items[index].quantity.message}</p>}
            </div>

            <div className="col-span-2 space-y-2">
                <Label className="text-xs">Total</Label>
                <div className="h-10 flex items-center px-3 bg-gray-50 border rounded-md text-sm font-medium text-gray-700">
                    ${((watchItems[index]?.quantity || 0) * (watchItems[index]?.unitPrice || 0)).toFixed(2)}
                </div>
            </div>

            <div className="col-span-1 flex justify-center pb-1">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                disabled={fields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
         {errors.items && <p className="text-xs text-red-500 px-1">{errors.items.message}</p>}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ productId: '', quantity: 1, unitPrice: 0 })}
          className="w-full border-dashed border-2 py-4 text-gray-500 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <div className="flex justify-end items-center gap-6 pt-6 border-t">
        <div className="text-right">
            <span className="text-sm text-gray-500">Grand Total</span>
            <div className="text-2xl font-bold text-indigo-600">${calculateTotal().toFixed(2)}</div>
        </div>
        <Button size="lg" type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 min-w-[150px]">
          {isLoading ? 'Creating Order...' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
