'use client';

import './globals.css';
import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Search, 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight,
  Phone,
  Mail,
  User,
  Zap
} from 'lucide-react';
import AcademicModule from '@/components/AcademicModule';
import EquipmentModule from '@/components/EquipmentModule';
import LostFoundModule from '@/components/LostFoundModule';

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'academic' | 'equipment' | 'lostfound'>('dashboard');

  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 min-h-screen flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
        
        {/* Header / Navbar */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  PeerPulse
                </span>
                <span className="text-[10px] font-black text-indigo-700 block -mt-1 tracking-wider uppercase">
                  Scaler Tech Community
                </span>
              </div>
            </div>

            {/* Back Button on Sub-Pages */}
            {activeTab !== 'dashboard' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </button>
            )}
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' ? (
            <div className="space-y-8 py-2">
              
              {/* High-Contrast Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
                
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-extrabold">
                  <GraduationCap className="w-4 h-4 text-indigo-700" /> Scaler School of Technology Portal
                </span>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight max-w-3xl mx-auto">
                  What is <span className="text-indigo-600 underline decoration-indigo-300 decoration-wavy decoration-2">PeerPulse</span>?
                </h1>

                <p className="text-slate-800 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
                  PeerPulse is the centralized campus collaboration hub designed exclusively for SST students. Resolve academic doubts, share hardware gear, and recover lost campus items all in one place.
                </p>
              </div>

              {/* 3 High-Contrast Interactive Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Academic Doubts Card */}
                <div 
                  onClick={() => setActiveTab('academic')}
                  className="group cursor-pointer rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-600 p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-indigo-100 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950 group-hover:text-indigo-600 transition-colors">
                      Academic Doubts
                    </h3>
                    <p className="text-slate-700 text-xs font-medium leading-relaxed">
                      Ask peer questions or escalate complex issues in Mathematics for Programming, ICP, and Web Development directly to mentors.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-700 font-black text-xs group-hover:translate-x-1 transition-transform">
                    Open Doubt Portal <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Hardware & Tech Share Card */}
                <div 
                  onClick={() => setActiveTab('equipment')}
                  className="group cursor-pointer rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-600 p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-emerald-100 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950 group-hover:text-emerald-600 transition-colors">
                      Hardware & Tech Share
                    </h3>
                    <p className="text-slate-700 text-xs font-medium leading-relaxed">
                      Lend or borrow microcontrollers, displays, adapters, and development hardware safely within the campus network.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-black text-xs group-hover:translate-x-1 transition-transform">
                    Explore Hardware Exchange <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Lost & Found Card */}
                <div 
                  onClick={() => setActiveTab('lostfound')}
                  className="group cursor-pointer rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-600 p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-amber-100 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950 group-hover:text-amber-600 transition-colors">
                      Campus Lost & Found
                    </h3>
                    <p className="text-slate-700 text-xs font-medium leading-relaxed">
                      Lost an item or found misplaced belongings in campus labs? Post photos and details to quickly connect with the owner.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-amber-700 font-black text-xs group-hover:translate-x-1 transition-transform">
                    View Lost & Found <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'academic' && <AcademicModule />}
              {activeTab === 'equipment' && <EquipmentModule />}
              {activeTab === 'lostfound' && <LostFoundModule />}
            </div>
          )}
          {children}
        </main>

        {/* Clean High-Contrast Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 text-slate-800 text-xs shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Made by <strong className="text-indigo-600 font-extrabold">Mithilesh Chavhan</strong></span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-800 font-bold">
              <a 
                href="mailto:chavhanmithilesh16@gmail.com" 
                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
              >
                <Mail className="w-4 h-4 text-indigo-600" /> chavhanmithilesh16@gmail.com
              </a>
              <a 
                href="tel:8261039902" 
                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
              >
                <Phone className="w-4 h-4 text-indigo-600" /> +91 8261039902
              </a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}