import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import categoryService from '@/services/category-service';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  stockQuantity: z.coerce.number().min(0, 'Stock cannot be negative'),
  minStockLevel: z.coerce.number().min(0, 'Min stock cannot be negative'),
  unit: z.string().default('pcs'),
  description: z.string().optional(),
});

const ProductForm = ({ product, onSubmit, isLoading }) => {
  const [categories, setCategories] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      price: 0,
      stockQuantity: 0,
      minStockLevel: 5,
      unit: 'pcs',
      description: '',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stockQuantity: product.stockQuantity,
        minStockLevel: product.minStockLevel,
        unit: product.unit,
        description: product.description || '',
      });
    } else {
       reset({
        name: '',
        sku: '',
        category: '',
        price: 0,
        stockQuantity: 0,
        minStockLevel: 5,
        unit: 'pcs',
        description: '',
      });
    }
  }, [product, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="e.g. Wireless Mouse" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" placeholder="e.g. WM-001" {...register('sku')} className={errors.sku ? 'border-red-500' : ''} />
            {errors.sku && <p className="text-xs text-red-500">{errors.sku.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
             <select
                id="category"
                {...register('category')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Category</option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No categories found</option>
                )}
              </select>
             {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
        </div>
         <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
             <select
                id="unit"
                {...register('unit')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="box">Box</option>
                <option value="ltr">Liter (ltr)</option>
                <option value="m">Meter (m)</option>
              </select>
        </div>
      </div>

       <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input type="number" step="0.01" id="price" {...register('price')} className={errors.price ? 'border-red-500' : ''} />
             {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="stockQuantity">Current Stock</Label>
            <Input type="number" id="stockQuantity" {...register('stockQuantity')} className={errors.stockQuantity ? 'border-red-500' : ''} />
             {errors.stockQuantity && <p className="text-xs text-red-500">{errors.stockQuantity.message}</p>}
        </div>
         <div className="space-y-2">
            <Label htmlFor="minStockLevel">Min Stock Alert</Label>
            <Input type="number" id="minStockLevel" {...register('minStockLevel')} />
        </div>
      </div>
      
       <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Product details..." {...register('description')} />
        </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
