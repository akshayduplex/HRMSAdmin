import React from 'react';
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController
);

const AppraisalChart = () => {

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun'],
        datasets: [
            {
                label: 'On Role',
                backgroundColor: '#30A9E2',
                borderColor: '#30A9E2',
                data: [0, 0, 0, 0, 0, 0],
            },
            {
                label: 'On Contract',
                backgroundColor: '#187142',
                borderColor: '#187142',
                data:[0, 0, 0, 0, 0, 0],
            }            
        ],
    };

    const options = {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Month',
                    color: '#000',
                    font: {
                        weight: 'normal',
                        
                    }
                },
                beginAtZero: true,
                grid: {
                    display: false,
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Count',
                    color: '#000',
                    font: {
                        weight: 'normal'
                    }
                },
                ticks: {
                    align: 'left', // Left align the labels
                },
                grid: {
                    display: false, // Remove horizontal grid lines
                },
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
                color: '#000',
                font: {
                    weight: 'normal',
                    size: 10
                },
                offset:-5 // Adjusts the position of the label
            }
        }


    };

    return (
        <>
            <Bar data={data} options={options} />
        </>
    );

};

export default AppraisalChart;


