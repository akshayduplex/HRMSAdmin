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
    BarController
);

const RoleConsultantChart = ({ projectId }) => {

    const [loading, setLoading] = useState(false); // State to handle loader



    const [Designation , setDesignation] = useState(null);

    const fetchOnRoleOnContract = async (data) => {

        try {
            let payload = {
                project_id:data,
            }

            setLoading(true);
            let response = await axios.post(`${config.API_URL}getOnRoleVsContractChart` , payload , apiHeaderToken(config.API_TOKEN) )
            if(response.status === 200){
                setDesignation(response.data.data)
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error.response.data.message);
        }
    }

    useEffect(() => {
        if(projectId !== ''){
            fetchOnRoleOnContract(projectId)
        }else {
            fetchOnRoleOnContract('')
        }
    } , [projectId])



    const data = {
        labels: Designation ? Designation?.map((item) => item.designation ) : [],
        datasets: [
            {
                label: 'On Role',
                backgroundColor: '#30A9E2',
                borderColor: '#30A9E2',
                data: Designation ? Designation?.map((item) => item.onrole ) : [],
            },
            {
                label: 'On Consultant',
                backgroundColor: '#FFE000',
                borderColor: '#FFE000',
                data: Designation ? Designation?.map((item) => item.oncontract ) : [],
            },
        ],
    };

    const options = {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Designation',
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
           {
               loading ? 
               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '32vh' }}>
                  <InfinitySpin width="200" color="#871F8E" />
               </div> : 
               <Bar data={data} options={options} />
           }
        </> 
    );


};

export default RoleConsultantChart;


