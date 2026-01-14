import React, { useMemo } from 'react';
import { Crown, Ship, Eye, Layers, ShieldCheck, Download, Calendar } from 'lucide-react';
import { AdSpot } from '../types';

interface AEDashboardProps {
  adSpots: AdSpot[];
}

export const AEDashboard: React.FC<AEDashboardProps> = ({ adSpots }) => {
  const stats = useMemo(() => {
    const totalImpressions = adSpots.reduce((acc, spot) => acc + spot.impressions, 0);
    return { 
      totalSpots: adSpots.length, 
      totalImpressions 
    };
  }, [adSpots]);

  return (
    <div className="bg-slate-950 min-h-screen p-6 md:p-12 font-sans pb-24 relative overflow-hidden flex items-center justify-center">
      {/* Decorative Luxury Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-amber-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-amber-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 0)', backgroundSize: '80px 80px' }}></div>
      </div>

      <div className="max-w-5xl w-full space-y-16 relative z-10">
        
        {/* Luxury Executive Header */}
        <div className="text-center space-y-6 animate-fadeIn">
            <div className="inline-flex items-center gap-4 px-8 py-3 bg-gradient-to-r from-amber-900/40 via-amber-800/20 to-transparent border-l-4 border-amber-500 text-amber-500 text-[12px] font-black uppercase tracking-[0.5em] rounded-r-full shadow-[0_0_30px_rgba(212,175,55,0.15)]">
               <Crown size={16} className="animate-pulse shadow-gold"/>
               ศูนย์บัญชาการฝ่ายบริหาร
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none italic">
               THE <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-amber-700 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">PRESTIGE</span>
            </h1>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50"></div>
              <p className="text-slate-400 font-medium text-xl tracking-widest uppercase">รายงานข้อมูลสื่อโฆษณาเชิงลึก</p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50"></div>
            </div>
        </div>

        {/* Focused KPI Display - Only Total Spots and Total Reach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Total Units KPI */}
            <div className="group relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-[4rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative p-12 bg-slate-900/80 backdrop-blur-3xl border border-amber-500/30 rounded-[3.8rem] shadow-3xl flex flex-col items-center text-center space-y-8 transition-transform duration-500 hover:scale-[1.02]">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-700 shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center border border-amber-200/40 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Layers size={42} className="text-white drop-shadow-lg" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-amber-500/70 text-[13px] font-black uppercase tracking-[0.4em]">ขนาดเครือข่ายเชิงกลยุทธ์</p>
                    <h2 className="text-8xl font-black text-white tracking-tighter italic drop-shadow-2xl">
                      {stats.totalSpots}
                    </h2>
                    <p className="text-slate-500 text-sm font-bold tracking-[0.2em] uppercase">จุดติดตั้งระดับพรีเมียม</p>
                  </div>
                  <div className="pt-8 border-t border-white/5 w-full flex items-center justify-center gap-3">
                    <ShieldCheck size={18} className="text-emerald-500"/>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รับรองมาตรฐานสากล</span>
                  </div>
               </div>
            </div>

            {/* Total Reach KPI */}
            <div className="group relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-[4rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative p-12 bg-slate-900/80 backdrop-blur-3xl border border-amber-500/30 rounded-[3.8rem] shadow-3xl flex flex-col items-center text-center space-y-8 transition-transform duration-500 hover:scale-[1.02]">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-700 shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center border border-amber-200/40 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    <Eye size={42} className="text-white drop-shadow-lg" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-amber-500/70 text-[13px] font-black uppercase tracking-[0.4em]">อัตราการเข้าถึงรวม</p>
                    <h2 className="text-7xl font-black text-white tracking-tighter italic drop-shadow-2xl">
                      {(stats.totalImpressions / 1000000).toFixed(2)}M
                    </h2>
                    <p className="text-slate-500 text-sm font-bold tracking-[0.2em] uppercase">ยอดการมองเห็นต่อเดือน</p>
                  </div>
                  <div className="pt-8 border-t border-white/5 w-full flex items-center justify-center gap-3">
                    <Ship size={18} className="text-amber-500"/>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ครอบคลุมพื้นที่ริมแม่น้ำ</span>
                  </div>
               </div>
            </div>

        </div>

        {/* Subtle Action Row */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 pt-12">
            <div className="flex items-center gap-4 text-slate-500 bg-slate-900/50 px-8 py-4 rounded-full border border-white/5 shadow-inner">
               <Calendar size={18} className="text-amber-500"/>
               <span className="text-[11px] font-black uppercase tracking-[0.3em]">รอบรายงาน: ไตรมาส 1 ปี 2568</span>
            </div>
            <button className="flex items-center gap-4 text-amber-500 group">
               <span className="text-[11px] font-black uppercase tracking-[0.3em] group-hover:text-amber-400 transition-colors">ดาวน์โหลดรายงานฉบับเต็ม</span>
               <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <Download size={20}/>
               </div>
            </button>
        </div>

      </div>
      
      {/* Decorative Gold Glowing Frame */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-amber-500/10 m-6 rounded-[5rem] shadow-[inset_0_0_100px_rgba(212,175,55,0.05)]"></div>
    </div>
  );
};