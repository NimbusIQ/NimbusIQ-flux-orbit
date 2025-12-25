
import React from 'react';
import { LayoutDashboard, Users, Zap, Database, Activity, Orbit } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Pulse', icon: LayoutDashboard },
    { id: ViewState.ICP_GEN, label: 'Prism (ICP)', icon: Users },
    { id: ViewState.CREATIVE_LOOP, label: 'Echo (Creative)', icon: Zap },
    { id: ViewState.CRM, label: 'Flux (CRM)', icon: Database },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
          <Orbit className="text-white w-5 h-5 animate-spin-slow" />
        </div>
        <div className="hidden md:block">
          <h1 className="text-sm font-bold tracking-widest text-white uppercase">Nimbus Flux</h1>
          <p className="text-[10px] text-indigo-400 font-mono font-bold leading-tight">ORBIT ENGINE</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-500 font-mono hidden md:block uppercase tracking-tighter">v2.9.4-FLUX</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-400 font-medium hidden md:block">Pipeline Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
