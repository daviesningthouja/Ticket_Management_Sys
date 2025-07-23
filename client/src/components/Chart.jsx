// src/components/RevenueChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = ({ data = [], title = 'Revenue Report' ,className={} }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Revenue ($)',
        data: data.map((d) => d.value),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      
    ],
    className:{},
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: true, text: title } },
    scales: { y: { beginAtZero: true } },
  };
/*
  return <div className="w-full h-48 md:h-56">
       <Bar data={chartData} options={options}  ClassName={`${className}` ? className : ``}/>
     </div>

*/
  return <Bar data={chartData} options={options} className={`${className}` ? className : ``}/>;
};

export default Chart;