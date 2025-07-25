import React from 'react';
import pfp from '../assets/images.png';
import { getImageUrl } from '../services/apiConfig';

const UserCard = ({ user, onDelete }) => {
  console.log('user pfp',user.pfpUrl)
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between border rounded-lg shadow p-4 gap-4 sm:gap-6 w-full max-w-dvw bg-white">
      
      {/* Profile Section */}
      <div className="flex ml-10 mt-15 mb-20 flex-col sm:flex-row items-center gap-9 sm:gap-6 w-full sm:w-auto">
        <img
          src={user.pfpUrl == null || user.pfpUrl == "" ? pfp : getImageUrl(user.pfpUrl) }
          alt={user.name}
          className="w-28 h-28 rounded-full object-cover border"
        />

        <div className="text-center sm:text-left ml-10">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex-row sm:flex-col sm:items-end gap-4">
        {/* <button
          onClick={() => onEdit(user.id)}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Edit
        </button> */}
        <button
          onClick={() => onDelete(user.id)}
          className="px-4 py-2 ml-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
