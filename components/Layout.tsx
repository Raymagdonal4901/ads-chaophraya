import React, { useState } from 'react';
import { ViewState, User } from '../types';
import { Map, LogOut, Shield, User as UserIcon, Users, Menu, X, Ship, LayoutDashboard, Wrench, Store } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, user, onLogout, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: ViewState.MAP, label: 'Media Map', icon: <Map size={18} /> },
    { id: ViewState.EQUIPMENT, label: 'Equipment', icon: <Wrench size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Dynamic Header */}
      <header className="fixed top-0 left-0 right-0 z-[1000] px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl shadow-xl shadow-slate-200/40 border border-white/60 px-4 md:px-6 h-16 flex justify-between items-center transition-all duration-300">
            
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => onChangeView(ViewState.MAP)}
            >
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Ship className="text-white h-5 w-5" />
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-lg font-extrabold text-slate-900 leading-tight tracking-tight">ADS CHAOPHRAYA</span>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none">Navigator Pro</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex bg-slate-100/50 p-1 rounded-xl border border-slate-200/40">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                    currentView === item.id
                      ? 'text-white bg-indigo-600 shadow-md shadow-indigo-200'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right Side Tools */}
            <div className="flex items-center space-x-2">
               {/* User Info */}
               <div className="hidden md:flex items-center space-x-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
                    <span className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-tighter mt-1">
                      {user.role === 'ADMIN' ? 'Full Access' : 'Sales Member'}
                    </span>
                  </div>
                  
                  <div className="group relative">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 cursor-pointer overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all">
                        {user.role === 'ADMIN' ? <Shield size={18} /> : <UserIcon size={18} />}
                      </div>
                      
                      {/* Hidden Profile Menu */}
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                         {user.role === 'ADMIN' && (
                           <button onClick={() => onChangeView(ViewState.USER_MANAGEMENT)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-indigo-50 flex items-center">
                              <Users size={16} className="mr-2 text-indigo-500" /> Manage Users
                           </button>
                         )}
                         <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 flex items-center">
                            <LogOut size={16} className="mr-2" /> Logout
                         </button>
                      </div>
                  </div>
               </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Top Padding */}
      <main className="flex-grow pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">System Online: ADS Chaophraya v3.5</span>
          </div>
          <p className="text-[10px] font-medium tracking-tight">Internal Property of ADS Chaophraya. Unauthorized access is strictly prohibited.</p>
          <div className="flex space-x-4 text-[10px] font-bold uppercase tracking-tighter">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Service Level Agreement</a>
          </div>
        </div>
      </footer>
    </div>
  );
};