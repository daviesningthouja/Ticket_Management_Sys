import React from 'react';
import { getImageUrl } from '../services/apiConfig';

const Card = ({ title, icon,img,alt, onClick ,value, description, className = '' }) => {
  return (
    <div className={`${className}` ?  `${className} bg-white shadow-md rounded-lg p-5 transition hover:shadow-xl`  : `bg-white shadow-md rounded-lg p-5 transition hover:shadow-xl`} onClick={onClick}>
      <div className="flex items-center gap-4 mb-4">
        {icon && <div className="text-blue-500 text-3xl">{icon}</div>}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
        {img &&  
        <img
        src={getImageUrl(img)} // fallback image if imageUrl is missing
        alt={alt}
        className="w-full h-40 object-cover rounded mb-4"
        />
        }
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
    </div>
  );
};

export default Card;
