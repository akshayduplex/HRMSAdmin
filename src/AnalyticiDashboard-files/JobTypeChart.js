import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { InfinitySpin } from 'react-loader-spinner';
import { getEmployeeByJobTypeChart } from '../employee/helper/Api_Helper';
// Register the necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const JobTypeChart = ({projectId}) => {
    const [loading, setLoading] = useState(false); // State to handle loader
    const [chartData, setChartData] = useState({ labels: [], datasets: [] }); // State for chart data

    useEffect(() => {
        const fetchProjectBudgetChart = async () => {
            setLoading(true); // Show loader before fetching data
            try {
                const response = await getEmployeeByJobTypeChart(projectId);

                if (response && response.status) {
                    const apiData = response.data;

                    // Map API data to chart labels and datasets
                    const labels = apiData.map(item => {
                        switch(item._id) {
                            case 'onRole': return 'On Role';
                            case 'onContract': return 'On Consultant';
                            default: return item._id;
                        }
                    });
                    const data = apiData.map(item => item.count);
                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Employee by Job Type',
                                data: data,
                                backgroundColor: ['#30A9E2', '#FFE000', '#00B957'],
                                hoverBackgroundColor: ['#30A9E2', '#FFE000', '#00B957'],
                                borderWidth: 1,
                            },
                        ],
                    });
                } else {
                    setChartData({
                        labels: [],
                        datasets: [
                            {
                                label: 'Employee by Job Type',
                                data: [],
                                backgroundColor: ['#30A9E2', '#FFE000', '#00B957'],
                                hoverBackgroundColor: ['#30A9E2', '#FFE000', '#00B957'],
                                borderWidth: 1,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Error fetching project budget data", error);
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

export default JobTypeChart;
