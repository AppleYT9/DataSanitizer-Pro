
import React from 'react';
import { CleaningTask } from '../types';
import { Sparkles, CheckCircle2, XCircle, Info, ChevronRight, Wand2 } from 'lucide-react';

interface CleaningPanelProps {
  tasks: CleaningTask[];
  onToggleTask: (id: string) => void;
  onApply: () => void;
}

export const CleaningPanel: React.FC<CleaningPanelProps> = ({ tasks, onToggleTask, onApply }) => {
  const categories = Array.from(new Set(tasks.map(t => t.priority)));
  
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
            AI Cleaning Recommendations
          </h3>
          <p className="text-slate-500 mt-1">Review and approve suggested data cleaning operations.</p>
        </div>
        <button 
          onClick={onApply}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
        >
          <Wand2 className="w-5 h-5" />
          Apply Selected Actions
        </button>
      </div>

      <div className="p-8 space-y-8">
        {['high', 'medium', 'low'].map(priority => {
          const priorityTasks = tasks.filter(t => t.priority === priority);
          if (priorityTasks.length === 0) return null;
          
          return (
            <div key={priority}>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
              }`}>
                {priority} Priority Fixes
                <div className="h-px flex-grow bg-slate-100" />
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priorityTasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 group ${
                      task.applied 
                        ? 'border-indigo-600 bg-indigo-50/30' 
                        : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                      task.applied ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 text-transparent group-hover:border-slate-400'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{task.column}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{task.action.replace('_', ' ')}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2 leading-snug">{task.recommendation}</p>
                      <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-3 h-3" />
                        Learn more about this transformation
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {tasks.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Dataset is already clean!</h4>
            <p className="text-slate-500">No immediate issues detected by the AI agent.</p>
          </div>
        )}
      </div>
    </div>
  );
};
