import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDepartments, createApplicant } from '../../services/api';
import { Upload, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const Apply = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
  });
  const [files, setFiles] = useState({
    resume: null,
    transcript: null,
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDepts = async () => {
      try {
        const { data } = await fetchDepartments();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    loadDepts();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'File size should be less than 5MB' });
      return;
    }
    setFiles({ ...files, [e.target.name]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (files.resume) data.append('resume', files.resume);
    if (files.transcript) data.append('transcript', files.transcript);

    try {
      await createApplicant(data);
      setStatus({ type: 'success', message: 'Application submitted successfully!' });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', department: '' });
      setFiles({ resume: null, transcript: null });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Error submitting application. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (status.type === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-2xl shadow-xl border">
          <div className="flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Success!</h2>
          <p className="text-gray-600">{status.message}</p>
          <button 
            onClick={() => setStatus({ type: '', message: '' })} 
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link 
        to="/admin/login" 
        className="absolute top-6 right-6 flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all font-semibold"
      >
        <ShieldCheck className="h-5 w-5" />
        <span>Admin</span>
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Work With Us</h1>
          <p className="mt-4 text-lg text-gray-600">Complete the form below to apply for a position.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg border space-y-8">
          {status.type === 'error' && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-3" />
              <span>{status.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Select a department</option>
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Resume (PDF)</label>
                <div className="relative group">
                  <input
                    type="file"
                    name="resume"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-4 flex items-center space-x-4 transition-all ${files.resume ? 'border-green-400 bg-green-50' : 'border-gray-200 group-hover:border-indigo-400'}`}>
                    <Upload className={`h-6 w-6 ${files.resume ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-sm truncate">{files.resume ? files.resume.name : 'Click to upload resume'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Transcript</label>
                <div className="relative group">
                  <input
                    type="file"
                    name="transcript"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-4 flex items-center space-x-4 transition-all ${files.transcript ? 'border-green-400 bg-green-50' : 'border-gray-200 group-hover:border-indigo-400'}`}>
                    <Upload className={`h-6 w-6 ${files.transcript ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-sm truncate">{files.transcript ? files.transcript.name : 'Click to upload transcript'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Submitting Application...' : 'Apply Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Apply;
