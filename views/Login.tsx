import React, { useState, useEffect } from 'react';
import { User, UserRole, StoredUser } from '../types';
import { Ship, Lock, User as UserIcon, ArrowRight, CheckCircle, Eye, Sparkles, X, Zap, Target, MousePointer2, Crown, Key } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const storedUsersRaw = localStorage.getItem('adspacenav_users_v2');
      const storedUsers: StoredUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const foundUser = storedUsers.find(u => u.username === username && u.password === password);

      if (foundUser) {
        onLogin({ username: foundUser.username, name: foundUser.name, role: foundUser.role });
        return;
      }
    } catch (err) { console.error(err); }
    setError('Invalid authentication credentials.');
  };

  const handleGuestLogin = () => {
    onLogin({ username: 'guest', name: 'Authorized Guest', role: 'GUEST' });
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Full Screen Blurred Background */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover scale-105"
         />
         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50"></div>
         {/* Animated Grid Overlay */}
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
      </div>

      {/* 2. Centered Card Container (Half Screen / Centered) */}
      <div className="relative z-10 w-full max-w-5xl m-4 flex flex-col md:flex-row bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/40 ring-1 ring-white/50 animate-slideUp">
         
         {/* Left Side: Branding & Visuals */}
         <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-between bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white relative overflow-hidden group">
            {/* Decorative Elements */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-10 animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150"><Ship size={200}/></div>

            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                     <Ship className="text-white w-6 h-6" />
                  </div>
                  <div>
                     <h1 className="font-black text-xl tracking-tighter uppercase leading-none">ADS Chaophraya</h1>
                     <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-[0.3em]">Navigator Pro</span>
                  </div>
               </div>
               
               <div className="space-y-4 my-8">
                  <h2 className="text-4xl md:text-5xl font-black leading-[0.9] tracking-tighter uppercase">
                     Master the <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">River Flow.</span>
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                     The most advanced OOH media intelligence platform for Chao Phraya River network.
                  </p>
               </div>
            </div>

            <div className="relative z-10 flex gap-3 mt-auto">
               <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                  <Target size={12} className="text-emerald-400"/> Precision
               </div>
               <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                  <Zap size={12} className="text-amber-400"/> Speed
               </div>
            </div>
         </div>

         {/* Right Side: Login & Guest Action */}
         <div className="w-full md:w-1/2 p-10 md:p-12 bg-white flex flex-col justify-center relative">
            
            <div className="space-y-8 relative z-10">
               <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Welcome Aboard</h3>
                  <p className="text-slate-500 text-sm font-medium">Please select your access method below.</p>
               </div>

               {/* 2. Redesigned Prominent Guest Button */}
               <button 
                  onClick={handleGuestLogin}
                  className="group relative w-full py-6 rounded-3xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20"
               >
                  {/* Glowing Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 animate-gradient-x"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position_0s] duration-0 animate-shine"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-amber-950">
                     <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={24} className="animate-pulse text-white drop-shadow-md"/>
                        <span className="text-2xl font-black uppercase tracking-tight drop-shadow-sm text-white">Guest Access</span>
                        <Sparkles size={24} className="animate-pulse text-white drop-shadow-md delay-75"/>
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">Click to Explore Network</span>
                  </div>

                  {/* Sparkling particles (Simulated with simple dots) */}
                  <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                  <div className="absolute bottom-4 left-10 w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
               </button>

               <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or Staff Login</span>
                  <div className="flex-grow border-t border-slate-100"></div>
               </div>

               {/* Admin Login Toggle/Form */}
               {!showAdminLogin ? (
                  <button 
                     onClick={() => setShowAdminLogin(true)}
                     className="w-full py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                     <Lock size={16} className="group-hover/btn:text-indigo-500 transition-colors"/>
                     Staff / Admin Login
                  </button>
               ) : (
                  <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
                     <div className="space-y-1">
                        <div className="relative group">
                           <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                           <input 
                              type="text" 
                              value={username} 
                              onChange={e => setUsername(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
                              placeholder="Username" 
                              autoFocus
                           />
                        </div>
                     </div>

                     <div className="space-y-1">
                        <div className="relative group">
                           <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                           <input 
                              type="password" 
                              value={password} 
                              onChange={e => setPassword(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
                              placeholder="Password" 
                           />
                        </div>
                     </div>

                     {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-2 rounded-lg text-center animate-shake">{error}</p>}

                     <div className="flex gap-2">
                         <button 
                           type="button"
                           onClick={() => setShowAdminLogin(false)}
                           className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                        >
                           Back
                        </button>
                        <button 
                           type="submit" 
                           className="flex-grow py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 group/submit flex items-center justify-center gap-2"
                        >
                           Login
                           <ArrowRight size={16} className="group-hover/submit:translate-x-1 transition-transform"/>
                        </button>
                     </div>
                  </form>
               )}
            </div>

            {/* Decorative circles */}
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[80px] pointer-events-none opacity-50"></div>
         </div>

      </div>

      <style>{`
         @keyframes shine {
            0% { background-position: -100% 0; }
            100% { background-position: 200% 0; }
         }
         .animate-shine {
            animation: shine 3s infinite linear;
         }
         @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
         }
         .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
         }
         @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
         }
         .animate-shake {
            animation: shake 0.3s ease-in-out;
         }
      `}</style>
    </div>
  );
};