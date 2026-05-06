
import React from 'react';
import { DatasetProfile, CleaningTask } from '../types';
import { CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Download, Activity } from 'lucide-react';

interface DataQualityReportProps {
  profile: DatasetProfile;
  tasks: CleaningTask[];
  originalRowCount: number;
}

export const DataQualityReport: React.FC<DataQualityReportProps> = ({ profile, tasks, originalRowCount }) => {
  const totalIssues = profile.columns.reduce((acc, col) => acc + col.missingCount + col.outlierCount, 0);
  const healthScore = Math.round(((profile.rowCount * profile.columnCount - totalIssues) / (profile.rowCount * profile.columnCount)) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <ShieldCheck className="w-48 h-48 text-indigo-600" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
          <div className="w-32 h-32 rounded-full border-8 border-indigo-100 flex items-center justify-center relative shrink-0">
            <svg className="w-full h-full absolute -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-indigo-600"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - healthScore / 100)}`}
              />
            </svg>
            <span className="text-3xl font-bold text-slate-900">{healthScore}%</span>
          </div>
          
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Dataset Health Report</h2>
            <p className="text-slate-500 max-w-xl text-lg mb-6">Your data has been processed and cleaned. Here's a breakdown of the improvements made to your dataset.</p>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Ready for Production
              </div>
              <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold flex items-center gap-2">
                <Activity className="w-4 h-4" /> {tasks.length} Operations Applied
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Cleaning Summary</h3>
          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map((task, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <ArrowRight className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{task.column}: {task.action.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{task.recommendation}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 italic">No cleaning actions were selected.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Key Metrics</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium">Rows (Before → After)</span>
              <span className="font-bold text-slate-900">{originalRowCount} → {profile.rowCount}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium">Column Count</span>
              <span className="font-bold text-slate-900">{profile.columnCount}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium">Remaining Null Values</span>
              <span className="font-bold text-red-600">{profile.columns.reduce((a, b) => a + b.missingCount, 0)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium">Outliers Removed/Capped</span>
              <span className="font-bold text-indigo-600">{tasks.filter(t => t.action === 'remove_outliers' || t.action === 'cap_outliers').length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button className="flex items-center gap-3 px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-2xl transition-all">
          <Download className="w-6 h-6" />
          Export Detailed PDF Report
        </button>
      </div>
    </div>
  );
};
