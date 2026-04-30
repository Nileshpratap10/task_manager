import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  CheckCircle, Clock, AlertCircle, Briefcase, 
  TrendingUp, ArrowUpRight, ArrowDownRight,
  FolderKanban, CheckSquare, Users
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show30DaysReport, setShow30DaysReport] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const statusData = stats?.statusStats?.map(s => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    value: s.count
  })) || [];

  const priorityData = stats?.priorityStats?.map(p => ({
    name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
    count: p.count
  })) || [];

  const activityChartData = stats?.activityStats?.map(a => {
    const date = new Date(a._id);
    return {
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      Created: a.created,
      Completed: a.completed
    };
  }) || [];

  const statCards = [
    { 
      label: 'Total Projects', 
      value: stats?.totalProjects || 0, 
      icon: Briefcase, 
      color: 'bg-blue-50 text-blue-600',
      trend: '+2 this month'
    },
    { 
      label: 'Completed Tasks', 
      value: stats?.completedTasks || 0, 
      icon: CheckCircle, 
      color: 'bg-emerald-50 text-emerald-600',
      trend: '85% completion rate'
    },
    { 
      label: 'Pending Tasks', 
      value: stats?.pendingTasks || 0, 
      icon: Clock, 
      color: 'bg-amber-50 text-amber-600',
      trend: '12 due today'
    },
    { 
      label: 'Overdue', 
      value: stats?.overdueTasks || 0, 
      icon: AlertCircle, 
      color: 'bg-red-50 text-red-600',
      trend: 'High priority'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-slate-400">Track your team's progress and performance</p>
        </div>
        <button 
          onClick={() => setShow30DaysReport(!show30DaysReport)}
          className={`flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-xl border shadow-sm transition-all ${
            show30DaysReport 
            ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
            : 'bg-white text-gray-600 border-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>Last 30 Days</span>
          <TrendingUp size={16} className={show30DaysReport ? 'text-blue-600 dark:text-blue-400' : 'text-blue-500 dark:text-blue-400'} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
              <FolderKanban size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Projects</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalProjects || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-amber-600 dark:text-amber-400">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">In Progress</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.statusDistribution?.find(s => s._id === 'in-progress')?.count || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Completed</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.statusDistribution?.find(s => s._id === 'completed')?.count || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-600 dark:text-purple-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Team Members</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">12</h3>
            </div>
          </div>
        </div>
      </div>

      {show30DaysReport && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Last 30 Days Activity</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">Tasks created vs completed</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Created</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Completed</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{fontWeight: 600}}
                />
                <Area type="monotone" dataKey="Created" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCreated)" />
                <Area type="monotone" dataKey="Completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Task Priority Distribution</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Project Status Report</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Overview of all team workspaces</p>
          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.projectStatusStats?.map(p => ({
                    name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
                    value: p.count
                  })) || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.projectStatusStats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalProjects}</span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-semibold">Projects</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {stats?.projectStatusStats?.map((p, i) => (
              <div key={i} className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium capitalize">{p._id}: </span>
                <span className="text-xs font-bold text-gray-800 dark:text-slate-200">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Task Status Breakdown</h3>
          <div className="h-80 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalTasks}</span>
              <span className="text-xs text-gray-400 dark:text-slate-500 uppercase font-semibold">Total Tasks</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {statusData.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">{s.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800 dark:text-slate-200">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
