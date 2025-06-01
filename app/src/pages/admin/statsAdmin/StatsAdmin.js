import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import './StatsAdmin.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#d72638', '#2a9d8f'];

const StatsAdmin = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };
    fetchStats();
  }, [token]);

  if (!stats) {
    return <div className="stats-dashboard"><h3>Loading statistics...</h3></div>;
  }

  return (
    <div className="stats-dashboard">
      <h2>Admin Dashboard Overview</h2>

      <div className="stats-cards">
        {Object.entries(stats.extraCounts).map(([key, value]) => (
          <div className="stat-card" key={key}>
            <h4>{key.replace(/([A-Z])/g, ' $1')}</h4>
            <p>{value}</p>
          </div>
        ))}
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h4>User Roles</h4>
          <PieChart width={300} height={250}>
            <Pie
              data={stats.userRoles}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {stats.userRoles.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>

        <div className="chart-box">
          <h4>Adoption Status</h4>
          <BarChart width={400} height={250} data={stats.adoptionStatus}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="chart-box">
          <h4>Registrations Per Day</h4>
          <BarChart width={500} height={250} data={stats.dailyActivity}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="registrations" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default StatsAdmin;
