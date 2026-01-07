import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Dashboard = () => {
    const { logout } = useAuth();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-indigo-500">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-800">Dashboard</CardTitle>
                    <CardDescription>You are successfully logged in.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 p-6">
                    <div className="p-4 bg-indigo-50 text-indigo-700 rounded-lg w-full text-center font-medium">
                        Welcome to your ERP System
                    </div>
                     <Button variant="destructive" onClick={logout} className="w-full sm:w-auto">
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default Dashboard;
