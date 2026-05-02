import React, { useEffect, useState } from 'react';
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const { data } = await fetchDepartments();
    setDepartments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await updateDepartment(editingDept._id, formData);
      } else {
        await createDepartment(formData);
      }
      setIsModalOpen(false);
      setEditingDept(null);
      setFormData({ name: '', description: '' });
      loadDepartments();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving department');
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      await deleteDepartment(id);
      loadDepartments();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Department Management</h1>
        <button
          onClick={() => { setEditingDept(null); setFormData({ name: '', description: '' }); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Department
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-gray-600 uppercase text-sm font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            {departments.map((dept) => (
              <tr key={dept._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{dept.name}</td>
                <td className="px-6 py-4">{dept.description || '-'}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleEdit(dept)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 className="h-5 w-5 inline" />
                  </button>
                  <button onClick={() => handleDelete(dept._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingDept ? 'Edit Department' : 'New Department'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g. Engineering"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-24"
                  placeholder="Optional details..."
                />
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                >
                  {editingDept ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
