
import React from 'react';
import { Lead } from '../types';
import { MoreHorizontal, Plus, Search, Filter, Wind } from 'lucide-react';

const mockLeads: Lead[] = [
  { id: '1', name: 'Alice Chen', company: 'TechFlow', status: 'new', vertical: 'Architecture AI', sentiment: 45 },
  { id: '2', name: 'Markus V', company: 'BuildRight', status: 'contacted', vertical: 'Architecture AI', sentiment: 60 },
  { id: '3', name: 'Sarah Jones', company: 'DesignHub', status: 'qualified', vertical: 'LegalTech AI', sentiment: 85 },
  { id: '4', name: 'David Lee', company: 'LawScale', status: 'closed', vertical: 'LegalTech AI', sentiment: 95 },
  { id: '5', name: 'Elena R', company: 'MedAssist', status: 'new', vertical: 'Health AI', sentiment: 50 },
];

const StatusColumn = ({ title, leads, color }: { title: string, leads: Lead[], color: string }) => (
  <div className="flex flex-col gap-3 min-w-[280px]">
    <div className={`flex justify-between items-center pb-2 border-b-2 ${color}`}>
      <h3 className="font-semibold text-slate-300 text-sm uppercase tracking-wide">{title}</h3>
      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">{leads.length}</span>
    </div>
    <div className="space-y-3">
      {leads.map((lead) => (
        <div key={lead.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl hover:border-slate-500 transition-colors cursor-pointer group shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-white group-hover:text-indigo-400 transition-colors">{lead.company}</h4>
            <button className="text-slate-500 hover:text-white"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
          <p className="text-sm text-slate-400 mb-3">{lead.name}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-500 border border-slate-800">{lead.vertical}</span>
            <div className={`w-2 h-2 rounded-full ${lead.sentiment > 70 ? 'bg-emerald-500' : lead.sentiment > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const VerticalCRM: React.FC = () => {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
             Nimbus Pipeline <Wind className="w-5 h-5 text-indigo-400" />
           </h1>
           <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-1">High-Velocity Flux Management</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter leads..." 
              className="bg-slate-800 border border-slate-700 pl-9 pr-4 py-2 rounded-lg text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white">
            <Filter className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-600/10">
            <Plus className="w-4 h-4" /> Inject Opportunity
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          <StatusColumn title="New Flux" leads={mockLeads.filter(l => l.status === 'new')} color="border-slate-600" />
          <StatusColumn title="Contacted" leads={mockLeads.filter(l => l.status === 'contacted')} color="border-indigo-600" />
          <StatusColumn title="Qualified" leads={mockLeads.filter(l => l.status === 'qualified')} color="border-purple-600" />
          <StatusColumn title="Closed Won" leads={mockLeads.filter(l => l.status === 'closed')} color="border-emerald-600" />
        </div>
      </div>
    </div>
  );
};

export default VerticalCRM;
