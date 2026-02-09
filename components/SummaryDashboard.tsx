
import React from 'react';
import { DatasetProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Layers, List, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SummaryDashboardProps {
  profile: DatasetProfile;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ profile }) => {
  const statsData = [
    { name: 'Missing', value: profile.columns.reduce((acc, col) => acc + col.missingCount, 0), color: '#ef4444' },
    { name: 'Valid', value: (profile.rowCount * profile.columnCount) - profile.columns.reduce((acc, col) => acc + col.missingCount, 0), color: '#10b981' }
  ];

  const columnCompleteness = profile.columns.slice(0, 10).map(col => ({
    name: col.name,
    completeness: Math.round(((profile.rowCount - col.missingCount) / profile.rowCount) * 100)
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Rows', value: profile.rowCount.toLocaleString(), icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Columns', value: profile.columnCount, icon: List, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Duplicates', value: profile.duplicateCount, icon: Search, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Total Issues', value: profile.columns.reduce((acc, col) => acc + col.missingCount + col.outlierCount, 0), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`${stat.bg} p-3 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            Data Completeness
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Column Completeness (%)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={columnCompleteness} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="completeness" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Column Detail Profiles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Column</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Nulls</th>
                <th className="px-6 py-4">Unique</th>
                <th className="px-6 py-4">Outliers</th>
                <th className="px-6 py-4">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profile.columns.map((col, idx) => {
                const health = Math.round(((profile.rowCount - col.missingCount - col.outlierCount) / profile.rowCount) * 100);
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{col.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">
                        {col.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{col.missingCount}</td>
                    <td className="px-6 py-4 text-slate-600">{col.uniqueCount}</td>
                    <td className="px-6 py-4 text-slate-600">{col.outlierCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${health > 90 ? 'bg-emerald-500' : health > 70 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${health}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-500">{health}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
