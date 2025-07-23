// src/pages/SaleReport.jsx
import React, { useEffect, useState } from 'react';
import RevenueChart from '../../components/Chart';
import DataTable    from '../../components/Table';
import { getSalesReport } from '../../services/eventService';

const columns = [
  { header: 'User',  accessor: 'userName' },
  { header: 'Event', accessor: 'eventTitle' },
  { header: 'Ticket No', accessor: 'ticketNumber' },
  {
    header: 'Date',
    accessor: 'bookingTime',
    render: row => new Date(row.bookingTime).toLocaleString(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
}),  // ✅ Converts UTC to local    //(row) => {
    // const date = new Date(row.bookingTime); // UTC ISO string
    // return date.toLocaleString(); // Converts to user local time
  } ,
  { header: 'Price', accessor: 'totalPrice', render: r => `$${r.totalPrice.toFixed(2)}` },
];

const SaleReport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalesReport()
      .then(setTickets)
      .finally(() => setLoading(false));
    }, []);
    
    console.log(tickets)

  if (loading) return <p className="p-8 text-center">Loading report…</p>;
    console.table(columns)
  // 1️⃣ total revenue (all events together)
  const totalRevenue = tickets.reduce((sum, t) => sum + t.totalPrice, 0);

  // 2️⃣ per-event revenue for the chart
  const perEventRevenue = Object.values(
    tickets.reduce((acc, t) => {
      acc[t.eventTitle] = acc[t.eventTitle] || { label: t.eventTitle, value: 0 };
      acc[t.eventTitle].value += t.totalPrice;
      return acc;
    }, {})
  );

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* Overall total */}
      {/* <div className='w-full max-w-4xl mx-auto p-4 space-y-6'> */}
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl">
        <div className="w-full h-48  md:h-56  ">
          <RevenueChart
            data={[{ label: 'Total Revenue', value: totalRevenue }]}
            title={`Grand Total: $${totalRevenue.toFixed(2)}`}
          />
        </div>
        <div className="w-full h-48 md:h-56">
          <RevenueChart
            data={perEventRevenue}
            title="Revenue per Event"
          />
        </div>
      </div>

      {/* Detailed table */}
      <DataTable columns={columns} data={tickets} />
      
    </div>
  );
};

export default SaleReport;