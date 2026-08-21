import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard`);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        console.log("API data:", data);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    }

    fetchData();
  }, []);

  //   Graph 1
  useEffect(() => {
    const monthlyStatistics = [
      ...(dashboardData?.statistics?.monthly || []),
    ].sort((a, b) => a.year - b.year || a.month - b.month);
    if (!lineChartRef.current || monthlyStatistics.length === 0) return;

    const chart = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: monthlyStatistics.map(({ year, month }) =>
          new Date(year, month - 1).toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
        ),
        datasets: [
          {
            label: "Leads",
            data: monthlyStatistics.map(({ count }) => count),
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.15)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Leads per Month",
            align: "start",
            font: {
              size: "20px",
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [dashboardData]);

  //   Graph 2
  useEffect(() => {
    const statusStatistics = dashboardData?.statistics?.status || [];
    if (!pieChartRef.current || statusStatistics.length === 0) return;

    const pieChart = new Chart(pieChartRef.current, {
      type: "pie",
      data: {
        labels: statusStatistics.map(({ lead_status }) => lead_status),
        datasets: [
          {
            label: "Lead Status",
            data: statusStatistics.map(({ count }) => count),
            backgroundColor: [
              "#2563eb",
              "#14b8a6",
              "#f59e0b",
              "#22c55e",
              "#ef4444",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Lead Status",
            align: "start",
            font: {
              size: 20,
            },
          },
        },
      },
    });

    return () => pieChart.destroy();
  }, [dashboardData]);

  return (
    <div className="dashboard">
      <div className="heading">
        <h1>Dashboard Overview</h1>
      </div>

      <div className="cards">
        <div className="card">
          <i className="fa-solid fa-users"></i>
          <span className="stat">
            {dashboardData?.summary?.total_leads || "-"}
          </span>
          <p>Total Leads</p>
        </div>
        <div className="card">
          <i className="fa-solid fa-user-plus"></i>
          <span className="stat">
            {dashboardData?.summary?.new_leads || "-"}
          </span>
          <p>New Leads</p>
        </div>
        <div className="card">
          <i className="fa-solid fa-calendar-day"></i>
          <span className="stat">
            {dashboardData?.summary?.total_followups || "-"}
          </span>
          <p>Follow-ups</p>
          <small>
            Today's Follow-ups : {dashboardData?.summary?.todays_followups}
          </small>
        </div>
        <div className="card">
          <i className="fa-solid fa-person-circle-check"></i>
          <span className="stat">
            {dashboardData?.summary?.converted_leads || "-"}
          </span>
          <p>Converted Leads</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart1">
          <canvas ref={lineChartRef}></canvas>
        </div>
        <div className="chart2">
          <canvas ref={pieChartRef}></canvas>
        </div>
      </div>

      <div className="recentLeadsTable">
        <h2>Today's Follow ups</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Interested Category</th>
            </tr>
          </thead>
          <tbody>
            {!dashboardData ? (
              <td colSpan={5}> Loading ...</td>
            ) : dashboardData.length != 0 ? (
              dashboardData?.followups?.today.map((item, index) => {
                return (
                  <tr key={index}>
                    <td> {item.name} </td>
                    <td> {item.company} </td>
                    <td> {item.mobile} </td>
                    <td> {item.email} </td>
                    <td> {item.category} </td>
                  </tr>
                );
              })
            ) : (
              <td colSpan={5}>There are No Follow-ups Today</td>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
