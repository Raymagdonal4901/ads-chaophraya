import React, { useState } from 'react';
import { SALES_KIT_PAGES, MOCK_AD_SPOTS } from '../constants';
import { 
  ChevronRight, ChevronLeft, Users, Clock, MapPin, Info, Star, AlertCircle, LifeBuoy, Ship
} from 'lucide-react';

// --- VISUAL COMPONENTS FOR MAP DIAGRAMS (Reused) ---
const MapPlaceholder = ({ type }: { type: string }) => {
  if (type === 'WANG_LANG') {
    return (
      <div className="w-full h-48 bg-blue-100 rounded-xl relative p-4 overflow-hidden border border-blue-200">
         <div className="absolute top-0 left-0 w-full h-8 bg-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-800">แม่น้ำเจ้าพระยา (Chao Phraya River)</div>
         <div className="mt-8 flex justify-between gap-2 h-full">
            <div className="w-1/4 bg-white border border-blue-200 rounded flex flex-col items-center justify-center p-2 shadow-sm">
               <span className="text-[10px] font-bold text-slate-500">โป๊ะเรือ</span>
            </div>
            <div className="w-3/4 bg-slate-50 border border-slate-200 rounded p-2 grid grid-cols-4 gap-1">
               {Array(8).fill(0).map((_,i) => (
                 <div key={i} className={`rounded text-[8px] flex items-center justify-center font-bold ${i===0 ? 'bg-rose-400 text-white col-span-1 row-span-1' : 'bg-white border border-slate-200 text-slate-400'}`}>
                    {i===0 ? 'Booth' : 'Shop'}
                 </div>
               ))}
               <div className="col-span-4 bg-amber-100 text-amber-700 text-[9px] font-bold flex items-center justify-center rounded mt-1">ทางเดิน (Walkway)</div>
            </div>
         </div>
      </div>
    );
  }
  if (type === 'PHRACHAN' || type === 'MAHARAJ') {
    return (
      <div className="w-full h-48 bg-indigo-50 rounded-xl relative p-4 overflow-hidden border border-indigo-100">
         <div className="absolute top-2 right-2"><Star className="text-yellow-400 fill-yellow-400" size={24}/></div>
         <div className="flex gap-2 h-full items-end">
            <div className="w-1/3 h-3/4 bg-white border-2 border-dashed border-indigo-200 rounded-lg flex items-center justify-center text-center p-2">
               <span className="text-[10px] text-indigo-400 font-bold">พื้นที่กิจกรรม<br/>(Activity Area)</span>
            </div>
            <div className="w-2/3 grid grid-cols-2 gap-2 h-1/2">
               <div className="bg-white rounded border border-slate-200 shadow-sm"></div>
               <div className="bg-white rounded border border-slate-200 shadow-sm"></div>
            </div>
         </div>
      </div>
    );
  }
  return (
    <div className="w-full h-48 bg-emerald-50 rounded-xl relative p-4 flex items-center justify-center border border-emerald-100">
       <div className="w-full h-12 bg-sky-200 absolute top-4 left-0 right-0 flex items-center justify-center text-[10px] text-sky-700 font-bold">คลองแสนแสบ (Canal)</div>
       <div className="mt-12 w-3/4 h-20 bg-white rounded-lg border-2 border-emerald-200 flex items-center justify-around px-4 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center text-white font-bold text-xs shadow-md">1</div>
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-xs shadow-md">2</div>
          <div className="h-1 w-full bg-slate-100 absolute -z-10"></div>
       </div>
       <div className="absolute bottom-2 text-[10px] text-emerald-600 font-bold">ท่าเรือ (Pier Platform)</div>
    </div>
  );
};

