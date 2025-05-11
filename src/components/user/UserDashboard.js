import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch user data');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!userData) return <div>No user data found</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    <p className="mt-2">Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    {/* Add recent activity content here */}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard; 