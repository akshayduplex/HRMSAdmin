import React, { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { InfinitySpin } from "react-loader-spinner"; // Assuming you're using this for a loader
import { getEmployeeByYearWiseSlotChart } from '../employee/helper/Api_Helper'; // Replace with your actual API import
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
    BarController,
);

const EmployeeAgeChart = () => {
    const [chartData, setChartData] = useState(null); // State to hold the chart data
    const [loading, setLoading] = useState(false); // State to handle loader

    const fetchAgeGroupData = async () => {
        setLoading(true); // Show loader before fetching data
        try {
            const response = await getEmployeeByYearWiseSlotChart(); // Replace with the actual API call
            if (response.status) {
                // Extract the data for charting
                const labels = response.data.map((item) => item.age_group);
                const employeeCounts = response.data.map((item) => item.total_employees);

                // Set chart data
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Employees',
                            backgroundColor: '#871F8E',
                            borderColor: '#871F8E',
                            borderWidth: 1,
                            data: employeeCounts,
                        },
                    ],
                });
            } else {
                console.error('Failed to fetch age group data', response.message);
            }
        } catch (error) {
            console.error("Error fetching age group data", error);
        } finally {
            setLoading(false); // Hide loader after data is fetched
        }
    };

    useEffect(() => {
        fetchAgeGroupData(); // Fetch data when component mounts
    }, []);

    const options = {
        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Age Group',
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
                    text: 'Employee Count',
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
                display: false,
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
            {loading ? (
                <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "32vh",
                }}
              >
                <InfinitySpin width="200" color="#871F8E" />
              </div>
            ) : (
                chartData && <Bar data={chartData} options={options} />
            )}
        </div>
    );
};

export default EmployeeAgeChart;
