
import React from 'react';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Users, Database } from 'lucide-react';

export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-slate-950 text-white pb-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600 rounded-full blur-[120px]"></div>
        </div>
        
        <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">DataSanitizer Pro</span>
          </div>
          <button onClick={onStart} className="bg-white text-slate-950 px-6 py-2 rounded-full font-semibold hover:bg-slate-100 transition-all">
            Open App
          </button>
        </header>

        <div className="container mx-auto px-4 pt-20 pb-16 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <span className="bg-indigo-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">New</span>
            <span className="text-sm font-medium text-slate-300">Gemini-Powered Smart Cleaning is here</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight max-w-5xl mx-auto leading-[1.1]">
            Turn Messy Datasets into <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">Production-Ready Intelligence</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            DataSanitizer Pro automatically profiles, cleans, and improves your data quality using intelligent AI recommendations. No code, just clean data.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-500/20"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-lg border border-slate-700 transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl">
            <img 
              src="https://picsum.photos/seed/dataclean/1200/600" 
              alt="Dashboard Preview" 
              className="rounded-2xl opacity-80"
            />
          </div>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Data Engineering Features</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Our platform handles the heavy lifting of data preprocessing so you can focus on building models and gaining insights.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Intelligent Profiling', desc: 'Detect missing values, duplicates, and outliers using advanced statistical methods.', icon: BarChart3 },
              { title: 'AI Recommendations', desc: 'Get context-aware cleaning strategies powered by Gemini Large Language Models.', icon: Zap },
              { title: 'Standardization', desc: 'Automatically normalize categorical values, date formats, and numeric types.', icon: CheckCircle },
              { title: 'High Performance', desc: 'Processes datasets with millions of rows in seconds directly in your browser.', icon: Database },
              { title: 'Team Collaboration', desc: 'Share cleaning reports and datasets with your team via secured links.', icon: Users },
              { title: 'Privacy First', desc: 'Your data stays in the browser. We don\'t store your datasets on our servers.', icon: Shield }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all group">
                <div className="bg-slate-50 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 group-hover:bg-indigo-50 transition-colors">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold">DataSanitizer Pro</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 DataSanitizer Pro. Built for modern data teams.</p>
        </div>
      </footer>
    </div>
  );
};
