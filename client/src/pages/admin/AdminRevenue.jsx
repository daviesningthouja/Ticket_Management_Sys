import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import DataTable from '../../components/Table';
import { FaMoneyBillWave, FaTicketAlt } from 'react-icons/fa';
import { getAllRevenueSummary } from '../../services/revenueService';

const AdminRevenue = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30d'); // default range

  const fetchRevenue = async (timeRange) => {
    try {
      setLoading(true);
      const res = await getAllRevenueSummary(timeRange);
      setSummary(res);
    } catch (err) {
      console.error('Failed to fetch revenue summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue(range);
  }, [range]);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Revenue Dashboard</h1>

        {/* Dropdown for time range */}
        <select
          value={range}
          onChange={handleRangeChange}
          className="px-3 py-2 border rounded shadow text-sm"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="1y">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Summary Cards */}
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

      {/* Table */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Organizer-wise Revenue</h2>
        <DataTable columns={columns} data={summary?.organizerRevenues || []} />
      </div>
    </div>
  );
};

export default AdminRevenue;
