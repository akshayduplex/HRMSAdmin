import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { InfinitySpin } from 'react-loader-spinner';
import { getEmployeeByTerminationChart } from '../employee/helper/Api_Helper';
// Register the necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const TerminationProjectChart = ({projectId}) => {
    const [loading, setLoading] = useState(false); // State to handle loader
    const [chartData, setChartData] = useState({ labels: [], datasets: [] }); // State for chart data

    useEffect(() => {
        const fetchProjectBudgetChart = async () => {
            setLoading(true); // Show loader before fetching data
            try {
                const response = await getEmployeeByTerminationChart(projectId);

                if (response && response.status) {
                    const apiData = response.data[0]; // Assuming response.data is an array with one object

                    // Map API data to chart labels and datasets
                    const labels = ['Terminated', 'Resigned' , 'Contract Closer' , 'Project Closer' ,  'Retired'];
                    const data = [
                        apiData.terminated || 0,
                        apiData.resigned || 0,
                        apiData.contract_closer || 0,
                        apiData.project_closer || 0,
                        apiData.retired || 0
                    ];
                    
                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Employee Termination Status',
                                data: data,
                                backgroundColor: ['#30a8e2', '#fddb02', '#34209b' , ' #871f8e' , '#02b957'],
                                hoverBackgroundColor:  ['#30a8e2', '#fddb02', '#34209b' , ' #871f8e' , '#02b957'],
                                borderWidth: 1,
                            },
                        ],
                    });
                } else {
                    setChartData({
                        labels: ['Terminated', 'Resigned' , 'Contract Closer' , 'Project Closer' ,  'Retired'],
                        datasets: [
                            {
                                label: 'Employee Termination Status',
                                data: [0, 0, 0 , 0 , 0],
                                backgroundColor: ['#30a8e2', '#fddb02', '#34209b' , ' #871f8e' , '#02b957'],
                                hoverBackgroundColor:  ['#30a8e2', '#fddb02', '#34209b' , ' #871f8e' , '#02b957'],
                                borderWidth: 1,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Error fetching project termination data", error);
            } finally {
                setLoading(false); // Hide loader after data is fetched
            }
        };

        fetchProjectBudgetChart(); // Call the function to fetch data when the component mounts
    }, [projectId]);

  

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right', // Position of the legend
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw;
                    },
                },
            },
            datalabels: {
                font: {
                    size: 22, // Increase the font size of the data labels
                    weight: 'bold', // Make the data labels bold
                },
            }
        },
    };

    // return <Doughnut data={data} options={options}  width={300} height={300} />;
    return   <>
    {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '32vh' }}>
            <InfinitySpin width="200" color="#871F8E" />
        </div>
    ) : (
        <Doughnut data={chartData} options={options} width={300} height={300} />
    )}
</>
};

export default TerminationProjectChart;
