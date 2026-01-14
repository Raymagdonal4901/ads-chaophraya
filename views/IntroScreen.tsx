import React, { useEffect, useState } from 'react';
import { MousePointer2 } from 'lucide-react';

interface IntroScreenProps {
  onEnter: () => void;
}

const WALLPAPER_IMAGES = [
  'https://images.unsplash.com/photo-1552960562-daf630e927bc?w=800&q=80', // Colorful abstract
  'https://images.unsplash.com/photo-1542202229-7d93c33f5d07?w=800&q=80', // Forest/Nature
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80', // Neon City
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', // Abstract Fluid
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80', // Landscape
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80', // Vaporwave
  'https://picsum.photos/id/237/800/600',
  'https://picsum.photos/id/10/800/600',
  'https://picsum.photos/id/20/800/600',
];

// Component to simulate a single Ad Screen (TV or Lightbox)
const AdScreen = ({ type, delay }: { type: 'TV' | 'BOX', delay: number }) => {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    // Random interval for fast switching (0.5s to 2s)
    const intervalTime = Math.random() * 1500 + 500;
    
    const timer = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % WALLPAPER_IMAGES.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const isTV = type === 'TV';
  
  return (
    <div 
      className={`relative overflow-hidden transition-all duration-300 shadow-lg border border-white/50 ${isTV ? 'aspect-video rounded-lg' : 'aspect-[2/3] rounded-md'} bg-slate-200`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Screen Content */}
      <img 
        src={WALLPAPER_IMAGES[currentImg]} 
        className="w-full h-full object-cover transition-opacity duration-300"
        alt="ad-simulation"
      />
      
      {/* Glitch/Scanline overlay for realism */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50 mix-blend-overlay"></div>
    </div>
  );
};

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  // Generate a grid of screens
  const screens = Array(24).fill(null).map((_, i) => ({
    id: i,
    type: Math.random() > 0.6 ? 'BOX' : 'TV' as 'BOX' | 'TV',
    delay: Math.random() * 2000
  }));

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden cursor-pointer bg-slate-100"
      onClick={onEnter}
    >
      {/* --- BACKGROUND SIMULATION (The "Media City") --- */}
      <div className="absolute inset-0 z-0 flex items-center justify-center scale-110">
         {/* Tilted Grid Container */}
         <div className="grid grid-cols-4 md:grid-cols-6 gap-4 w-[150%] md:w-[120%] h-[150%] opacity-90 rotate-[-12deg] translate-y-[-10%] translate-x-[-10%]">
            {screens.map((s) => (
              <div key={s.id} className="flex items-center justify-center p-2 transform transition-transform hover:scale-105 duration-700">
                 <AdScreen type={s.type} delay={s.delay} />
              </div>
            ))}
         </div>
      </div>

      {/* --- BLUR & BRIGHTNESS OVERLAY --- */}
      <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur"></div>
      
      {/* Additional gradient for bright premium feel */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/30 via-transparent to-white/70"></div>

      {/* --- FOREGROUND CONTENT (Title) --- */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 animate-fadeIn select-none">
        
        {/* Logo Group */}
        <div className="relative mb-12 transform hover:scale-105 transition-transform duration-500 group cursor-pointer">
            {/* Glow effect behind - Luxury White Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-white/60 rounded-full blur-[80px] -z-10 animate-pulse"></div>
            
            {/* Main Logo Text 'ads' - Century Gothic */}
            <div className="flex items-baseline justify-center leading-none -space-x-1 md:-space-x-2">
               {/* a */}
               <div className="text-[8rem] md:text-[14rem] font-light text-[#0ea5e9] tracking-tight drop-shadow-[0_0_30px_rgba(14,165,233,0.9)] animate-[pulse_3s_ease-in-out_infinite]" style={{ fontFamily: '"Century Gothic", Futura, sans-serif' }}>a</div>
               {/* d */}
               <div className="text-[8rem] md:text-[14rem] font-light text-[#f59e0b] tracking-tight drop-shadow-[0_0_30px_rgba(245,158,11,0.9)] animate-[pulse_4s_ease-in-out_infinite]" style={{ fontFamily: '"Century Gothic", Futura, sans-serif', animationDelay: '0.5s' }}>d</div>
               {/* s - Stylized */}
               <div className="relative text-[8rem] md:text-[14rem] font-light tracking-tight drop-shadow-[0_0_30px_rgba(236,72,153,0.9)] animate-[pulse_3.5s_ease-in-out_infinite]" style={{ fontFamily: '"Century Gothic", Futura, sans-serif', animationDelay: '1s' }}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#fcd34d] via-[#f43f5e] to-[#c026d3]">s</span>
                  
                  {/* The 'Head' of S - Three wavy lines imitating the logo */}
                  <div className="absolute top-[-15%] right-[-25%] w-[80%] h-[80%] pointer-events-none">
                     <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                        <defs>
                            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#a3e635" /> {/* Lime */}
                                <stop offset="100%" stopColor="#facc15" /> {/* Yellow */}
                            </linearGradient>
                            <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fbbf24" /> {/* Amber */}
                                <stop offset="100%" stopColor="#f472b6" /> {/* Pink */}
                            </linearGradient>
                            <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f472b6" /> {/* Pink */}
                                <stop offset="100%" stopColor="#c026d3" /> {/* Purple */}
                            </linearGradient>
                        </defs>
                        {/* Reversed direction: Right to Left, Upwards */}
                        <path d="M85 65 Q 55 45 15 25" stroke="url(#lineGrad1)" strokeWidth="5" strokeLinecap="round" className="drop-shadow-md" />
                        <path d="M75 75 Q 45 55 5 35" stroke="url(#lineGrad2)" strokeWidth="5" strokeLinecap="round" className="drop-shadow-md" />
                        <path d="M65 85 Q 35 65 -5 45" stroke="url(#lineGrad3)" strokeWidth="5" strokeLinecap="round" className="drop-shadow-md" />
                     </svg>
                  </div>

                  {/* Blinking Sparkle Effect */}
                  <div className="absolute top-6 right-6 w-4 h-4 bg-white rounded-full blur-[2px] animate-ping opacity-90"></div>
                  <div className="absolute bottom-10 left-4 w-2 h-2 bg-white rounded-full blur-[1px] animate-ping opacity-70" style={{ animationDelay: '1.5s'}}></div>
               </div>
            </div>

            {/* Subtitle - Slender, Uppercase, Spaced Out */}
            <div className="flex items-center justify-center gap-3 md:gap-5 text-xl md:text-3xl font-light tracking-[0.2em] mt-6 whitespace-nowrap uppercase">
               <span className="text-[#3b82f6] drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">Ads</span>
               <span className="text-[#22c55e] drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]">Chao</span>
               <span className="text-[#eab308] drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]">Phraya</span>
               <span className="text-[#ef4444] drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]">Co.,Ltd</span>
            </div>
            
            {/* Elegant Divider */}
            <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-slate-400 to-transparent mx-auto mt-6 opacity-40"></div>
        </div>

        {/* Click Prompt */}
        <div className="flex flex-col items-center gap-3 animate-bounce">
           <div className="px-8 py-3 bg-white/80 backdrop-blur text-slate-900 rounded-full font-light text-sm uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(255,255,255,0.6)] border border-white flex items-center gap-3 group hover:bg-white hover:scale-105 transition-all">
              <MousePointer2 size={16} className="text-indigo-500 animate-pulse" />
              Enter Experience
           </div>
        </div>

      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 p-8 z-20 opacity-30">
         <div className="w-32 h-32 border-l-2 border-t-2 border-slate-900 rounded-tl-3xl"></div>
      </div>
      <div className="absolute bottom-0 right-0 p-8 z-20 opacity-30">
         <div className="w-32 h-32 border-r-2 border-b-2 border-slate-900 rounded-br-3xl"></div>
      </div>

    </div>
  );
};