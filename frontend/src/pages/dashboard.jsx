import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { logout } = useAuth();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800">Welcome to the Dashboard</h1>
            <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Logout
            </button>
        </div>
    );
}

export default Dashboard;
