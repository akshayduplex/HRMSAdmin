import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PayrollDoughnut = () => {
  const data = {
    labels: ['Salary', 'Paid Time Off', 'Reimbursement', 'Overtime'],
    datasets: [
      {
        label: 'Dataset',
        data: [300, 50, 100, 80,],
        backgroundColor: [
          '#7054FF',
          '#00B957',
          '#FFBBB1',
          '#30A9E2',
        ],
        borderColor: [
          '#7054FF',
          '#00B957',
          '#FFBBB1',
          '#30A9E2',
        ],
        borderWidth: 1,
        barThickness: 30, 
      },
    ],
  };

  const options = {
    cutout: '85%',
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className='dougnt_chart_payr'>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PayrollDoughnut;
