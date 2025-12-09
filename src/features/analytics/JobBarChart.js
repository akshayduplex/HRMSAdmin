import React from 'react';
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController
);

const JobBarChart = () => {

    const data = {
        labels: ['level 1', 'level 2', 'level 3', 'level 4', 'level 5'],
        datasets: [
            {
                label: 'Employees',
                backgroundColor: '#BFE7FA',
                borderColor: '#BFE7FA',
                borderWidth: 1,
                data: [400, 200, 520, 150, 100],
            },
        ],
    };


    const options = {
        
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Grade',
                    color: '#AFAFAF',
                    font: {
                        weight: 'normal'
                    }
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Employees',
                    color: '#AFAFAF',
                    font: {
                        weight: 'normal'
                    }
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    );

};

export default JobBarChart;
