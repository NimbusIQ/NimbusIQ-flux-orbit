import React, { useState } from 'react';
import { generateICPProfile } from '../services/geminiService';
import { ICP } from '../types';
import { Sparkles, Loader2, CheckCircle2, User, Building, Target, Briefcase } from 'lucide-react';

interface ICPGeneratorProps {
  onSelectICP: (icp: ICP) => void;
}

const ICPGenerator: React.FC<ICPGeneratorProps> = ({ onSelectICP }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ICP | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const icp = await generateICPProfile(description);
      setResult(icp);
    } catch (e) {
      alert("Failed to generate ICP. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleUse = () => {
    if (result) {
      onSelectICP(result);
      alert(`ICP "${result.role}" set as context for Creative Loops.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Prism Identity Engine</h1>
        <p className="text-slate-400">Define your vertical, and let the AI crystallize your Ideal Customer Profile.</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-1 shadow-2xl">
        <div className="bg-slate-900 rounded-xl p-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Vertical Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A native AI tool for architectural drafting that automates compliance checks for residential blueprints..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[120px] transition-all"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !description}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Synthesizing...' : 'Generate Profile'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <User className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{result.role}</h2>
                <p className="text-sm text-slate-400">@{result.companySize} Companies</p>
              </div>
            </div>
            <button
              onClick={handleUse}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Use Context
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-400 mb-3 uppercase tracking-wider">
                  <Target className="w-4 h-4" /> Pain Points
                </h3>
                <ul className="space-y-2">
                  {result.painPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
                  <Briefcase className="w-4 h-4" /> Goals
                </h3>
                <ul className="space-y-2">
                  {result.goals.map((goal, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                      <span className="leading-relaxed">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
                  <Building className="w-4 h-4" /> Buying Triggers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.buyingTriggers.map((trigger, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-400/10 text-amber-300 border border-amber-400/20 rounded-full text-sm">
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {result.techStack.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-700 text-slate-200 rounded-md text-sm font-mono border border-slate-600">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Channels</h3>
                 <div className="flex flex-wrap gap-2">
                  {result.preferredChannels.map((channel, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs border border-slate-700">
                      #{channel.replace(/\s+/g, '').toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ICPGenerator;
