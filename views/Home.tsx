import React from 'react';
import { Search, ArrowRight, Anchor, Monitor, Ship, Clock, MapPin, Calendar, Users } from 'lucide-react';
import { ViewState, MediaType, BoatSchedule } from '../types';
import { MOCK_AD_SPOTS } from '../constants';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
}

// Helper to get all boats with schedules
const getBoatsWithSchedules = () => {
  return MOCK_AD_SPOTS.filter(spot =>
    spot.boatSchedules && spot.boatSchedules.length > 0 &&
    (spot.type === MediaType.EXPRESS_BOAT ||
      spot.type === MediaType.MINE_SMART_FERRY ||
      spot.type === MediaType.TOURIST_BOAT ||
      spot.type === MediaType.FERRY ||
      spot.type === MediaType.LONGTAIL_BOAT)
  );
};

// Get theme color based on boat flag
const getThemeColors = (themeColor: string) => {
  const colors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
    ORANGE: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', accent: 'bg-orange-500' },
    RED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500' },
    YELLOW: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', accent: 'bg-yellow-500' },
    GREEN: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500' },
    BLUE: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500' },
    PURPLE: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: 'bg-purple-500' },
    MINT: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', accent: 'bg-teal-500' },
    CYAN: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', accent: 'bg-cyan-500' },
  };
  return colors[themeColor] || colors.BLUE;
};

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
            นำทางแบรนด์ของคุณ <br /> สู่น่านน้ำกว้างใหญ่
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

      {/* Boat Schedule Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-6">
              <Ship className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">ตารางเดินเรือ</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              ข้อมูลเส้นทางและเวลาเดินเรือของเรือทุกประเภท ครอบคลุมทั้งเรือด่วน เรือไฟฟ้า และเรือท่องเที่ยว
            </p>
          </div>

          {/* Schedule Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">4</div>
              <div className="text-sm text-slate-600">ธงเรือด่วน</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="text-3xl font-bold text-teal-500 mb-2">2</div>
              <div className="text-sm text-slate-600">สาย MINE Ferry</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">1</div>
              <div className="text-sm text-slate-600">เรือท่องเที่ยว</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="text-3xl font-bold text-indigo-500 mb-2">30+</div>
              <div className="text-sm text-slate-600">ท่าเรือ</div>
            </div>
          </div>

          {/* Boat Schedule Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getBoatsWithSchedules().map((boat) => {
              const schedule = boat.boatSchedules?.[0];
              if (!schedule) return null;
              const colors = getThemeColors(schedule.themeColor);

              return (
                <div
                  key={boat.id}
                  className={`${colors.bg} rounded-2xl overflow-hidden border ${colors.border} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                  onClick={() => onNavigate(ViewState.MAP)}
                >
                  {/* Flag Badge */}
                  <div className={`${colors.accent} px-4 py-2 flex items-center justify-between`}>
                    <div className="flex items-center space-x-2">
                      <Ship className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold text-sm">
                        {schedule.boatName || boat.name}
                      </span>
                    </div>
                    <span className="text-white/80 text-xs">{boat.category}</span>
                  </div>

                  <div className="p-5">
                    {/* Service Hours */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className={`w-8 h-8 rounded-lg ${colors.accent} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                        <Clock className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <div>
                        <div className={`text-xs ${colors.text} font-medium mb-1`}>เวลาให้บริการ</div>
                        <div className="text-slate-700 text-sm whitespace-pre-line">{schedule.hours}</div>
                        {schedule.days && (
                          <div className="text-slate-500 text-xs mt-1">{schedule.days}</div>
                        )}
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className={`w-8 h-8 rounded-lg ${colors.accent} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                        <MapPin className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <div>
                        <div className={`text-xs ${colors.text} font-medium mb-1`}>เส้นทาง</div>
                        <div className="text-slate-700 text-sm whitespace-pre-line">{schedule.route}</div>
                      </div>
                    </div>

                    {/* Pier Info */}
                    {schedule.pierLabel && (
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg ${colors.accent} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                          <Anchor className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div>
                          <div className={`text-xs ${colors.text} font-medium mb-1`}>{schedule.pierLabel}</div>
                          <div className="text-slate-600 text-xs line-clamp-2">{schedule.pierList}</div>
                        </div>
                      </div>
                    )}

                    {/* Frequency Badge */}
                    {schedule.frequency && (
                      <div className={`mt-4 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                        <Calendar className="w-3 h-3 mr-1.5" />
                        {schedule.frequency}
                      </div>
                    )}

                    {/* View Details Link */}
                    <div className="mt-4 pt-4 border-t border-slate-200/50">
                      <span className={`${colors.text} font-medium flex items-center text-sm group-hover:underline`}>
                        ดูรายละเอียด <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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