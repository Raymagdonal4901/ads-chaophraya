import React from 'react';
import { SUCCESS_STORIES } from '../constants';
import { Download, TrendingUp, Users } from 'lucide-react';
import { MediaType } from '../types';

const MediaTypeLabel: Record<string, string> = {
  [MediaType.EXPRESS_BOAT]: 'เรือด่วน',
  [MediaType.TOURIST_BOAT]: 'เรือท่องเที่ยว',
  [MediaType.FERRY]: 'เรือข้ามฟาก',
  [MediaType.LONGTAIL_BOAT]: 'เรือหางยาว',
  [MediaType.PIER]: 'ท่าเรือ',
  [MediaType.DIGITAL_SCREEN]: 'จอดิจิทัล'
};

export const Insights: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">ข้อมูลเชิงลึก & ความสำเร็จ</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            ค้นพบว่าแบรนด์ชั้นนำใช้สื่อทางน้ำและขนส่งมวลชนสร้างผลลัพธ์ที่วัดได้อย่างไร
          </p>
        </div>

        {/* Featured Case Studies */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
             <TrendingUp className="mr-2 text-indigo-600" /> กรณีศึกษา (Case Studies)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map(story => (
              <div key={story.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-slate-100">
                <div className="h-48 overflow-hidden">
                  <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase text-indigo-600 tracking-wider">{story.client}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{MediaTypeLabel[story.type]}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{story.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{story.description}</p>
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <span className="block text-xs text-indigo-500 font-semibold uppercase">ผลลัพธ์</span>
                    <span className="text-lg font-bold text-indigo-700">{story.metric}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Resources Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">คลังสเปกสื่อโฆษณา (Media Specs)</h2>
              <p className="text-slate-500">ดาวน์โหลดคู่มือทางเทคนิคสำหรับการผลิตชิ้นงาน</p>
            </div>
            <button className="mt-4 md:mt-0 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center">
              <Download size={16} className="mr-2" /> ดาวน์โหลดสเปกทั้งหมด
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {['เทมเพลตหุ้มเรือ (PDF)', 'Codecs จอดิจิทัล (MP4/H.264)', 'ขนาดป้ายไฟท่าเรือ (AI)', 'คู่มือวัสดุ (PDF)'].map((item, idx) => (
               <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                  <span className="text-slate-700 font-medium group-hover:text-indigo-600">{item}</span>
                  <Download size={18} className="text-slate-400 group-hover:text-indigo-600" />
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};