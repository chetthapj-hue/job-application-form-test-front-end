import React, { useEffect, useState } from 'react';
import { fetchApplicants, fetchDepartments, updateApplicantStatus } from '../services/api';
import { FileText, Download, Eye, Filter, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({ department: 'All', status: 'All' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadApplicants();
  }, [filters]);

  const loadInitialData = async () => {
    const { data: depts } = await fetchDepartments();
    setDepartments(depts);
    loadApplicants();
  };

  const loadApplicants = async () => {
    setLoading(true);
    const { data } = await fetchApplicants(filters);
    setApplicants(data);
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateApplicantStatus(id, newStatus);
    loadApplicants();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Interviewing': return 'bg-purple-100 text-purple-700';
      case 'Reviewing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const openFile = (path) => {
    if (!path) return;
    const url = `http://localhost:5000/${path}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Applicant Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 h-5 w-5" />
          <span className="font-medium text-gray-700">Filters:</span>
        </div>
        
        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Departments</option>
          {departments.map(d => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Documents</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-10">Loading...</td></tr>
            ) : applicants.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-500">No applicants found</td></tr>
            ) : applicants.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{app.firstName} {app.lastName}</div>
                  <div className="text-sm text-gray-500">{app.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                    {app.department?.name || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${getStatusColor(app.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button title="Resume" onClick={() => openFile(app.resume)} className={`p-1.5 rounded-md ${app.resume ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-300 cursor-not-allowed'}`}>
                      <FileText className="h-5 w-5" />
                    </button>
                    <button title="Transcript" onClick={() => openFile(app.transcript)} className={`p-1.5 rounded-md ${app.transcript ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-300 cursor-not-allowed'}`}>
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/admin/applicant/${app._id}`} className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <ChevronRight className="h-6 w-6 inline" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applicants;
