import React, { useState, useEffect } from 'react';
import { generateCreativeFeedback } from '../services/geminiService';
import { ICP, Feedback } from '../types';
import { RefreshCcw, Send, ThumbsUp, ThumbsDown, ArrowRight, Check, AlertCircle, Settings2, X, Plus, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';

interface CreativeLoopProps {
  currentICP: ICP | null;
}

const CreativeLoop: React.FC<CreativeLoopProps> = ({ currentICP }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState('copy');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  
  // Local state for editable ICP context
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [localICP, setLocalICP] = useState<ICP>({
    id: 'default',
    role: '',
    companySize: '',
    painPoints: [],
    goals: [],
    buyingTriggers: [],
    preferredChannels: [],
    techStack: []
  });

  // Sync prop to local state when it changes, but only if it's not null
  useEffect(() => {
    if (currentICP) {
      setLocalICP(currentICP);
    }
  }, [currentICP]);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const result = await generateCreativeFeedback(content, localICP, type);
      setFeedback(result);
    } catch (e) {
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const applyRevision = () => {
    if (feedback?.revisedContent) {
      setContent(feedback.revisedContent);
      setFeedback(null); // Reset feedback to start new loop
    }
  };

  // Helper for updating simple fields
  const updateField = (field: keyof ICP, value: string) => {
    setLocalICP(prev => ({ ...prev, [field]: value }));
  };

  // Helper for array inputs with Drag and Drop
  const ArrayInput = ({ label, field, placeholder }: { label: string, field: keyof ICP, placeholder: string }) => {
    const [inputValue, setInputValue] = useState('');
    const items = localICP[field] as string[];

    const handleAdd = () => {
      if (inputValue.trim()) {
        setLocalICP(prev => ({
          ...prev,
          [field]: [...(prev[field] as string[]), inputValue.trim()]
        }));
        setInputValue('');
      }
    };

    const handleRemove = (index: number) => {
      setLocalICP(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index)
      }));
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('text/plain', index.toString());
      e.dataTransfer.effectAllowed = 'move';
      // Set a slight opacity to indicate it's being moved
      e.currentTarget.classList.add('opacity-50');
    };

    const handleDragEnd = (e: React.DragEvent) => {
      e.currentTarget.classList.remove('opacity-50');
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault(); // Necessary to allow dropping
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      e.currentTarget.classList.remove('opacity-50');
      const dragIndexStr = e.dataTransfer.getData('text/plain');
      if (!dragIndexStr) return;

      const dragIndex = parseInt(dragIndexStr, 10);
      if (dragIndex === dropIndex) return;

      const newItems = [...items];
      const [reorderedItem] = newItems.splice(dragIndex, 1);
      newItems.splice(dropIndex, 0, reorderedItem);

      setLocalICP(prev => ({
        ...prev,
        [field]: newItems
      }));
    };

    return (
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={placeholder}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
          />
          <button 
            onClick={handleAdd}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <div 
              key={idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2 py-1 rounded-md text-xs text-slate-300 cursor-move hover:border-slate-500 hover:bg-slate-700 transition-all select-none"
            >
              <GripVertical className="w-3 h-3 text-slate-600" />
              <span>{item}</span>
              <button onClick={() => handleRemove(idx)} className="text-slate-500 hover:text-red-400 ml-1">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      {/* Input Section */}
      <div className={`flex flex-col gap-4 transition-all duration-500 ${feedback ? 'md:w-1/2' : 'md:w-full max-w-4xl mx-auto'}`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">Echo Loop</h1>
            <p className="text-slate-400 text-sm">Rapid creative iteration engine.</p>
          </div>
          <button 
            onClick={() => setIsContextOpen(!isContextOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm font-medium ${
              isContextOpen 
                ? 'bg-indigo-600 text-white border-indigo-500' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            {localICP.role ? localICP.role : 'Configure Context'}
            {isContextOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Context Editor */}
        {isContextOpen && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl overflow-y-auto max-h-[60vh] custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Role</label>
                <input 
                  type="text" 
                  value={localICP.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Chief Marketing Officer"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Size</label>
                <input 
                  type="text" 
                  value={localICP.companySize}
                  onChange={(e) => updateField('companySize', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Series B, Enterprise"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <ArrayInput label="Pain Points" field="painPoints" placeholder="Add a pain point..." />
              <ArrayInput label="Professional Goals" field="goals" placeholder="Add a goal..." />
              <ArrayInput label="Buying Triggers" field="buyingTriggers" placeholder="Add a trigger..." />
              <ArrayInput label="Preferred Channels" field="preferredChannels" placeholder="Add a channel..." />
              <div className="md:col-span-2">
                <ArrayInput label="Tech Stack" field="techStack" placeholder="Add technology..." />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end">
              <button 
                onClick={() => setIsContextOpen(false)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                Hide Configuration <ChevronUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Creative Input Area */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl flex-1 flex flex-col overflow-hidden shadow-xl min-h-[300px]">
          <div className="p-4 border-b border-slate-700 flex gap-4 bg-slate-900/50">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-slate-800 border-none text-sm text-slate-300 rounded-md focus:ring-0 cursor-pointer hover:text-white"
            >
              <option value="copy">Ad Copy / Email</option>
              <option value="image_prompt">Image Generation Prompt</option>
              <option value="value_prop">Value Proposition</option>
              <option value="landing_page">Landing Page Section</option>
            </select>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Paste your creative asset content here...\n\nThe AI will analyze it against:\n- Role: ${localICP.role || 'General'}\n- Pain Points: ${localICP.painPoints.length} defined\n- Goals: ${localICP.goals.length} defined`}
            className="flex-1 w-full bg-slate-900/30 p-6 text-slate-200 resize-none focus:outline-none font-mono text-sm leading-relaxed placeholder-slate-600"
          />
          <div className="p-4 bg-slate-800/80 border-t border-slate-700 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={loading || !content}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50"
            >
              {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? 'Analyzing...' : 'Run Feedback Loop'}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      {feedback && (
        <div className="md:w-1/2 flex flex-col gap-4 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Analysis Result</h2>
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
              feedback.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
              feedback.score >= 60 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
              'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              Score: {feedback.score}/100
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {/* Actionable Suggestions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Critical Feedback
              </h3>
              <ul className="space-y-3">
                {feedback.suggestions.map((sug, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300">
                    <ArrowRight className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    {sug}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-900/10 border border-emerald-500/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3 text-emerald-400 font-medium text-sm">
                  <ThumbsUp className="w-4 h-4" /> Strengths
                </div>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                  {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="bg-red-900/10 border border-red-500/10 rounded-xl p-4">
                 <div className="flex items-center gap-2 mb-3 text-red-400 font-medium text-sm">
                  <ThumbsDown className="w-4 h-4" /> Weaknesses
                </div>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                  {feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>

            {/* AI Revision */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-xl p-6 relative group">
              <div className="absolute top-4 right-4">
                <button 
                  onClick={applyRevision}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-md font-medium transition-colors flex items-center gap-2"
                >
                  <Check className="w-3 h-3" /> Use This Version
                </button>
              </div>
              <h3 className="text-sm font-semibold text-white mb-4">Optimized Version</h3>
              <div className="font-mono text-sm text-indigo-100/80 leading-relaxed whitespace-pre-wrap">
                {feedback.revisedContent}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeLoop;