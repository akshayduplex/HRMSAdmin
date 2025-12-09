import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const PayrollBars = () => {
    const data = {
      labels: ['Jan 2024', 'Feb 2024', 'March 2024', 'April 2024'],
      datasets: [
        {
          label: 'Salary',
          data: [65000, 59000, 80000, 81000, 56000, 55000, 40000],
          backgroundColor: 'rgb(48, 169, 226)',
          barThickness: 30, 
        },
        {
          label: 'Other',
          data: [28800, 48887, 40000, 19000, 86000, 27000, 90000],
          backgroundColor: 'rgb(21, 86, 116)',
          barThickness: 30, 
        }
        
      ],
    };
  
    const options = {
      plugins: {
        title: {
          display: false,
          text: 'Stacked Bar Chart',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          display: true,
          position: 'right',
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
          ticks: {
            padding: 0
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value / 1000 + 'k'; // Add 'k' to the y-axis values
            }
          }
        },
      },
    };
  
    return <Bar data={data} options={options} />;
  };
  
  export default PayrollBars;
  
  