export const SalesKit: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < SALES_KIT_PAGES.length - 1) setCurrentSlide(curr => curr + 1);
  };
  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  const renderSlideContent = () => {
    const page = SALES_KIT_PAGES[currentSlide];

    if (page.type === 'COVER') {
      return (
        <div className="h-full flex flex-col relative overflow-hidden md:rounded-[3rem] shadow-none md:shadow-2xl bg-slate-900">
           <img src={page.image} className="absolute inset-0 w-full h-full object-cover opacity-80" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
           <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10 pb-24 md:pb-20 text-white">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{page.title}</h1>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-indigo-400 mb-6 md:mb-8">{page.subtitle}</h2>
              <div className="h-1 w-20 bg-rose-500 mb-6 md:mb-8"></div>
              <h3 className="text-lg md:text-xl font-bold">{page.thaiTitle}</h3>
              <p className="text-sm font-medium opacity-80">{page.thaiSubtitle}</p>
           </div>
        </div>
      );
    }

    if (page.type.startsWith('OVERVIEW')) {
      return (
        <div className="h-full flex flex-col p-6 md:p-8 bg-slate-50 md:rounded-[3rem] overflow-hidden relative">
           <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{page.title}</h2>
              <div className="h-1 w-10 bg-indigo-500 mt-3"></div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 mb-6">
              {page.images?.map((img: string, i: number) => (
                 <div key={i} className={`rounded-2xl overflow-hidden shadow-lg ${i===0 ? 'col-span-2 h-40' : 'h-32'}`}>
                    <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"/>
                 </div>
              ))}
           </div>

           <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow pb-24 md:pb-20">
              {((page.items || []) as any[]).map((item: any, i: number) => (
                 <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                       {item.icon === 'ferry' ? <LifeBuoy size={20}/> : <Ship size={20}/>}
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-800 text-sm">{typeof item === 'string' ? item : item.name}</h4>
                       {item.desc && <p className="text-[10px] text-slate-500">{item.desc}</p>}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      );
    }

    if (page.type === 'REMARKS') {
      return (
        <div className="h-full flex flex-col p-6 md:p-10 bg-slate-900 text-white md:rounded-[3rem] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 md:p-20 opacity-5"><AlertCircle size={300}/></div>
           <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-indigo-400 mb-2">{page.engTitle}</h2>
           <h3 className="text-lg md:text-xl font-bold mb-8 md:mb-10">{page.title}</h3>
           
           <div className="space-y-6 relative z-10 overflow-y-auto pr-4 custom-scrollbar pb-24">
              {(page.items as string[])?.map((item: string, i: number) => (
                 <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full border border-indigo-500 flex items-center justify-center text-[10px] flex-shrink-0 mt-1">{i+1}</div>
                    <p className="text-sm font-medium leading-relaxed text-slate-300">{item}</p>
                 </div>
              ))}
           </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col bg-white md:rounded-[3rem] overflow-hidden relative">
         <div className="h-48 md:h-48 relative flex-shrink-0">
            <img src={MOCK_AD_SPOTS.find(s => s.id.includes(page.pierId))?.imageUrl || 'https://picsum.photos/800/400'} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-6 md:left-8">
               <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{page.title}</h2>
               <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-white/80 backdrop-blur px-2 py-1 rounded w-fit mt-1">{page.engTitle}</p>
            </div>
         </div>

         <div className="flex-grow p-6 overflow-y-auto custom-scrollbar space-y-6 pb-28 md:pb-24">
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Traffic / Day</div>
                  <div className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-1"><Users size={16} className="text-indigo-500"/> {page.traffic?.toLocaleString()}</div>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Service Hours</div>
                  <div className="text-xs md:text-sm font-bold text-slate-900 flex items-center gap-1"><Clock size={16} className="text-emerald-500"/> {page.hours}</div>
               </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
               {page.desc}
            </p>

            <div className="space-y-2">
               <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest"><MapPin size={14}/> Layout Map</div>
               <MapPlaceholder type={page.mapType} />
            </div>

            <div className="space-y-3">
               {page.packages?.map((pkg: any, i: number) => (
                  <div key={i} className="bg-slate-900 text-white p-4 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer shadow-lg">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-[3rem] transition-all group-hover:w-20 group-hover:h-20"></div>
                     <div className="relative z-10 flex justify-between items-start">
                        <div>
                           <h4 className="font-bold text-sm mb-1">{pkg.name}</h4>
                           <div className="flex gap-2">
                              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">{pkg.size}</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-lg md:text-xl font-black text-emerald-400">฿{pkg.price.toLocaleString()}</div>
                           <div className="text-[9px] text-slate-400">/ วัน</div>
                        </div>
                     </div>
                     <div className="relative z-10 mt-3 pt-3 border-t border-white/10 text-[10px] text-slate-400 flex items-center gap-1">
                        <Info size={12}/> {pkg.note}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="md:p-8 min-h-screen bg-slate-100 flex items-center justify-center">
       {/* Full Screen on Mobile (h-screen, rounded-none), Fixed Box on Desktop */}
       <div className="relative h-screen md:h-[800px] w-full md:max-w-4xl bg-white md:rounded-[3rem] shadow-none md:shadow-2xl overflow-hidden border-0 md:border-[8px] border-white md:ring-1 ring-slate-200">
          
          {/* Slide Content */}
          <div className="h-full w-full">
             {renderSlideContent()}
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-6 md:bottom-8 left-0 right-0 flex justify-between items-center px-4 md:px-8 z-20 pointer-events-none">
             <button onClick={prevSlide} disabled={currentSlide === 0} className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:bg-slate-900 hover:text-white disabled:opacity-50 transition-all active:scale-95 shadow-lg">
                <ChevronLeft size={24} />
             </button>
             
             <div className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold pointer-events-auto shadow-lg">
                {currentSlide + 1} / {SALES_KIT_PAGES.length}
             </div>

             <button onClick={nextSlide} disabled={currentSlide === SALES_KIT_PAGES.length - 1} className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:bg-slate-900 hover:text-white disabled:opacity-50 transition-all active:scale-95 shadow-lg">
                <ChevronRight size={24} />
             </button>
          </div>
       </div>
    </div>
  );
};