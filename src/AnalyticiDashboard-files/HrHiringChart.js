import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Form from "react-bootstrap/Form";
import { InfinitySpin } from "react-loader-spinner";
import {
  getHrHiringJobListChart,
} from "../employee/helper/Api_Helper";
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

const HrHiringChart = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(""); // State to hold the selected project
  const [chartData, setChartData] = useState(null); // State to hold the chart data
  const [loading, setLoading] = useState(false); // State to handle loader

  const fetchHrHiringJobListChart = async (projectId) => {
    setLoading(true); // Show loader before fetching data
    try {
      const response = await getHrHiringJobListChart(projectId);
      if (response.status) {
        // Extract the data for charting
        const labels = response.data.map((item) => item.designation);
        const shortlistedPositions = response.data.map((item) => item.shortlisted);
        const interviewedPositions = response.data.map((item) => item.interviewed);
        const offeredPositions = response.data.map((item) => item.offered);

        // Set chart data
        setChartData({
          labels,
          datasets: [
            {
              label: "Shortlisted",
              backgroundColor: "#30A9E2",
              borderColor: "#30A9E2",
              data: shortlistedPositions,
            },
            {
              label: "Interviewed",
              backgroundColor: "#FFE000",
              borderColor: "#FFE000",
              data: interviewedPositions,
            },
            {
              label: "Offered",
              backgroundColor: "#00B957",
              borderColor: "#00B957",
              data: offeredPositions,
            },
          ],
        });
      } else {
        // Handle empty or no data case
        setChartData({
          labels: [], // Empty labels
          datasets: [
            {
              label: "Shortlisted",
              backgroundColor: "#30A9E2",
              borderColor: "#30A9E2",
              data: [], // Empty data
            },
            {
              label: "Interviewed",
              backgroundColor: "#FFE000",
              borderColor: "#FFE000",
              data: [], // Empty data
            },
            {
              label: "Offered",
              backgroundColor: "#00B957",
              borderColor: "#00B957",
              data: [], // Empty data
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching HR hiring job list chart data", error);
      // Handle empty or no data case
      setChartData({
        labels: [], // Empty labels
        datasets: [
          {
            label: "Shortlisted",
            backgroundColor: "#30A9E2",
            borderColor: "#30A9E2",
            data: [], // Empty data
          },
          {
            label: "Interviewed",
            backgroundColor: "#FFE000",
            borderColor: "#FFE000",
            data: [], // Empty data
          },
          {
            label: "Offered",
            backgroundColor: "#00B957",
            borderColor: "#00B957",
            data: [], // Empty data
          },
        ],
      });
    } finally {
      setLoading(false); // Hide loader after data is fetched
    }
  };

  useEffect(() => {
    fetchHrHiringJobListChart(""); // Fetch default data when component mounts
  }, []);

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId); // Update the selected project state
    fetchHrHiringJobListChart(projectId); // Fetch data based on the selected project
  };

  const options = {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Designation",
          color: "#000",
          font: {
            weight: "normal",
          },
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
          text: "Count",
          color: "#000",
          font: {
            weight: "normal",
          },
        },
        ticks: {
          align: "left", // Left align the labels
        },
        grid: {
          display: false, // Remove horizontal grid lines
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#000",
        font: {
          weight: "normal",
          size: 10,
        },
        offset: -5, // Adjusts the position of the label
      },
    },
  };

  return (
    <>
      <div className="chart_selectbx">
        <Form.Select value={selectedProject} onChange={handleProjectChange}>
          <option value="">Choose Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </Form.Select>
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

export default HrHiringChart;
