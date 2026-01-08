import React, { useEffect, useState } from 'react';
import { Plus, Search, FileCheck, Eye } from 'lucide-react';
import grnService from '@/services/grn-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const GrnList = () => {
  const [grns, setGrns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchGrns = async () => {
    try {
      setIsLoading(true);
      const data = await grnService.getAllGrns();
      setGrns(data);
    } catch (error) {
      console.error('Failed to fetch GRNs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrns();
  }, []);

  const filteredGrns = grns.filter(grn => 
    grn.grnNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    grn.purchaseOrder?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grn.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Goods Receiving Notes</h1>
          <p className="text-gray-500 mt-1">Manage and track received inventory from suppliers.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button onClick={() => navigate('/grn/create')} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            Create GRN
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="relative w-full sm:w-96 group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <Input
                type="search"
                placeholder="Search GRN, PO, or Supplier..."
                className="pl-10 w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="text-xs uppercase font-semibold">GRN Number</TableHead>
                  <TableHead className="text-xs uppercase font-semibold">PO Ref</TableHead>
                  <TableHead className="text-xs uppercase font-semibold">Supplier</TableHead>
                  <TableHead className="text-xs uppercase font-semibold">Received Date</TableHead>
                  <TableHead className="text-xs uppercase font-semibold">Status</TableHead>
                  <TableHead className="text-right text-xs uppercase font-semibold">Value</TableHead>
                  {/* <TableHead className="text-right text-xs uppercase font-semibold">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                             <p>Loading records...</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : filteredGrns.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                             <FileCheck className="h-12 w-12 text-gray-300" />
                             <p className="text-lg font-medium text-gray-900">No GRNs found</p>
                             <p className="text-sm">Create a new GRN to receive goods.</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGrns.map((grn) => (
                    <TableRow key={grn.id} className="group hover:bg-slate-50/50">
                      <TableCell className="font-semibold text-gray-900">{grn.grnNumber}</TableCell>
                      <TableCell className="text-indigo-600 font-medium">{grn.purchaseOrder?.orderNumber}</TableCell>
                      <TableCell>{grn.supplier?.name}</TableCell>
                      <TableCell>
                        {new Date(grn.receivedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {grn.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${Number(grn.totalValue).toFixed(2)}
                      </TableCell>
                      {/* <TableCell className="text-right">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(`/grn/${grn.id}`)}
                        >
                            <Eye className="w-4 h-4 text-gray-400" />
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrnList;
