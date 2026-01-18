
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="no-print bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
            <i className="fas fa-file-invoice"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Expert CV Builder</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Mid-Career Professional Edition</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <span className="flex items-center gap-1"><i className="fas fa-check-circle text-green-500"></i> ATS Compliant</span>
          <span className="flex items-center gap-1"><i className="fas fa-microchip text-indigo-500"></i> AI Powered</span>
          <span className="flex items-center gap-1"><i className="fas fa-lock text-slate-400"></i> Local & Private</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
