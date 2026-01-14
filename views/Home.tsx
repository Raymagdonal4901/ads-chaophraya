import React from 'react';
import { Search, ArrowRight, Anchor, Monitor, Ship } from 'lucide-react';
import { ViewState } from '../types';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/id/405/1920/1080" 
            alt="Bangkok River" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            นำทางแบรนด์ของคุณ <br/> สู่น่านน้ำกว้างใหญ่
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            พื้นที่โฆษณาระดับพรีเมียมบนเรือ ท่าเรือ และจอดิจิทัล 
            เข้าถึงผู้สัญจรและนักท่องเที่ยวนับล้านทุกวัน
          </p>

          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full max-w-2xl mx-auto flex items-center border border-white/20">
            <div className="flex-grow flex items-center px-4">
              <Search className="text-slate-300 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="ค้นหาเส้นทาง, ชื่อท่าเรือ, หรือประเภทสื่อ..." 
                className="w-full bg-transparent border-none text-white placeholder-slate-300 focus:ring-0 focus:outline-none"
              />
            </div>
            <button 
              onClick={() => onNavigate(ViewState.MAP)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-indigo-500/30 whitespace-nowrap"
            >
              สำรวจแผนที่
            </button>
          </div>
        </div>
      </section>

      {/* Media Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">คลังสเปกสื่อโฆษณาของเรา</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              เลือกรูปแบบสื่อที่มีประสิทธิภาพสูง วางตำแหน่งอย่างมียุทธศาสตร์เพื่อการมองเห็นสูงสุด
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MediaCard 
              title="สื่อโฆษณาบนเรือ" 
              description="หุ้มสติ๊กเกอร์รอบลำเรือด่วนและเรือรับส่งที่แล่นไปมาตลอดแนวแม่น้ำ"
              icon={<Ship className="w-8 h-8 text-indigo-600" />}
              image="https://picsum.photos/id/231/400/300"
              onClick={() => onNavigate(ViewState.MAP)}
            />
            <MediaCard 
              title="ป้ายโฆษณาท่าเรือ" 
              description="ป้ายนิ่งและป้ายไฟในจุดที่มีผู้คนสัญจรหนาแน่น และบริเวณที่นั่งรอเรือ"
              icon={<Anchor className="w-8 h-8 text-indigo-600" />}
              image="https://picsum.photos/id/222/400/300"
              onClick={() => onNavigate(ViewState.MAP)}
            />
            <MediaCard 
              title="จอดิจิทัล" 
              description="เครือข่าย Programmatic DOOH ภายในห้องโดยสารและจุดจำหน่ายตั๋ว"
              icon={<Monitor className="w-8 h-8 text-indigo-600" />}
              image="https://picsum.photos/id/180/400/300"
              onClick={() => onNavigate(ViewState.MAP)}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-white mb-2">พร้อมเริ่มแคมเปญของคุณหรือยัง?</h2>
            <p className="text-indigo-200">AE ของเราพร้อมช่วยคุณวางแผนเส้นทางที่คุ้มค่าที่สุด</p>
          </div>
          <button 
            onClick={() => onNavigate(ViewState.DASHBOARD)}
            className="flex items-center space-x-2 bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            <span>ติดต่อฝ่ายขาย</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

const MediaCard = ({ title, description, icon, image, onClick }: { title: string, description: string, icon: React.ReactNode, image: string, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="group bg-slate-50 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-slate-100"
  >
    <div className="h-48 overflow-hidden relative">
      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-6">
      <div className="mb-4 bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-4">{description}</p>
      <span className="text-indigo-600 font-medium flex items-center text-sm group-hover:underline">
        ดูตำแหน่ง <ArrowRight size={16} className="ml-1" />
      </span>
    </div>
  </div>
);