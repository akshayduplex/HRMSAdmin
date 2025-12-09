import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Form from "react-bootstrap/Form";
import { InfinitySpin } from "react-loader-spinner";
import {
  getProjectWiseVacancyChart,
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

const ProjectVacancyChart = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(""); // State to hold the selected project
  const [chartData, setChartData] = useState(null); // State to hold the chart data
  const [loading, setLoading] = useState(false); // State to handle loader

  const fetchProjectWiseVacancyChart = async (projectId , employeeType) => {
    setLoading(true); // Show loader before fetching data
    try {
      const response = await getProjectWiseVacancyChart(projectId , employeeType);
      if (response.status) {
        // Extract the data for charting
        const labels = response.data.map((item) => item.designation);
        const sanctionedPositions = response.data.map(
          (item) => item.no_of_positions
        );
        const availablePositions = response.data.map(
          (item) => item.available_vacancy
        );
        const hiredPositions = response.data.map((item) => item.hired);

        // Set chart data
        setChartData({
          labels,
          datasets: [
            {
              label: "Sanctioned Positions",
              backgroundColor: "#30a8e2",
              borderColor: "#30a8e2",
              data: sanctionedPositions,
            },
            {
              label: "Vacant",
              backgroundColor: "#fe2200",
              borderColor: "#fe2200",
              data: availablePositions,
            },
            {
              label: "In Place",
              backgroundColor: "#02b957",
              borderColor: "#02b957",
              data: hiredPositions,
            },
          ],
        });
      } else {
        // Set chart data
        setChartData({
          labels: [], // Empty labels
          datasets: [
            {
              label: "Sanctioned Positions",
              backgroundColor: "#30a8e2",
              borderColor: "#30a8e2",
              data: [],
            },
            {
              label: "Vacant",
              backgroundColor: "#fe2200",
              borderColor: "#fe2200",
              data: [],
            },
            {
              label: "In Place",
              backgroundColor: "#02b957",
              borderColor: "#02b957",
              data: [],
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching project budget data", error);
      setChartData({
        labels: [], // Empty labels
        datasets: [
          {
            label: "Sanctioned Positions",
            backgroundColor: "#30a8e2",
            borderColor: "#30a8e2",
            data: [],
          },
          {
            label: "Vacant",
            backgroundColor: "#fe2200",
            borderColor: "#fe2200",
            data: [],
          },
          {
            label: "In Place",
            backgroundColor: "#02b957",
            borderColor: "#02b957",
            data: [],
          },
        ],
      });
    } finally {
      setLoading(false); // Hide loader after data is fetched
    }
  };

  useEffect(() => {
    fetchProjectWiseVacancyChart(""); // Fetch default data when component mounts
  }, []);

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId); // Update the selected project state
    fetchProjectWiseVacancyChart(projectId); // Fetch data based on the selected project
  };

  const handleEmployeeTypeChange = (e) => {
    const employeeType = e.target.value;
    fetchProjectWiseVacancyChart(selectedProject , employeeType )
  }

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
      <div className="chart_selectbx d-flex">
        <Form.Select value={selectedProject} onChange={handleProjectChange}>
          <option value="">Choose Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </Form.Select>
        <Form.Label style={{ marginRight: '10px', minWidth: '150px' , textAlign:'center', marginTop:'10px' }}>Employee Type</Form.Label>
        <Form.Select as="select" defaultValue="Select Type" onChange={handleEmployeeTypeChange}>
          <option>Choose...</option>
          <option value="onRole">onRole</option>
          <option value="onContract">onConsultant</option>
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

export default ProjectVacancyChart;
