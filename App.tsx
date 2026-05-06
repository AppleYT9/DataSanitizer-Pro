
import React, { useState, useCallback, useMemo } from 'react';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { SummaryDashboard } from './components/SummaryDashboard';
import { CleaningPanel } from './components/CleaningPanel';
import { DataTable } from './components/DataTable';
import { DataQualityReport } from './components/DataQualityReport';
import { DatasetProfile, DataRow, CleaningTask } from './types';
import { profileDataset, applyCleaningTasks } from './services/dataService';
import { getAiCleaningRecommendations } from './services/geminiService';
import { Download, CheckCircle2, LayoutDashboard, Database, Sparkles, FileBarChart } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'upload' | 'dashboard'>('landing');
  const [data, setData] = useState<DataRow[]>([]);
  const [originalData, setOriginalData] = useState<DataRow[]>([]);
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'clean' | 'preview' | 'report'>('profile');

  const handleDataUploaded = async (parsedData: DataRow[], fileName: string, fileSize: number) => {
    setIsProcessing(true);
    try {
      setOriginalData([...parsedData]);
      setData([...parsedData]);
      const initialProfile = profileDataset(parsedData, fileName, fileSize);
      setProfile(initialProfile);
      
      // Get AI recommendations
      const recommendations = await getAiCleaningRecommendations(initialProfile, parsedData.slice(0, 15));
      setTasks(recommendations);
      
      setView('dashboard');
    } catch (error) {
      console.error("Error profiling data:", error);
      alert("Error processing file. Please ensure it's a valid CSV.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyTasks = useCallback(() => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      const activeTasks = tasks.filter(t => t.applied);
      const cleanedData = applyCleaningTasks(originalData, activeTasks, profile!);
      setData(cleanedData);
      setProfile(profileDataset(cleanedData, profile!.fileName, profile!.fileSize)); // Re-profile
      setIsProcessing(false);
      setActiveTab('preview');
    }, 1000);
  }, [originalData, tasks, profile]);

  const handleDownload = () => {
    // @ts-ignore - Papa is global from CDN
    const csv = window.Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cleaned_${profile?.fileName || 'dataset.csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('upload')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onLogoClick={() => setView('landing')} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'upload' ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Upload Your Dataset</h1>
              <p className="text-slate-600 text-lg">We support CSV files. Let's start by analyzing your data quality.</p>
            </div>
            <FileUpload onDataUploaded={handleDataUploaded} isLoading={isProcessing} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-6 h-6 text-indigo-600" />
                  {profile?.fileName}
                </h2>
                <p className="text-slate-500">
                  {profile?.rowCount.toLocaleString()} rows • {profile?.columnCount} columns
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-200"
                >
                  <Download className="w-4 h-4" />
                  Download Cleaned
                </button>
              </div>
            </div>

            <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar mb-4">
              {[
                { id: 'profile', label: 'Profiling Summary', icon: LayoutDashboard },
                { id: 'clean', label: 'AI Cleaning Panel', icon: Sparkles },
                { id: 'preview', label: 'Data Preview', icon: Database },
                { id: 'report', label: 'Quality Report', icon: FileBarChart }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-2xl">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 font-medium text-indigo-900">Processing changes...</p>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && profile && (
                <SummaryDashboard profile={profile} />
              )}
              {activeTab === 'clean' && (
                <CleaningPanel 
                  tasks={tasks} 
                  onToggleTask={(id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, applied: !t.applied } : t))}
                  onApply={handleApplyTasks}
                />
              )}
              {activeTab === 'preview' && (
                <DataTable data={data} />
              )}
              {activeTab === 'report' && profile && (
                <DataQualityReport 
                  profile={profile} 
                  tasks={tasks.filter(t => t.applied)}
                  originalRowCount={originalData.length}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
