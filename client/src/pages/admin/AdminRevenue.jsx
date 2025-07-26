import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import DataTable from '../../components/Table';
import { FaMoneyBillWave, FaTicketAlt } from 'react-icons/fa';
import { getRevenueSummary } from '../../services/revenueService';

const AdminRevenue = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await getRevenueSummary();
        setSummary(res);
    
      } catch (err) {
        console.error('Failed to fetch revenue summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  console.log(summary);
  const columns = [
    { header: 'Organizer', accessor: 'organizerName' },
    { header: 'Event', accessor: 'eventName' },
    { header: 'Tickets Sold', accessor: 'ticketsSold' },
    {
      header: 'Revenue',
      accessor: 'revenue',
      render: (row) => `₹${row.revenue.toFixed(2)}`
    }
  ];

  if (loading) return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Revenue Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card
          title="Total Revenue"
          icon={<FaMoneyBillWave />}
          value={`₹${summary?.totalRevenue.toFixed(2)}`}
          description="Revenue from all organizers"
        />
        <Card
          title="Total Tickets Sold"
          icon={<FaTicketAlt />}
          value={summary?.totalTicketsSold}
          description="Tickets sold across all events"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Organizer-wise Revenue</h2>
        <DataTable columns={columns} data={summary?.organizerRevenues || []} />
      </div>
    </div>
  );
};

export default AdminRevenue
