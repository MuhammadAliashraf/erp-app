import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Truck, Download, Phone, Mail } from 'lucide-react';
import supplierService from '@/services/supplier-service';
import Modal from '@/components/ui/modal';
import SupplierForm from '@/components/suppliers/supplier-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to fetch suppliers', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreate = () => {
    setCurrentSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier) => {
    setCurrentSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierService.deleteSupplier(id);
        setSuppliers(suppliers.filter(s => s.id !== id));
      } catch (error) {
        console.error('Failed to delete supplier', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (currentSupplier) {
        await supplierService.updateSupplier(currentSupplier.id, data);
      } else {
        await supplierService.createSupplier(data);
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (error) {
      console.error('Failed to save supplier', error);
    }
  };

   const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Contact Person,Email,Phone,Address,Tax ID\n"
        + suppliers.map(s => `${s.name},${s.contactPerson || ''},${s.email || ''},${s.phone || ''},${s.address || ''},${s.taxId || ''}`).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "suppliers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Supplier Management</h1>
          <p className="text-gray-500 mt-1">Manage vendor relationships and contact details.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <Button variant="outline" onClick={handleExport} className="hidden md:flex gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
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
                placeholder="Search suppliers..."
                className="pl-10 w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
             <div className="flex items-center gap-2 md:hidden">
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" /> Export
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Contact Person</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Tax ID / VAT</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                             <p>Loading suppliers...</p>
                        </div>
                    </td>
                  </tr>
                ) : filteredSuppliers.length === 0 ? (
                    <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                             <Truck className="h-12 w-12 text-gray-300" />
                             <p className="text-lg font-medium text-gray-900">No suppliers found</p>
                             <p className="text-sm">Add a supplier to start tracking purchases.</p>
                        </div>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="group hover:bg-indigo-50/30 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div className="font-semibold text-gray-900">{supplier.name}</div>
                        </div>
                      </td>
                       <td className="px-6 py-4 text-gray-700">
                        {supplier.contactPerson || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs text-gray-500">
                            {supplier.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> {supplier.email}
                                </div>
                            )}
                            {supplier.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3" /> {supplier.phone}
                                </div>
                            )}
                            {!supplier.email && !supplier.phone && '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {supplier.taxId || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                            onClick={() => handleEdit(supplier)}
                            title="Edit Supplier"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                            onClick={() => handleDelete(supplier.id)}
                            title="Delete Supplier"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
        title={currentSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        maxWidth="max-w-2xl"
      >
        <SupplierForm 
          supplier={currentSupplier} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </Modal>
    </div>
  );
};

export default SupplierList;
