import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import DataTable from '../../components/Table';
import { FaUsers, FaUserTie, FaCalendarCheck } from 'react-icons/fa';
import { getAdminDash } from '../../services/DashService';

const AdminDashboard = () => {
 const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getAdminDash();
        console.log(res);
        setSummary(res);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pendingEventColumns = [
    { header: 'Event Name', accessor: 'title' },
    { header: 'Organizer', accessor: 'organizerName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', accessor: 'status' }
  ];

  if (loading) return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card
          title="Total Users"
          icon={<FaUsers />}
          value={summary?.totalUsers}
          description="Registered users"
        />
        <Card
          title="Total Organizers"
          icon={<FaUserTie />}
          value={summary?.totalOrganizers}
          description="Registered organizers"
        />
        <Card
          title="Approved Events"
          icon={<FaCalendarCheck />}
          value={summary?.totalApprovedEvents}
          description="Live approved events"
        />
      </div>

      {/* Pending Events Table */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Latest Pending Events</h2>
        <DataTable
          columns={pendingEventColumns}
          data={summary?.pendingEvents || []}
        />
      </div>
    </div>
  );
};

export default AdminDashboard
