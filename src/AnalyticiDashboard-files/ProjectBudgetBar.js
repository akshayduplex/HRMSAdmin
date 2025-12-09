import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { InfinitySpin } from "react-loader-spinner";
import { getProjectBudgetChart } from "../employee/helper/Api_Helper";
import { formatCurrency } from "../employee/helper/My_Helper";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputGroup } from 'react-bootstrap';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
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

const ProjectBudgetBarChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false); // State to handle loader
  const [fromDate, setFromDate] = useState(null); // State for from_date
  const [toDate, setToDate] = useState(null); // State for to_date

  useEffect(() => {
    const fetchProjectBudgetChart = async () => {
      setLoading(true); // Show loader before fetching data
      try {
        let payload = {
          project_id: "",
          from_date: fromDate ? fromDate : "",
          to_date: toDate ? toDate : "",
        };

        const response = await getProjectBudgetChart(payload);

        if (response && response.status) {
          const labels = response.data.map((item) => item.title);

          const sanctionedData = response.data.map(
            (item) => item.project_budget.sanctioned
          );
          const utilizedData = response.data.map(
            (item) => item.project_budget.utilized
          );
          const availableData = response.data.map(
            (item) => item.project_budget.available
          );

          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Sanctioned Budget",
                backgroundColor: "#30A9E2",
                borderColor: "#30A9E2",
                data: sanctionedData,
              },
              {
                label: "Utilized Budget",
                backgroundColor: "#155674",
                borderColor: "#155674",
                data: utilizedData,
              },
              {
                label: "Available Budget",
                backgroundColor: "#00B957",
                borderColor: "#00B957",
                data: availableData,
              },
            ],
          });
        } else {
            setChartData({
                labels: [],
                datasets: [
                  {
                    label: "Sanctioned Budget",
                    backgroundColor: "#30A9E2",
                    borderColor: "#30A9E2",
                    data: [],
                  },
                  {
                    label: "Utilized Budget",
                    backgroundColor: "#155674",
                    borderColor: "#155674",
                    data: [],
                  },
                  {
                    label: "Available Budget",
                    backgroundColor: "#00B957",
                    borderColor: "#00B957",
                    data: [],
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

    fetchProjectBudgetChart(); // Call the function to fetch data when component mounts
  }, [toDate]);

  const handleDateChange = (date, type) => {
    if (type === "start") {
      setFromDate(date ? date.toISOString().split("T")[0] : null);
    } else if (type === "end") {
      setToDate(date ? date.toISOString().split("T")[0] : null);
    }
  };

  const options = {
    indexAxis: "y",
    scales: {
      x: {
        position: "top",
        display: true,
        title: {
          display: true,
          text: "Budget",
          color: "#000",
          font: {
            weight: "normal",
          },
        },
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return formatCurrency(value); // Format x-axis labels
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Projects",
          color: "#000",
          font: {
            weight: "normal",
          },
        },
        ticks: {
          align: "left",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value) => formatCurrency(value), // Format data labels on bars
        color: "#000",
        font: {
          weight: "normal",
          size: 10,
        },
        offset: -5,
      },
    },
  };
  

  return (
    <>
      <div className="calendr_wrap">
        <div className="caln_field">
          <DatePicker
            selected={fromDate ? new Date(fromDate) : null}
            onChange={(date) => handleDateChange(date, "start")}
            selectsStart
            startDate={fromDate ? new Date(fromDate) : null}
            endDate={toDate ? new Date(toDate) : null}
            dateFormat="dd-mm-yyyy"
            placeholderText="Select start date"
            className="form-control"
          />
        </div>
        <InputGroup.Text className="bg-transparent border-0 px-2">-</InputGroup.Text>
        <div className="caln_field">
          <DatePicker
            selected={toDate ? new Date(toDate) : null}
            onChange={(date) => handleDateChange(date, "end")}
            selectsEnd
            startDate={fromDate ? new Date(fromDate) : null}
            endDate={toDate ? new Date(toDate) : null}
            minDate={fromDate ? new Date(fromDate) : null}
            dateFormat="dd-mm-yyyy"
            placeholderText="Select end date"
            className="form-control"
          />
        </div>
      </div>

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
    </>
  );
};

export default ProjectBudgetBarChart;
