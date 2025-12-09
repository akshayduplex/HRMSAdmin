import React, { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { InfinitySpin } from 'react-loader-spinner';
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
import axios from 'axios';
import config from '../config/config';
import { apiHeaderToken } from '../config/api_header';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
);

const ContractClosureChart = ({ projectId }) => {

    const [apiResponseData, setData] = useState(null)
    const [loading, setLoading] = useState(false); // State to handle loader



    const fetchContractCloserChart = async (projectId) => {
        try {
            let Payloads = {
                project_id: projectId
            }
            setLoading(true);
            let response = await axios.post(`${config.API_URL}getContractCloserChart`, Payloads, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                setData(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (projectId !== '') {
            fetchContractCloserChart(projectId);
        } else {
            fetchContractCloserChart('')
        }
    }, [projectId])

    const data = {
        labels: apiResponseData ? apiResponseData?.map((item) => item.month) : [],
        datasets: [
            {
                label: 'Consultant Count',
                backgroundColor: '#30A9E2',
                borderColor: '#30A9E2',
                borderWidth: 1,
                data: apiResponseData ? apiResponseData?.map((item) => item.count) : [],
            },
        ],
    };


    const options = {

        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Month',
                    color: '#000',
                    font: {
                        weight: 'normal'
                    }
                }
            },
            y: {
                display: true,
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Count',
                    color: '#000',
                    font: {
                        weight: 'normal'
                    }
                },
                beginAtZero: true,
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
                offset: -5 // Adjusts the position of the label
            }
        }
    };

    return (
        <div>
            {
                loading ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '32vh' }}>
                        <InfinitySpin width="200" color="#871F8E" />
                    </div> :
                    <Bar data={data} options={options} />
            }
        </div>
    );

};

export default ContractClosureChart;



