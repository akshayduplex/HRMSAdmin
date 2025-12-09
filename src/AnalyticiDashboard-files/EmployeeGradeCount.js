import React, { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { InfinitySpin } from 'react-loader-spinner';
import { getEmployeeGradeWiseListChart } from '../employee/helper/Api_Helper';
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

const EmployeeBarChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false); // State to handle loader

    useEffect(() => {
        const fetchEmployeeGradeWiseList = async () => {
            setLoading(true); // Show loader before fetching data
            try {
                const response = await getEmployeeGradeWiseListChart();
                if (response.status) {
                    // Process the response data to format it for the chart
                    const grades = [];
                    const employeeCounts = [];
                    
                    response.data.forEach(item => {
                        grades.push(item.grade);
                        employeeCounts.push(item.employee_count);
                    });

                    // Set the chart data based on the fetched data
                    setChartData({
                        labels: grades,
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
                    console.error("Failed to fetch employee grade-wise list", response.message);
                }
            } catch (error) {
                console.error("Error fetching project budget data", error);
            } finally {
                setLoading(false); // Hide loader after data is fetched
            }
        };

        fetchEmployeeGradeWiseList(); // Call the function to fetch data when component mounts
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
                    text: 'Grade',
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
                    text: 'No. of Employees',
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
                offset:-5 // Adjusts the position of the label
            }
        }
    };

    return (
        <div>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '32vh' }}>
                    <InfinitySpin width="200" color="#871F8E" />
                </div>
            ) : (
                chartData && <Bar data={chartData} options={options} />
            )}
        </div>
    );

};

export default EmployeeBarChart;
