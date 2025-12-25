
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, Target, RefreshCw, Layers, Zap } from 'lucide-react';

const data = [
  { name: 'Mon', engagement: 4000, feedback: 2400 },
  { name: 'Tue', engagement: 3000, feedback: 1398 },
  { name: 'Wed', engagement: 2000, feedback: 9800 },
  { name: 'Thu', engagement: 2780, feedback: 3908 },
  { name: 'Fri', engagement: 1890, feedback: 4800 },
  { name: 'Sat', engagement: 2390, feedback: 3800 },
  { name: 'Sun', engagement: 3490, feedback: 4300 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-600 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
        <ArrowUpRight className="w-3 h-3" />
        {change}
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Flux Pulse <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </h1>
          <p className="text-slate-400 mt-1 uppercase text-xs tracking-widest font-semibold">High-Velocity Pipeline Telemetry</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors text-sm shadow-lg shadow-indigo-600/20">
          Export Analytics
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Flux Channels" value="12" change="+2" icon={Layers} color="bg-indigo-500 text-indigo-500" />
        <StatCard title="ICP Crystallization" value="86%" change="+4.3%" icon={Target} color="bg-pink-500 text-pink-500" />
        <StatCard title="Echo Cycles" value="1,204" change="+12%" icon={RefreshCw} color="bg-cyan-500 text-cyan-500" />
        <StatCard title="Velocity Index" value="9.4" change="+8.1%" icon={ArrowUpRight} color="bg-emerald-500 text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Throughput Velocity</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="engagement" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="feedback" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Vertical Acceleration</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="engagement" stroke="#ec4899" strokeWidth={3} dot={{r: 4, fill: "#ec4899"}} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
