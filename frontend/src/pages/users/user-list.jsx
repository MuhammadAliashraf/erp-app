import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, User, Download } from 'lucide-react';
import userService from '@/services/user-service';
import Modal from '@/components/ui/modal';
import UserForm from '@/components/users/user-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (currentUser) {
        await userService.updateUser(currentUser.id, data);
      } else {
        await userService.createUser(data);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user', error);
    }
  };

   const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Username,Role,Created At\n"
        + users.map(u => `${u.name},${u.username},${u.role},${new Date(u.createdAt).toLocaleDateString()}`).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">User Management</h1>
          <p className="text-gray-500 mt-1">Manage systems access and user roles efficiently.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <Button variant="outline" onClick={handleExport} className="hidden md:flex gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            Add User
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
                placeholder="Search users by name or username..."
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
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="text-xs uppercase font-semibold">User Details</TableHead>
                  <TableHead className="text-xs uppercase font-semibold">Role & Permissions</TableHead>
                  <TableHead className="text-xs uppercase font-semibold">Status</TableHead>
                  <TableHead className="text-xs uppercase font-semibold">Joined Date</TableHead>
                  <TableHead className="text-right text-xs uppercase font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                             <p>Loading users...</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                             <User className="h-12 w-12 text-gray-300" />
                             <p className="text-lg font-medium text-gray-900">No users found</p>
                             <p className="text-sm">Try adjusting your search or add a new user.</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md transform group-hover:scale-110 transition-transform duration-300">
                            {user.name?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500 font-medium">@{user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`rounded-full px-3 py-1 font-semibold
                          ${user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 border-purple-200' 
                            : user.role === 'manager'
                            ? 'bg-blue-100 text-blue-700 border-blue-200' 
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                       <TableCell>
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                            onClick={() => handleEdit(user)}
                             title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                            onClick={() => handleDelete(user.id)}
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
        title={currentUser ? 'Edit User' : 'Add New User'}
        maxWidth="max-w-md"
      >
        <UserForm 
          user={currentUser} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} // Note: simplified, technically create/update loading state could be separate
        />
      </Modal>
    </div>
  );
};

export default UserList;
