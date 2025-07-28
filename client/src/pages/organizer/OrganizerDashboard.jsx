import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import DataTable from '../../components/Table';
import { FaCalendarCheck, FaClock, FaTicketAlt } from 'react-icons/fa';
import { getOrgDash } from '../../services/DashService';

const OrganizerDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getOrgDash();
        console.log(res);
        setSummary(res);
      } catch (error) {
        console.error('Failed to load organizer dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const recentTicketColumns = [
    { header: 'Ticket No', accessor: 'ticketNo' },
    { header: 'Event', accessor: 'eventName' },
    { header: 'User', accessor: 'userName' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Booked On', accessor: 'bookingTime' }
  ];

  if (loading) return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Organizer Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card
          title="Approved Events"
          icon={<FaCalendarCheck />}
          value={summary?.approvedEventCount}
          description="Events approved by admin"
        />
        <Card
          title="Pending Events"
          icon={<FaClock />}
          value={summary?.pendingEventCount}
          description="Events waiting for approval"
        />
        <Card
          title="Tickets Sold"
          icon={<FaTicketAlt />}
          value={summary?.totalTicketsSold}
          description="Total tickets sold"
        />
      </div>

      {/* Latest Tickets Table */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Latest Ticket Sales</h2>
        <DataTable
          columns={recentTicketColumns}
          data={summary?.recentTickets || []}
        />
      </div>
    </div>
  );
};

export default OrganizerDashboard;
