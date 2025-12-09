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

const ServiceBarChart = () => {

    const data = {
        labels: ['1 year', '2 years', '3 years', '4 years', '5 years'],
        datasets: [
            {
                label: 'Employees',
                backgroundColor: '#BFE7FA',
                borderColor: '#BFE7FA',
                borderWidth: 1,
                data: [490, 400, 520, 250, 300],
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Number of Employees',
                    color: '#AFAFAF',
                    font: {
                        weight: 'normal'
                    }
                },
                 beginAtZero: true,
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Years of Service',
                    color: '#AFAFAF',
                    font: {
                        weight: 'normal'
                    }
                }                
            },
        },
    };

    return (
        <>
            <Bar data={data} options={options} />
        </>
    );

};

export default ServiceBarChart;


