import React, { useEffect, useState } from 'react';
import { fetchApplicantStats } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Clock, Search, CheckCircle, XCircle } from 'lucide-react';

const COLORS = {
  Pending: '#94a3b8',
  Reviewing: '#60a5fa',
  Interviewing: '#a855f7',
  Accepted: '#22c55e',
  Rejected: '#ef4444',
};

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, stats: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const { data } = await fetchApplicantStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  const getStatusCount = (status) => {
    const found = stats.stats.find(s => s._id === status);
    return found ? found.count : 0;
  };

  const chartData = stats.stats.map(s => ({
    name: s._id,
    count: s.count,
    color: COLORS[s._id] || '#cbd5e1'
  }));

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Total" value={stats.total} icon={<Users className="text-gray-500" />} color="bg-gray-100" />
        <StatCard title="Pending" value={getStatusCount('Pending')} icon={<Clock className="text-slate-500" />} color="bg-slate-100" />
        <StatCard title="Reviewing" value={getStatusCount('Reviewing')} icon={<Search className="text-blue-500" />} color="bg-blue-100" />
        <StatCard title="Accepted" value={getStatusCount('Accepted')} icon={<CheckCircle className="text-green-500" />} color="bg-green-100" />
        <StatCard title="Rejected" value={getStatusCount('Rejected')} icon={<XCircle className="text-red-500" />} color="bg-red-100" />
      </div>

      {/* Charts */}
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-6">Applicants by Status</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;
