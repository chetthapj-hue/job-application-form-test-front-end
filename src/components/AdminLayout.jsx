import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - hidden during print */}
      <nav className="w-64 bg-slate-900 text-white flex-col hidden md:flex print:hidden">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">
          RecruitAdmin
        </div>
        <div className="flex-1 py-6 space-y-2">
          <Link to="/admin" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/admin/departments" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors">
            <Building2 className="mr-3 h-5 w-5" />
            Departments
          </Link>
          <Link to="/admin/applicants" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors">
            <Users className="mr-3 h-5 w-5" />
            Applicants
          </Link>
        </div>
        <div className="p-6 border-t border-slate-800">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center space-x-2 bg-red-600/10 text-red-500 py-3 rounded-xl hover:bg-red-600 hover:text-white transition-all font-semibold"
           >
             <LogOut className="h-5 w-5" />
             <span>Logout</span>
           </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 md:px-12 print:hidden">
           <span className="text-xl font-bold md:hidden">RecruitAdmin</span>
           <div className="hidden md:block"></div>
           <button 
             onClick={handleLogout}
             className="md:hidden flex items-center space-x-2 text-red-500 font-semibold"
           >
             <LogOut className="h-5 w-5" />
             <span>Logout</span>
           </button>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
