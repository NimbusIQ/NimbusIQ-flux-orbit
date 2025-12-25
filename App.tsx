
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ICPGenerator from './components/ICPGenerator';
import CreativeLoop from './components/CreativeLoop';
import VerticalCRM from './components/VerticalCRM';
import { ViewState, ICP } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [activeICP, setActiveICP] = useState<ICP | null>(null);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.ICP_GEN:
        return <ICPGenerator onSelectICP={(icp) => {
          setActiveICP(icp);
          setCurrentView(ViewState.CREATIVE_LOOP); // Auto switch to creative loop to use the context
        }} />;
      case ViewState.CREATIVE_LOOP:
        return <CreativeLoop currentICP={activeICP} />;
      case ViewState.CRM:
        return <VerticalCRM />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="md:ml-64 p-6 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Global Status Bar */}
      <div className="fixed bottom-0 right-0 p-4 bg-slate-900/90 border-t border-slate-800 backdrop-blur text-[10px] text-slate-500 w-full md:w-[calc(100%-16rem)] flex justify-between px-8 z-40 uppercase tracking-widest font-mono">
        <div>
          Pipeline Context: <span className="text-indigo-400 font-bold">{activeICP ? activeICP.role : 'GLOBAL_NULL'}</span>
        </div>
        <div>
          Nimbus Flux Engine: <span className="text-emerald-500 font-bold">OPTIMIZED</span>
        </div>
      </div>
    </div>
  );
};

export default App;
