import React, { useState } from 'react';

const JTable = ({ events, onAction }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setActiveDropdown(prev => (prev === id ? null : id));
  };

  const closeDropdown = () => setActiveDropdown(null);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-semibold">#</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Title</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Organizer</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-4">No pending events</td>
            </tr>
          ) : (
            events.map((event, idx) => (
              <tr key={event.id} className="hover:bg-gray-50 relative">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{event.title}</td>
                <td className="px-4 py-2">{event.organizerName || '-'}</td>
                <td className="px-4 py-2">{new Date(event.eventDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{event.status}</td>
                <td className="px-4 py-2">
                  <div className="relative inline-block">
                    <button
                      onClick={() => toggleDropdown(event.id)}
                      className="p-2 rounded hover:bg-gray-200"
                    >
                      ⋮
                    </button>
                    {activeDropdown === event.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                        <button
                          onClick={() => {
                            onAction('Approved', event.id);
                            closeDropdown();
                          }}
                          className="block w-full px-4 py-2 text-left hover:bg-green-100 text-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            onAction('Rejected', event.id);
                            closeDropdown();
                          }}
                          className="block w-full px-4 py-2 text-left hover:bg-red-100 text-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JTable;
