import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AdSpot, MediaType, User, Equipment, EquipmentType, EquipmentStatus, PricingPackage, BoatSchedule } from '../types';
import {
    X, Play, Edit, SquarePen, Maximize2, Search,
    Ship, Anchor,
    MonitorPlay, LayoutGrid, Zap, TrendingUp, Target,
    Save,
    Trash2,
    Info, ChevronRight,
    Users, Expand, Plus,
    Image as ImageIcon, Upload, Video,
    Map as MapIcon, ChevronLeft, Briefcase, Palmtree, PartyPopper,
    Clock, Flag, Cloud, Home, Building2, BookOpen, DollarSign, MapPin, Navigation, LifeBuoy, Megaphone, Utensils, Plane,
    Heart, Sparkles, Car, Sailboat, MoreHorizontal
} from 'lucide-react';

declare global {
    interface Window {
        L: any;
    }
}

interface MapExplorerProps {
    adSpots: AdSpot[];
    onAddSpot: (spot: AdSpot) => void;
    onUpdateSpot: (spot: AdSpot) => void;
    onDeleteSpot: (id: string) => void;
    currentUser: User;
    equipmentList?: Equipment[];
    onUpdateEquipment?: (eq: Equipment) => void;
    focusedEquipmentId?: string | null;
}

const MediaTypeLabel = {
    [MediaType.EXPRESS_BOAT]: 'เรือด่วน',
    [MediaType.MINE_SMART_FERRY]: 'เรือไฟฟ้า',
    [MediaType.TOURIST_BOAT]: 'เรือท่องเที่ยว',
    [MediaType.FERRY]: 'เรือข้ามฟาก',
    [MediaType.LONGTAIL_BOAT]: 'เรือหางยาว',
    [MediaType.OTHER]: 'อื่นๆ',
    [MediaType.PIER]: 'ท่าเรือ',
    [MediaType.DIGITAL_SCREEN]: 'จอดิจิทัล'
};

const BOAT_TYPES = [MediaType.EXPRESS_BOAT, MediaType.MINE_SMART_FERRY, MediaType.TOURIST_BOAT, MediaType.FERRY, MediaType.LONGTAIL_BOAT, MediaType.OTHER];

// Filter Configuration
const FILTER_ITEMS = [
    {
        id: 'ALL',
        label: 'ทั้งหมด',
        subLabel: 'ALL ASSETS',
        icon: <LayoutGrid size={24} strokeWidth={2} />,
    },
    {
        id: MediaType.EXPRESS_BOAT,
        label: 'เรือด่วน',
        subLabel: 'EXPRESS',
        icon: <Ship size={24} strokeWidth={2} />,
    },
    {
        id: MediaType.MINE_SMART_FERRY,
        label: 'เรือไฟฟ้า',
        subLabel: 'MINE SMART',
        icon: <Zap size={24} strokeWidth={2} />,
    },
    {
        id: MediaType.TOURIST_BOAT,
        label: 'เรือท่องเที่ยว',
        subLabel: 'TOURIST',
        icon: <Sailboat size={24} strokeWidth={2} />,
    },
    {
        id: MediaType.FERRY,
        label: 'เรือข้ามฟาก',
        subLabel: 'FERRY',
        icon: <LifeBuoy size={24} strokeWidth={2} />,
    },
    {
        id: MediaType.LONGTAIL_BOAT,
        label: 'เรือหางยาว',
        subLabel: 'LONGTAIL',
        icon: <Navigation size={24} strokeWidth={2} />,
    },
    {
        id: MediaType.OTHER,
        label: 'อื่นๆ',
        subLabel: 'OTHER',
        icon: <MoreHorizontal size={24} strokeWidth={2} />,
    },
    {
        id: MediaType.PIER,
        label: 'ท่าเรือ',
        subLabel: 'PIER',
        icon: <Anchor size={24} strokeWidth={2} />,
    },
    {
        id: MediaType.DIGITAL_SCREEN,
        label: 'จอดิจิทัล',
        subLabel: 'DIGITAL',
        icon: <MonitorPlay size={24} strokeWidth={2} />,
    }
];

const EXPRESS_BOAT_FLAGS = [
    { id: 'ORANGE', label: 'ธงส้ม', color: 'bg-orange-500 border-orange-700 text-white' },
    { id: 'YELLOW', label: 'ธงเหลือง', color: 'bg-yellow-400 border-yellow-600 text-white' },
    { id: 'GREEN', label: 'ธงเขียว', color: 'bg-emerald-500 border-emerald-700 text-white' },
    { id: 'RED', label: 'ธงแดง', color: 'bg-red-600 border-red-800 text-white' }
];

const MINE_SMART_FLAGS = [
    { id: 'MINE_GREEN', label: 'สายสีเขียว', color: 'bg-[#00A550] border-[#007a3a] text-white' },
    { id: 'MINE_PURPLE', label: 'สายสีม่วง', color: 'bg-[#6A0DAD] border-[#4b0082] text-white' }
];

const TOURIST_FLAGS = [
    { id: 'BLUE', label: 'ธงฟ้า', color: 'bg-sky-500 border-sky-700 text-white' },
    { id: 'RED', label: 'ธงแดง', color: 'bg-red-600 border-red-800 text-white' }
];

const EQUIPMENT_STATUS_COLORS: Record<EquipmentStatus, string> = {
    [EquipmentStatus.AVAILABLE]: '#10b981',
    [EquipmentStatus.INSTALLED]: '#3b82f6',
    [EquipmentStatus.WAITING_PURCHASE]: '#a855f7',
    [EquipmentStatus.IN_REPAIR]: '#f97316',
    [EquipmentStatus.BROKEN]: '#ef4444',
    [EquipmentStatus.LOST]: '#64748b',
};

const EQUIPMENT_ICONS: Record<EquipmentType, string> = {
    [EquipmentType.TV_SCREEN]: '📺',
    [EquipmentType.ANDROID_BOX]: '🤖',
    [EquipmentType.SPLITTER]: '🔀',
    [EquipmentType.TIMER]: '⏲️',
    [EquipmentType.EQUIPMENT_BOX]: '📦',
    [EquipmentType.HDMI_CABLE]: '🔌',
    [EquipmentType.LAN_CABLE]: '🌐',
    [EquipmentType.POWER_CABLE]: '⚡',
    [EquipmentType.OTHER]: '🔧',
};

const getInterestIcon = (category: string) => {
    switch (category) {
        case 'อาหาร': return <Utensils size={18} />;
        case 'ท่องเที่ยว': return <Plane size={18} />;
        case 'ธุรกิจ': return <Briefcase size={18} />;
        case 'การเงิน': return <DollarSign size={18} />;
        case 'เทคโนโลยี': return <Zap size={18} />;
        case 'ช้อปปิ้ง': return <Megaphone size={18} />;
        case 'แฟชั่น': return <Megaphone size={18} />;
        case 'สุขภาพ': return <Heart size={18} />;
        case 'ความงาม': return <Sparkles size={18} />;
        case 'ดนตรี': return <Megaphone size={18} />;
        case 'ถ่ายภาพ': return <Megaphone size={18} />;
        case 'ครอบครัว': return <Users size={18} />;
        case 'ข่าวสาร': return <Megaphone size={18} />;
        case 'อสังหาริมทรัพย์': return <Building2 size={18} />;
        case 'รถยนต์': return <Car size={18} />;
        case 'บันเทิง': case 'ภาพยนตร์': return <MonitorPlay size={18} />;
        case 'เครื่องดื่ม': case 'กาแฟ': return <Megaphone size={18} />;
        case 'ไนท์ไลฟ์': case 'ปาร์ตี้': return <PartyPopper size={18} />;
        case 'ไลฟ์สไตล์': return <Megaphone size={18} />;
        default: return <Target size={18} />;
    }
};

// --- Helper Components ---

const FerryScheduleTable = ({ schedules, isEditing = false, onUpdate, onAdd, onDelete }: any) => {
    if (!isEditing && (!schedules || schedules.length === 0)) return null;
    return (
        <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Ship className="text-pink-600" size={20} /> ตารางเดินเรือข้ามฟาก (Ferry Service)
                </h3>
            </div>

            {schedules.map((schedule: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl border border-pink-200 shadow-sm overflow-hidden relative mb-4">
                    {isEditing && (
                        <button onClick={() => onDelete && onDelete(idx)} className="absolute top-2 right-2 p-1.5 bg-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg z-10 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    )}
                    <div className="h-1 w-full bg-pink-500"></div>
                    <div className="divide-y divide-pink-100 bg-pink-50/20">
                        <div className="flex p-4 items-center">
                            <div className="w-1/3 text-sm font-bold text-slate-500">เส้นทาง</div>
                            <div className="w-2/3 text-sm font-bold text-slate-900">
                                {isEditing ? <textarea className="w-full border rounded p-2 text-slate-900" value={schedule.route} onChange={e => onUpdate(idx, 'route', e.target.value)} /> : schedule.route}
                            </div>
                        </div>
                        <div className="flex p-4 items-center">
                            <div className="w-1/3 text-sm font-bold text-slate-500">เวลาให้บริการ</div>
                            <div className="w-2/3 text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Clock size={14} className="text-slate-400" />
                                {isEditing ? <input className="w-full border rounded p-2 text-slate-900" value={schedule.hours} onChange={e => onUpdate(idx, 'hours', e.target.value)} /> : schedule.hours}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-pink-100 border-t border-pink-100">
                            <div className="p-4 text-center">
                                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">จำนวนเรือ</div>
                                <div className="text-sm font-bold text-slate-800">
                                    {isEditing ? <input className="w-full text-center border rounded text-slate-900" value={schedule.boatCount} onChange={e => onUpdate(idx, 'boatCount', e.target.value)} /> : schedule.boatCount || '-'}
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">ผู้โดยสาร/วัน</div>
                                <div className="text-sm font-bold text-indigo-600">
                                    {isEditing ? <input className="w-full text-center border rounded text-slate-900" value={schedule.passengers} onChange={e => onUpdate(idx, 'passengers', e.target.value)} /> : schedule.passengers || '-'}
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Eyeballs/ด.</div>
                                <div className="text-sm font-bold text-emerald-600">
                                    {isEditing ? <input className="w-full text-center border rounded text-slate-900" value={schedule.eyeballs} onChange={e => onUpdate(idx, 'eyeballs', e.target.value)} /> : schedule.eyeballs || '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {isEditing && (
                <button onClick={onAdd} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-pink-500 hover:text-pink-500 hover:bg-pink-50 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} /> เพิ่มเส้นทางเดินเรือ (Add Ferry Route)
                </button>
            )}
        </div>
    );
};

const ServiceScheduleTable = ({ schedules, isEditing = false, onUpdate, onAdd, onDelete }: any) => {
    if (!isEditing && (!schedules || schedules.length === 0)) return null;
    const THEME_OPTIONS = ['BLUE', 'ORANGE', 'YELLOW', 'GREEN', 'RED', 'PURPLE', 'MINT'];

    const getTheme = (color: string) => {
        switch (color) {
            case 'ORANGE': return { header: 'bg-orange-500', divider: 'divide-orange-200', border: 'border-orange-200', bg: 'bg-gradient-to-b from-orange-50/80 to-white', pill: 'bg-white border border-orange-200 text-orange-700 shadow-sm', icon: 'text-orange-500', label: 'text-orange-900' };
            case 'YELLOW': return { header: 'bg-yellow-400', divider: 'divide-yellow-200', border: 'border-yellow-200', bg: 'bg-gradient-to-b from-yellow-50/80 to-white', pill: 'bg-white border border-yellow-200 text-yellow-700 shadow-sm', icon: 'text-yellow-500', label: 'text-yellow-900' };
            case 'GREEN': return { header: 'bg-emerald-500', divider: 'divide-emerald-200', border: 'border-emerald-200', bg: 'bg-gradient-to-b from-emerald-50/80 to-white', pill: 'bg-white border border-emerald-200 text-emerald-700 shadow-sm', icon: 'text-emerald-500', label: 'text-emerald-900' };
            case 'RED': return { header: 'bg-red-600', divider: 'divide-red-200', border: 'border-red-200', bg: 'bg-gradient-to-b from-red-50/80 to-white', pill: 'bg-white border border-red-200 text-red-700 shadow-sm', icon: 'text-red-600', label: 'text-red-900' };
            case 'PURPLE': return { header: 'bg-purple-600', divider: 'divide-purple-200', border: 'border-purple-200', bg: 'bg-gradient-to-b from-purple-50/80 to-white', pill: 'bg-white border border-purple-200 text-purple-700 shadow-sm', icon: 'text-purple-600', label: 'text-purple-900' };
            case 'MINT': return { header: 'bg-teal-400', divider: 'divide-teal-200', border: 'border-teal-200', bg: 'bg-gradient-to-b from-teal-50/80 to-white', pill: 'bg-white border border-teal-200 text-teal-700 shadow-sm', icon: 'text-teal-500', label: 'text-teal-900' };
            case 'BLUE': default: return { header: 'bg-sky-500', divider: 'divide-sky-200', border: 'border-sky-200', bg: 'bg-gradient-to-b from-sky-50/80 to-white', pill: 'bg-white border border-sky-200 text-sky-700 shadow-sm', icon: 'text-sky-500', label: 'text-sky-900' };
        }
    };

    return (
        <div className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2"><Clock className="text-indigo-600" size={20} /> ตารางการเดินเรือ</h3>
            </div>

            {schedules.map((schedule: any, idx: number) => {
                const theme = getTheme(schedule.themeColor);
                return (
                    <div key={idx} className={`rounded-2xl border ${theme.border} overflow-hidden shadow-sm relative group mb-4 ${theme.bg}`}>
                        {isEditing && (
                            <button onClick={() => onDelete && onDelete(idx)} className="absolute top-2 right-2 p-1.5 bg-white hover:bg-rose-500 hover:text-white text-rose-500 rounded-lg z-10 transition-colors shadow-sm" title="ลบตาราง">
                                <Trash2 size={16} />
                            </button>
                        )}
                        <div className={`h-2 w-full ${theme.header}`}></div>
                        <div className={`divide-y ${theme.divider}`}>
                            <div className="flex p-4 items-start">
                                <div className="w-1/3 text-sm font-bold text-slate-500 pt-2">เส้นทาง (Route)</div>
                                <div className={`w-2/3 text-sm font-bold ${theme.label}`}>
                                    {isEditing ? <textarea rows={3} className="w-full bg-white border border-slate-300 rounded-lg p-3 shadow-sm text-slate-900" value={schedule.route || ''} onChange={(e) => onUpdate(idx, 'route', e.target.value)} /> : schedule.route}
                                </div>
                            </div>
                            <div className="flex p-4 items-start">
                                <div className="w-1/3 text-sm font-bold text-slate-500 pt-2">เวลาให้บริการ</div>
                                <div className="w-2/3 text-sm font-bold text-indigo-600">
                                    {isEditing ? <textarea rows={3} className="w-full bg-white border border-slate-300 rounded-lg p-3 shadow-sm text-slate-900" value={schedule.hours || ''} onChange={(e) => onUpdate(idx, 'hours', e.target.value)} /> : schedule.hours}
                                </div>
                            </div>
                            <div className="flex p-4 items-start">
                                <div className="w-1/3 text-sm font-bold text-slate-500 pt-2">ความถี่/เที่ยว</div>
                                <div className="w-2/3 text-sm font-medium text-slate-700">
                                    {isEditing ? <input className="w-full bg-white border border-slate-300 rounded-lg p-3 shadow-sm text-slate-900" value={schedule.frequency || ''} onChange={(e) => onUpdate(idx, 'frequency', e.target.value)} /> : schedule.frequency || '-'}
                                </div>
                            </div>
                            <div className="flex p-4 items-start">
                                <div className="w-1/3 text-sm font-bold text-slate-500 pt-2">วันให้บริการ</div>
                                <div className="w-2/3 text-sm font-medium text-slate-700">
                                    {isEditing ? <input className="w-full bg-white border border-slate-300 rounded-lg p-3 shadow-sm text-slate-900" value={schedule.days || ''} onChange={(e) => onUpdate(idx, 'days', e.target.value)} /> : schedule.days}
                                </div>
                            </div>
                            {(schedule.pierList || isEditing) && (
                                <div className={`p-4 ${isEditing ? 'block' : 'flex items-start'}`}>
                                    <div className={`${isEditing ? 'w-full mb-2 flex justify-between items-center' : 'w-1/3 pt-2'} text-sm font-bold text-slate-500`}>
                                        <span>รายชื่อท่าเรือ</span>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-400 font-normal">Theme:</label>
                                                <select className="text-xs bg-white border border-slate-200 rounded p-1 text-slate-900 outline-none" value={schedule.themeColor} onChange={(e) => onUpdate(idx, 'themeColor', e.target.value)}>
                                                    {THEME_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-normal text-slate-400 block mt-1">{schedule.pierLabel}</span>
                                        )}
                                    </div>
                                    <div className={`${isEditing ? 'w-full' : 'w-2/3'}`}>
                                        {isEditing ? (
                                            <>
                                                <input className="w-full bg-white border rounded p-2 text-sm mb-2 text-slate-900 placeholder:text-slate-300" value={schedule.pierLabel || ''} onChange={(e) => onUpdate(idx, 'pierLabel', e.target.value)} placeholder="ระบุชื่อกลุ่มท่าเรือ (เช่น 10 ท่าเรือ)" />
                                                <textarea rows={5} className="w-full bg-white border border-slate-300 rounded-lg p-3 shadow-sm text-slate-900 placeholder:text-slate-300" value={schedule.pierList || ''} onChange={(e) => onUpdate(idx, 'pierList', e.target.value)} placeholder="ระบุรายชื่อท่าเรือ คั่นด้วย /" />
                                            </>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {(schedule.pierList || '').split('/').map((pier: string, i: number) => (
                                                    <span key={i} className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${theme.pill}`}>
                                                        <Anchor size={12} className={theme.icon} />
                                                        {pier.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {isEditing && (
                <button onClick={onAdd} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} /> เพิ่มตารางเดินเรือ (Add Schedule)
                </button>
            )}
        </div>
    );
};

const AdvertisingMediaTable = ({ packages, isEditing = false, onUpdate, onAdd, onDelete }: any) => {
    if (!isEditing && (!packages || packages.length === 0)) return null;
    const getRowSpan = (data: any[], index: number, key: string) => {
        if (isEditing) return 1;
        const val = data[index][key];
        if (index > 0 && data[index - 1][key] === val) return 0;
        let span = 1;
        for (let i = index + 1; i < data.length; i++) {
            if (data[i][key] === val) span++;
            else break;
        }
        return span;
    };
    return (
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white mt-8">
            <div className="bg-[#0070c0] p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="p-2 bg-white/10 rounded-lg text-white backdrop-blur-sm border border-white/10"><LayoutGrid size={20} /></div><h3 className="text-white font-bold text-lg tracking-tight">ตารางสื่อโฆษณา (Media Packages)</h3></div></div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <th className="p-4 text-xs font-black uppercase whitespace-nowrap border-r border-slate-200 min-w-[200px]">พื้นที่สื่อโฆษณา</th>
                            <th className="p-4 text-xs font-black uppercase whitespace-nowrap text-center border-r border-slate-200 min-w-[120px]">จำนวน / ขนาด</th>
                            <th className="p-4 text-xs font-black uppercase whitespace-nowrap text-center border-r border-slate-200 min-w-[180px]">วัสดุ</th>
                            <th className="p-4 text-xs font-black uppercase whitespace-nowrap text-center border-r border-slate-200 min-w-[100px]">จำนวนเรือ</th>
                            <th className="p-4 text-xs font-black uppercase whitespace-nowrap text-center border-r border-slate-200 min-w-[100px]">การรับประกัน</th>
                            <th className="p-4 text-xs font-black uppercase whitespace-nowrap text-right border-r border-slate-200 min-w-[120px]">ราคา / เดือน</th>
                            <th className="p-4 text-xs font-black uppercase whitespace-nowrap text-right min-w-[120px]">ค่าผลิต</th>
                            {isEditing && <th className="p-4 text-xs font-black uppercase whitespace-nowrap text-center w-12">จัดการ</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {packages.map((pkg: any, idx: number) => {
                            const materialSpan = getRowSpan(packages, idx, 'material');
                            const boatCountSpan = getRowSpan(packages, idx, 'boatCount');
                            const warrantySpan = getRowSpan(packages, idx, 'warranty');
                            return (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 border-r border-slate-100 align-top">{isEditing ? (<input type="text" className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-bold text-slate-900" value={pkg.name} onChange={(e) => onUpdate && onUpdate(idx, 'name', e.target.value)} placeholder="ชื่อแพ็กเกจ" />) : (<span className="text-sm font-bold text-slate-800">{pkg.name}</span>)}</td>
                                    <td className="p-4 text-center border-r border-slate-100 align-top">{isEditing ? (<input type="text" className="w-full bg-white border border-slate-200 rounded p-2 text-sm text-center font-medium text-slate-900" value={pkg.quantityLabel} onChange={(e) => onUpdate && onUpdate(idx, 'quantityLabel', e.target.value)} placeholder="-" />) : (<span className="text-sm font-medium text-slate-600">{pkg.quantityLabel}</span>)}</td>
                                    {materialSpan > 0 && (<td rowSpan={materialSpan} className="p-4 text-center border-r border-slate-100 align-top bg-white">{isEditing ? (<textarea className="w-full bg-white border border-slate-200 rounded p-2 text-sm text-left font-medium text-slate-900 resize-none h-24" value={pkg.material || ''} onChange={(e) => onUpdate && onUpdate(idx, 'material', e.target.value)} placeholder="-" />) : (<span className="text-sm font-medium text-slate-600 text-left block">{pkg.material || '-'}</span>)}</td>)}
                                    {boatCountSpan > 0 && (<td rowSpan={boatCountSpan} className="p-4 text-center border-r border-slate-100 align-top bg-white">{isEditing ? (<input type="text" className="w-full bg-white border border-slate-200 rounded p-2 text-sm text-center font-medium text-slate-900" value={pkg.boatCount || ''} onChange={(e) => onUpdate && onUpdate(idx, 'boatCount', e.target.value)} placeholder="-" />) : (<span className="text-sm font-medium text-slate-600">{pkg.boatCount || '-'}</span>)}</td>)}
                                    {warrantySpan > 0 && (<td rowSpan={warrantySpan} className="p-4 text-center border-r border-slate-100 align-top bg-white">{isEditing ? (<input type="text" className="w-full bg-white border border-slate-200 rounded p-2 text-sm text-center font-medium text-slate-900" value={pkg.warranty || ''} onChange={(e) => onUpdate && onUpdate(idx, 'warranty', e.target.value)} placeholder="-" />) : (<span className="text-sm font-medium text-slate-600">{pkg.warranty || '-'}</span>)}</td>)}
                                    <td className="p-4 text-right border-r border-slate-100 align-top">{isEditing ? (<input type="text" className="w-full bg-white border border-slate-200 rounded p-2 text-sm text-right font-bold text-indigo-700" value={pkg.pricePerMonth} onChange={(e) => onUpdate && onUpdate(idx, 'pricePerMonth', e.target.value)} placeholder="ราคา" />) : (<span className="text-sm font-bold text-indigo-600">{pkg.pricePerMonth}</span>)}</td>
                                    <td className="p-4 text-right align-top">{isEditing ? (<input type="text" className="w-full bg-white border border-slate-200 rounded p-2 text-sm text-right font-medium text-slate-900" value={pkg.productionCost} onChange={(e) => onUpdate && onUpdate(idx, 'productionCost', e.target.value)} placeholder="ค่าผลิต" />) : (<span className="text-sm font-medium text-slate-500">{pkg.productionCost}</span>)}</td>
                                    {isEditing && (<td className="p-4 text-center align-top"><button onClick={() => onDelete && onDelete(idx)} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors"><Trash2 size={16} /></button></td>)}
                                </tr>
                            );
                        })}
                    </tbody>
                    {isEditing && (<tfoot><tr><td colSpan={8} className="p-4"><button onClick={onAdd} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"><Plus size={20} /> เพิ่มรายการแพ็กเกจ (Add Package)</button></td></tr></tfoot>)}
                </table>
            </div>
        </div>
    );
};

// --- Main Component ---

export const MapExplorer: React.FC<MapExplorerProps> = ({
    adSpots, onAddSpot, onUpdateSpot, onDeleteSpot, currentUser,
    equipmentList = [], onUpdateEquipment, focusedEquipmentId
}) => {
    const [selectedSpot, setSelectedSpot] = useState<AdSpot | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [filterType, setFilterType] = useState<MediaType | 'ALL'>('ALL');
    const [boatFlagFilter, setBoatFlagFilter] = useState<string>('ALL');
    const [mapSearchQuery, setMapSearchQuery] = useState('');
    const [isSearchingMap, setIsSearchingMap] = useState(false);

    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AUDIENCE' | 'PACKAGES' | 'MARKETING'>('OVERVIEW');
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
    const [isEditingRoute, setIsEditingRoute] = useState(false);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [editForm, setEditForm] = useState<Partial<AdSpot>>({});
    const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const isAdmin = currentUser.role === 'ADMIN';
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersLayerRef = useRef<any>(null);
    const routeLayerRef = useRef<any>(null);
    const animationRefs = useRef<number[]>([]);

    // --- Handlers & Helpers ---

    const getFilterButtonStyle = (id: string, isActive: boolean) => {
        const baseStyle = "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative overflow-hidden group backdrop-blur-md border";

        let activeClass = "";
        let inactiveClass = "bg-white/10 text-white border-white/20 shadow-sm hover:scale-105";

        switch (id) {
            case MediaType.EXPRESS_BOAT:
                // เรือด่วน (Express): สีแดง (Red) - Light theme
                activeClass = "bg-red-100 text-red-700 border-red-200 ring-red-200 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
                inactiveClass += " hover:bg-red-900/30 hover:border-red-400/50";
                break;
            case MediaType.MINE_SMART_FERRY:
                // เรือไฟฟ้า (Mine Smart): สีเขียว-ขาว - Light theme
                activeClass = "bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
                inactiveClass += " hover:bg-emerald-900/30 hover:border-emerald-400/50";
                break;
            case MediaType.TOURIST_BOAT:
                // เรือท่องเที่ยว (Tourist): สีฟ้า (Sky) - Light theme
                activeClass = "bg-sky-100 text-sky-700 border-sky-200 ring-sky-200 shadow-[0_0_15px_rgba(14,165,233,0.5)]";
                inactiveClass += " hover:bg-sky-900/30 hover:border-sky-400/50";
                break;
            case MediaType.FERRY:
                // เรือข้ามฟาก (Ferry): สีชมพู (Pink) - Light theme
                activeClass = "bg-pink-100 text-pink-700 border-pink-200 ring-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.5)]";
                inactiveClass += " hover:bg-pink-900/30 hover:border-pink-400/50";
                break;
            case MediaType.LONGTAIL_BOAT:
                // เรือหางยาว (Longtail): สีน้ำตาล/เหลืองเข้ม (Amber Dark) - Light theme
                activeClass = "bg-amber-100 text-amber-800 border-amber-200 ring-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
                inactiveClass += " hover:bg-amber-900/30 hover:border-amber-400/50";
                break;
            case MediaType.PIER:
                // ท่าเรือ (Pier): สีเทา (Gray) - Light theme
                activeClass = "bg-slate-200 text-slate-700 border-slate-300 ring-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.5)]";
                inactiveClass += " hover:bg-slate-700/30 hover:border-slate-400/50";
                break;
            case MediaType.DIGITAL_SCREEN:
                // จอดิจิทัล (Digital): สีม่วง (Purple) - Light theme
                activeClass = "bg-purple-100 text-purple-700 border-purple-200 ring-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.5)]";
                inactiveClass += " hover:bg-purple-900/30 hover:border-purple-400/50";
                break;
            case MediaType.OTHER:
                activeClass = "bg-gray-100 text-gray-700 border-gray-200 ring-gray-200";
                inactiveClass += " hover:bg-gray-700/30";
                break;
            default: // ALL
                activeClass = "bg-white text-indigo-600 border-white ring-indigo-50 shadow-[0_0_20px_rgba(255,255,255,0.8)]";
                inactiveClass += " hover:bg-white/20 hover:border-white/50";
                break;
        }

        const finalStateClass = isActive
            ? `${activeClass} scale-105 z-10 ring-2`
            : inactiveClass;

        return `${baseStyle} ${finalStateClass} h-20`;
    };

    const renderSpotCard = (spot: AdSpot) => (
        <div
            key={spot.id}
            onClick={() => { setSelectedSpot(spot); setIsPanelCollapsed(false); }}
            className={`bg-white p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-lg flex gap-3 items-center group relative ${selectedSpot?.id === spot.id ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-xl z-10' : 'border-slate-200 hover:border-indigo-300'}`}
        >
            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 relative">
                <img src={spot.imageUrl} className="w-full h-full object-cover" />
                {spot.type === MediaType.DIGITAL_SCREEN && <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><MonitorPlay size={16} className="text-white" /></div>}
            </div>
            <div className="min-w-0 flex-grow">
                <h4 className="font-bold text-slate-800 text-xs truncate leading-tight group-hover:text-indigo-600 transition-colors">{spot.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{spot.type === MediaType.PIER ? 'Pier' : 'Boat'}</span>
                    {spot.availability === 'ว่าง' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                </div>
            </div>
            {isAdmin && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDeleteSpot(spot.id); }}
                    className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    );

    const groupedSpots = useMemo(() => {
        const filtered = adSpots.filter(s => {
            if (filterType !== 'ALL' && s.type !== filterType) return false;
            if (filterType === MediaType.EXPRESS_BOAT || filterType === MediaType.MINE_SMART_FERRY || filterType === MediaType.TOURIST_BOAT) {
                if (boatFlagFilter !== 'ALL' && s.boatFlag !== boatFlagFilter) return false;
            }
            return true;
        });

        return {
            boats: filtered.filter(s => [MediaType.EXPRESS_BOAT, MediaType.MINE_SMART_FERRY, MediaType.TOURIST_BOAT, MediaType.FERRY, MediaType.LONGTAIL_BOAT, MediaType.OTHER].includes(s.type)),
            piers: filtered.filter(s => s.type === MediaType.PIER),
            digital: filtered.filter(s => s.type === MediaType.DIGITAL_SCREEN)
        };
    }, [adSpots, filterType, boatFlagFilter]);

    // NEW: Search Autocomplete
    const searchResults = useMemo(() => {
        if (!mapSearchQuery.trim()) return [];
        const query = mapSearchQuery.toLowerCase();
        return adSpots.filter(spot =>
            spot.name.toLowerCase().includes(query) ||
            spot.type.toLowerCase().includes(query)
        ).slice(0, 5); // Limit to 5 results
    }, [adSpots, mapSearchQuery]);

    const handleSelectLocation = (spot: AdSpot) => {
        if (spot.lat && spot.lng && mapInstanceRef.current && window.L) {
            mapInstanceRef.current.flyTo([spot.lat, spot.lng], 16, { animate: true });
            setSelectedSpot(spot);
            setIsPanelCollapsed(false);
            setMapSearchQuery(''); // Clear search after selection
        }
    };

    const allMediaForLightbox = useMemo(() => {
        if (!selectedSpot) return [];
        const images = [selectedSpot.imageUrl, ...(selectedSpot.gallery || [])].filter(Boolean).map(url => ({ type: 'image' as const, url }));
        const videos = [selectedSpot.videoUrl, ...(selectedSpot.videoGallery || [])].filter(Boolean).map(url => ({ type: 'video' as const, url: url! }));
        return [...images, ...videos];
    }, [selectedSpot]);



    const handleSearchLocation = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!mapSearchQuery.trim()) return;

        setIsSearchingMap(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}&limit=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);

                if (mapInstanceRef.current && window.L) {
                    mapInstanceRef.current.flyTo([newLat, newLng], 15, { animate: true });
                }
            } else {
                alert('ไม่พบสถานที่นี้ ลองระบุชื่อให้ชัดเจนขึ้น');
            }
        } catch (error) {
            console.error("Search failed:", error);
            alert('เกิดข้อผิดพลาดในการค้นหา');
        } finally {
            setIsSearchingMap(false);
        }
    };

    const handleCreateNew = () => {
        const newSpot: AdSpot = {
            id: `NEW-${Date.now()}`,
            name: 'New Ad Spot',
            type: MediaType.PIER,
            lat: 13.75,
            lng: 100.50,
            pricePerDay: 0,
            dimensions: '-',
            availability: 'ว่าง',
            impressions: 0,
            imageUrl: '',
            audience: {
                monthlyTraffic: [],
                trafficBreakdown: { weekday: 0, weekend: 0, holiday: 0 },
                topInterests: []
            }
        };
        setSelectedSpot(newSpot);
        setEditForm(newSpot);
        setIsEditingDetails(true);
        setIsPanelCollapsed(false);
    };

    const handleStartEditRoute = () => {
        if (!selectedSpot) return;
        setEditForm({
            ...selectedSpot,
            route: selectedSpot.route ? [...selectedSpot.route] : []
        });
        setIsEditingRoute(true);
        // Collapse sidebar to give more map space
        setIsPanelCollapsed(true);
    };

    const handleClearRoute = () => {
        if (confirm('คุณต้องการลบเส้นทางทั้งหมดใช่หรือไม่?')) {
            setEditForm(prev => ({ ...prev, route: [] }));
        }
    };

    const handleStartEditDetails = () => {
        if (!selectedSpot) return;
        setEditForm(selectedSpot);
        setIsEditingDetails(true);
    };

    const handleSave = () => {
        if (!editForm.id) return;
        const exists = adSpots.some(s => s.id === editForm.id);
        if (exists) {
            onUpdateSpot(editForm as AdSpot);
        } else {
            onAddSpot(editForm as AdSpot);
        }
        setSelectedSpot(editForm as AdSpot);
        setIsEditingDetails(false);
        setIsEditingRoute(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                if (isMain) {
                    setEditForm(prev => ({ ...prev, imageUrl: base64 }));
                } else {
                    setEditForm(prev => ({ ...prev, gallery: [...(prev.gallery || []), base64] }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setEditForm(prev => ({ ...prev, videoGallery: [...(prev.videoGallery || []), base64] }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveMedia = (index: number, isVideo: boolean = false) => {
        if (isVideo) {
            setEditForm(prev => {
                const newGallery = [...(prev.videoGallery || [])];
                newGallery.splice(index, 1);
                return { ...prev, videoGallery: newGallery };
            });
        } else {
            setEditForm(prev => {
                const newGallery = [...(prev.gallery || [])];
                newGallery.splice(index, 1);
                return { ...prev, gallery: newGallery };
            });
        }
    };

    const handleUpdateSchedule = (index: number, field: string, value: any) => {
        const updatedSchedules = [...(editForm.boatSchedules || [])];
        (updatedSchedules[index] as any)[field] = value;
        setEditForm({ ...editForm, boatSchedules: updatedSchedules });
    };

    const handleAddSchedule = () => {
        const newSchedule: BoatSchedule = {
            themeColor: 'BLUE',
            hours: '',
            route: '',
        };
        setEditForm(prev => ({ ...prev, boatSchedules: [...(prev.boatSchedules || []), newSchedule] }));
    };

    const handleDeleteSchedule = (index: number) => {
        setEditForm(prev => {
            const updated = [...(prev.boatSchedules || [])];
            updated.splice(index, 1);
            return { ...prev, boatSchedules: updated };
        });
    };

    const handleUpdatePricingPackage = (index: number, field: string, value: any) => {
        const updatedPackages = [...(editForm.pricingPackages || [])];
        (updatedPackages[index] as any)[field] = value;
        setEditForm({ ...editForm, pricingPackages: updatedPackages });
    };

    const handleAddPricingPackage = () => {
        const newPackage: PricingPackage = {
            name: 'New Package',
            quantityLabel: '-',
            boatCount: '-',
            pricePerMonth: '-',
            productionCost: '-'
        };
        setEditForm(prev => ({ ...prev, pricingPackages: [...(prev.pricingPackages || []), newPackage] }));
    };

    const handleDeletePricingPackage = (index: number) => {
        setEditForm(prev => {
            const updated = [...(prev.pricingPackages || [])];
            updated.splice(index, 1);
            return { ...prev, pricingPackages: updated };
        });
    };

    // --- Map Effect ---

    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current && window.L) {
            const L = window.L;
            const map = L.map(mapContainerRef.current, {
                center: [13.7563, 100.5018],
                zoom: 13,
                zoomControl: false
            });

            // Google Maps Tiles (Standard Roadmap) for labels (streets, shops, piers)
            L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                attribution: '&copy; Google Maps',
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                maxZoom: 20
            }).addTo(map);

            L.control.zoom({ position: 'bottomright' }).addTo(map);

            mapInstanceRef.current = map;
            markersLayerRef.current = L.layerGroup().addTo(map);
            routeLayerRef.current = L.layerGroup().addTo(map);
        }
    }, []);

    // NEW: Focus Equipment Effect
    useEffect(() => {
        if (focusedEquipmentId && mapInstanceRef.current && equipmentList) {
            const target = equipmentList.find(e => e.id === focusedEquipmentId);
            if (target && target.lat && target.lng) {
                mapInstanceRef.current.flyTo([target.lat, target.lng], 18, {
                    animate: true,
                    duration: 1.5
                });
                setSelectedEquipment(target);
                setSelectedSpot(null);
                setIsPanelCollapsed(false);
            }
        }
    }, [focusedEquipmentId, equipmentList]);

    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;
        const L = window.L;
        const map = mapInstanceRef.current;

        // Clear existing markers and route layers
        markersLayerRef.current.clearLayers();
        routeLayerRef.current.clearLayers();

        // Stop and clear any existing animations
        animationRefs.current.forEach(cancelAnimationFrame);
        animationRefs.current = [];

        // Clear previous click handlers to avoid stacking
        map.off('click');

        const spotsToShow = adSpots.filter(s => {
            if (filterType !== 'ALL' && s.type !== filterType) return false;
            if ((filterType === MediaType.EXPRESS_BOAT || filterType === MediaType.MINE_SMART_FERRY || filterType === MediaType.TOURIST_BOAT) && boatFlagFilter !== 'ALL') {
                if (s.boatFlag !== boatFlagFilter) return false;
            }
            return true;
        });

        spotsToShow.forEach(spot => {
            // Skip rendering static markers/routes if we are currently editing this spot's route
            const isBeingEdited = isEditingRoute && editForm.id === spot.id;

            if (!isBeingEdited) {
                if (spot.lat && spot.lng) {
                    let markerColor = '#6366f1';
                    if (spot.type === MediaType.PIER) markerColor = '#0ea5e9';
                    if (spot.type === MediaType.DIGITAL_SCREEN) markerColor = '#f43f5e';
                    if (spot.boatFlag === 'ORANGE') markerColor = '#f97316';
                    if (spot.boatFlag === 'YELLOW') markerColor = '#eab308';
                    if (spot.boatFlag === 'GREEN') markerColor = '#10b981';
                    if (spot.boatFlag === 'RED') markerColor = '#dc2626';

                    const iconHtml = `
                    <div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;"></div>
                `;

                    const icon = L.divIcon({
                        className: 'custom-map-marker',
                        html: iconHtml,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });

                    const marker = L.marker([spot.lat, spot.lng], { icon })
                        .bindPopup(`<div class="font-sans"><strong>${spot.name}</strong><br/>${spot.type}</div>`)
                        .on('click', () => {
                            setSelectedSpot(spot);
                            setIsPanelCollapsed(false);
                        });

                    markersLayerRef.current.addLayer(marker);
                }

                if (spot.route && spot.route.length > 0) {
                    const latlngs = spot.route.map(pt => [pt.lat, pt.lng]);
                    const polyline = L.polyline(latlngs, {
                        color: spot.routeColor || '#6366f1',
                        weight: 4,
                        opacity: 0.7,
                        dashArray: spot.type === MediaType.TOURIST_BOAT ? '10, 10' : undefined
                    }).on('click', () => {
                        setSelectedSpot(spot);
                        setIsPanelCollapsed(false);
                    });
                    routeLayerRef.current.addLayer(polyline);

                    // 2. Animated Boat Marker
                    if (spot.route.length > 1) {
                        let markerColor = spot.routeColor || '#6366f1';
                        // Fallback to flag colors if routeColor not explicit
                        if (spot.boatFlag === 'ORANGE') markerColor = '#f97316';
                        if (spot.boatFlag === 'YELLOW') markerColor = '#eab308';
                        if (spot.boatFlag === 'GREEN') markerColor = '#10b981';
                        if (spot.boatFlag === 'RED') markerColor = '#dc2626';
                        if (spot.boatFlag === 'BLUE') markerColor = '#0ea5e9';
                        if (spot.boatFlag === 'MINE_GREEN') markerColor = '#4ade80';
                        if (spot.boatFlag === 'MINE_PURPLE') markerColor = '#a855f7';

                        const boatIconHtml = `
                        <div style="width: 36px; height: 36px; transform-origin: center;">
                            <svg viewBox="0 0 24 24" fill="${markerColor}" stroke="white" stroke-width="1" style="width:100%;height:100%;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.4));">
                                <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2z"/>
                                <path d="M3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
                            </svg>
                        </div>
                    `;


                        // We create a marker initially at the first point
                        const boatIcon = L.divIcon({
                            className: `boat-anim-${spot.id}`,
                            html: boatIconHtml,
                            iconSize: [36, 36],
                            iconAnchor: [18, 18] // Center
                        });

                        const boatMarker = L.marker([latlngs[0][0], latlngs[0][1]], {
                            icon: boatIcon,
                            zIndexOffset: 1000
                        }).addTo(routeLayerRef.current);

                        // Animation State
                        let currentPointIndex = 0;
                        let progress = 0; // 0 to 1 between current and next point
                        const speed = 0.005; // Speed factor

                        const animate = () => {
                            const start = latlngs[currentPointIndex];
                            const nextIndex = (currentPointIndex + 1) % latlngs.length;
                            const end = latlngs[nextIndex];

                            // Linear Interpolation
                            const lat = start[0] + (end[0] - start[0]) * progress;
                            const lng = start[1] + (end[1] - start[1]) * progress;

                            boatMarker.setLatLng([lat, lng]);

                            // Calculate Rotation (Bearing)
                            const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * 180 / Math.PI;

                            // Apply rotation to the icon's inner div
                            const iconEl = boatMarker.getElement();
                            if (iconEl) {
                                const inner = iconEl.querySelector('div');
                                if (inner) {
                                    inner.style.transform = `rotate(${angle + 90}deg)`;
                                }
                            }

                            progress += speed;
                            if (progress >= 1) {
                                progress = 0;
                                currentPointIndex = nextIndex;
                            }

                            const reqId = requestAnimationFrame(animate);
                            animationRefs.current.push(reqId);
                        };

                        const reqId = requestAnimationFrame(animate);
                        animationRefs.current.push(reqId);
                    }
                }
            }
        });

        // NEW: Equipment Rendering Loop
        if (equipmentList) {
            equipmentList.forEach(eq => {
                if (eq.lat && eq.lng && eq.status !== EquipmentStatus.LOST) {
                    const statusColor = EQUIPMENT_STATUS_COLORS[eq.status] || '#64748b';

                    // Diamond shape marker for equipment
                    const iconHtml = `
                    <div style="background-color: ${statusColor}; width: 24px; height: 24px; border-radius: 6px; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; transform: rotate(45deg);">
                        <div style="transform: rotate(-45deg); color: white; font-size: 12px;">
                           ${EQUIPMENT_ICONS[eq.type] || '🔧'}
                        </div>
                    </div>
                `;

                    const icon = L.divIcon({
                        className: `eq-marker-${eq.id}`,
                        html: iconHtml,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });

                    const marker = L.marker([eq.lat, eq.lng], { icon })
                        .bindTooltip(`<div class="text-xs font-bold">${eq.name}</div>`, { direction: 'top', offset: [0, -15] })
                        .on('click', () => {
                            setSelectedEquipment(eq);
                            setSelectedSpot(null); // Deselect ad spot
                            setIsPanelCollapsed(false);
                        });

                    markersLayerRef.current.addLayer(marker);
                }
            });
        }

        // --- Render Editable Route ---
        if (isEditingRoute && editForm) {
            const routePoints = editForm.route || [];

            // 1. Draw Polyline
            if (routePoints.length > 0) {
                const latlngs = routePoints.map(pt => [pt.lat, pt.lng]);
                const polyline = L.polyline(latlngs, {
                    color: '#ef4444', // Red for editing
                    weight: 4,
                    dashArray: '10, 10',
                    opacity: 0.8
                });
                routeLayerRef.current.addLayer(polyline);
            }

            // 2. Draw Editable Handles (Markers)
            routePoints.forEach((pt, index) => {
                const handleIcon = L.divIcon({
                    className: 'edit-handle',
                    html: `<div style="background-color: white; width: 14px; height: 14px; border: 3px solid #ef4444; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7]
                });

                const marker = L.marker([pt.lat, pt.lng], {
                    icon: handleIcon,
                    draggable: true,
                    zIndexOffset: 1000 // Always on top
                });

                marker.on('dragend', (e: any) => {
                    L.DomEvent.stopPropagation(e);
                    const newLatLng = e.target.getLatLng();
                    setEditForm(prev => {
                        const newRoute = [...(prev.route || [])];
                        newRoute[index] = { lat: newLatLng.lat, lng: newLatLng.lng };
                        return { ...prev, route: newRoute };
                    });
                });

                // Right click to delete point
                marker.on('contextmenu', (e: any) => {
                    L.DomEvent.stopPropagation(e); // Prevent map context menu
                    setEditForm(prev => {
                        const newRoute = [...(prev.route || [])];
                        newRoute.splice(index, 1);
                        return { ...prev, route: newRoute };
                    });
                });

                // Tooltip for UX
                marker.bindTooltip("ลากเพื่อย้าย / คลิกขวาเพื่อลบ", { direction: 'top', offset: [0, -10] });

                routeLayerRef.current.addLayer(marker);
            });

            // 3. Map Click to Add Point
            map.on('click', (e: any) => {
                setEditForm(prev => ({
                    ...prev,
                    route: [...(prev.route || []), { lat: e.latlng.lat, lng: e.latlng.lng }]
                }));
            });
        }

        return () => {
            animationRefs.current.forEach(cancelAnimationFrame);
        };

    }, [adSpots, equipmentList, filterType, boatFlagFilter, isEditingRoute, editForm.route, editForm.id]);

    const displayAudience = selectedSpot?.audience;

    return (
        <div className="flex h-[calc(100vh-64px-24px)] overflow-hidden p-4 gap-4 bg-slate-100 relative selection:bg-indigo-100">

            {/* Sidebar */}
            <div className={`flex flex-col gap-4 transition-all duration-700 ease-in-out ${isPanelCollapsed ? 'w-0 opacity-0 -translate-x-full pointer-events-none' : 'w-96'}`}>
                {/* Sidebar Header */}
                <div className="bg-gradient-to-b from-[#22d3ee] via-[#3b82f6] to-[#6366f1] rounded-[3rem] p-8 shadow-2xl shadow-blue-500/30 border-4 border-white/20 relative overflow-hidden group text-center flex flex-col items-center z-20 transition-all duration-500 flex-shrink-0">

                    {/* --- CUSTOM SHIP ANIMATION (SIDE VIEW) --- */}
                    <style>{`
                @keyframes floatShip {
                    0% { transform: translateX(-400px); }
                    100% { transform: translateX(600px); }
                }
                @keyframes bobbing {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .ship-container-anim {
                    animation: floatShip 25s linear infinite;
                }
                .ship-body-anim {
                    animation: bobbing 3s ease-in-out infinite;
                }
             `}</style>

                    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[2.8rem]">
                        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-blue-900 via-blue-700/50 to-transparent"></div>
                        <div className="absolute bottom-0 w-full h-16 bg-[#1e40af] opacity-40 blur-xl"></div>

                        {/* Custom Side View Ship Animation - LARGE DINNER CRUISE */}
                        <div className="absolute bottom-8 left-0 ship-container-anim opacity-90">
                            <div className="ship-body-anim text-white drop-shadow-2xl">
                                <svg width="320" height="160" viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Hull */}
                                    <path d="M20 120 C20 120 50 150 80 150 H280 C300 150 320 130 320 120 H20 Z" fill="currentColor" opacity="0.95" />
                                    <path d="M30 125 H310" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

                                    {/* 1st Floor (Air Conditioned) */}
                                    <path d="M40 120 V 90 H 300 V 120" fill="currentColor" opacity="0.9" />
                                    {/* Windows 1st Floor */}
                                    <rect x="50" y="95" width="30" height="15" rx="2" fill="rgba(0,0,0,0.2)" />
                                    <rect x="90" y="95" width="30" height="15" rx="2" fill="rgba(0,0,0,0.2)" />
                                    <rect x="130" y="95" width="30" height="15" rx="2" fill="rgba(0,0,0,0.2)" />
                                    <rect x="170" y="95" width="30" height="15" rx="2" fill="rgba(0,0,0,0.2)" />
                                    <rect x="210" y="95" width="30" height="15" rx="2" fill="rgba(0,0,0,0.2)" />
                                    <rect x="250" y="95" width="30" height="15" rx="2" fill="rgba(0,0,0,0.2)" />

                                    {/* 2nd Floor (Open Air / Roof) */}
                                    <path d="M50 90 V 60 H 290 V 90" fill="currentColor" opacity="0.8" />

                                    {/* Railings 2nd Floor */}
                                    <path d="M50 75 H 290" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="4 4" />

                                    {/* Pillars 2nd Floor */}
                                    <rect x="60" y="60" width="5" height="30" fill="currentColor" />
                                    <rect x="100" y="60" width="5" height="30" fill="currentColor" />
                                    <rect x="140" y="60" width="5" height="30" fill="currentColor" />
                                    <rect x="180" y="60" width="5" height="30" fill="currentColor" />
                                    <rect x="220" y="60" width="5" height="30" fill="currentColor" />
                                    <rect x="260" y="60" width="5" height="30" fill="currentColor" />

                                    {/* Roof */}
                                    <path d="M40 60 Q 170 40 300 60 H 40 Z" fill="currentColor" opacity="1" />

                                    {/* Decoration / Radar */}
                                    <rect x="160" y="45" width="4" height="15" fill="currentColor" />
                                    <path d="M162 45 L150 30 M162 45 L174 30" stroke="currentColor" strokeWidth="2" />

                                    {/* Party Lights (Circles) */}
                                    <circle cx="50" cy="60" r="2" fill="#FCD34D" className="animate-pulse" />
                                    <circle cx="90" cy="60" r="2" fill="#FCD34D" className="animate-pulse" style={{ animationDelay: '0.1s' }} />
                                    <circle cx="130" cy="60" r="2" fill="#FCD34D" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                                    <circle cx="170" cy="60" r="2" fill="#FCD34D" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                                    <circle cx="210" cy="60" r="2" fill="#FCD34D" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                                    <circle cx="250" cy="60" r="2" fill="#FCD34D" className="animate-pulse" style={{ animationDelay: '0.5s' }} />

                                </svg>
                            </div>
                            {/* Water Wake */}
                            <div className="absolute bottom-[-10px] right-10 w-96 h-4 bg-white/20 blur-md rounded-full"></div>
                        </div>

                        <div className="absolute top-10 left-[-20px] text-white/20 transform -rotate-12 scale-150">
                            <Cloud size={100} fill="currentColor" />
                        </div>
                        <div className="absolute top-20 right-[-30px] text-white/10 transform rotate-12 scale-125">
                            <Cloud size={80} fill="currentColor" />
                        </div>
                        <div className="absolute bottom-[-50px] left-0 right-0 h-40 bg-white/10 rounded-[50%] blur-2xl"></div>
                    </div>

                    {isAdmin && <button onClick={handleCreateNew} className="absolute top-6 right-6 w-8 h-8 bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20 group/btn"><Plus size={16} /></button>}

                    <div className="relative z-10 w-full flex flex-col items-center mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Ship size={32} className="text-white" strokeWidth={2.5} />
                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-md">
                                NAVIGATOR
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 w-full justify-center">
                            <div className="h-px bg-white/30 flex-grow"></div>
                            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.4em] text-shadow-sm">
                                Control Center
                            </p>
                            <div className="h-px bg-white/30 flex-grow"></div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-3 px-1 relative z-10">
                        <button
                            onClick={() => { setFilterType('ALL'); setBoatFlagFilter('ALL'); }}
                            className={getFilterButtonStyle('ALL', filterType === 'ALL')}
                        >
                            <LayoutGrid size={24} strokeWidth={2.5} />
                            <span className="text-xs font-black uppercase tracking-widest mt-1">All Assets</span>
                        </button>

                        <div className="grid grid-cols-3 gap-2 w-full">
                            {FILTER_ITEMS.filter(f => BOAT_TYPES.includes(f.id as MediaType)).map(f => {
                                const isActive = filterType === f.id;
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => { setFilterType(f.id as any); setBoatFlagFilter('ALL'); }}
                                        className={getFilterButtonStyle(f.id, isActive)}
                                    >
                                        <div className="mb-1">{React.cloneElement(f.icon as any, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}</div>
                                        <span className="text-[7px] font-black uppercase tracking-tight leading-none">{f.subLabel}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {(filterType === MediaType.EXPRESS_BOAT || filterType === MediaType.MINE_SMART_FERRY || filterType === MediaType.TOURIST_BOAT) && (
                            <div className="bg-black/10 p-2 rounded-2xl border border-white/10 flex justify-center gap-3 animate-slideUp backdrop-blur-sm w-full">
                                {(filterType === MediaType.EXPRESS_BOAT ? EXPRESS_BOAT_FLAGS :
                                    filterType === MediaType.MINE_SMART_FERRY ? MINE_SMART_FLAGS :
                                        TOURIST_FLAGS).map(flag => (
                                            <button
                                                key={flag.id}
                                                onClick={() => setBoatFlagFilter(prev => prev === flag.id ? 'ALL' : flag.id as any)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all ${boatFlagFilter === flag.id ? 'ring-2 ring-white scale-110 ' + flag.color : flag.color}`}
                                                title={flag.label}
                                            >
                                                <Flag size={16} className={flag.id === boatFlagFilter ? 'fill-current' : ''} />
                                            </button>
                                        ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 w-full">
                            {FILTER_ITEMS.filter(f => [MediaType.PIER, MediaType.DIGITAL_SCREEN].includes(f.id as MediaType)).map(f => {
                                const isActive = filterType === f.id;
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => { setFilterType(f.id as any); setBoatFlagFilter('ALL'); }}
                                        className={getFilterButtonStyle(f.id, isActive)}
                                    >
                                        {React.cloneElement(f.icon as any, { size: 20, strokeWidth: isActive ? 2.5 : 2 })}
                                        <span className="text-[9px] font-black uppercase tracking-tight mt-1">{f.subLabel}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* List */}
                <div className="flex-grow overflow-y-auto custom-scrollbar relative">
                    {groupedSpots.boats.length > 0 && (<div className="mb-6"><div className="sticky top-0 bg-slate-100/95 backdrop-blur z-10 px-2 py-3 mb-2 flex items-center gap-2 border-b border-slate-200"><Ship size={16} /><h3 className="text-xs font-black text-slate-500">Fleet & Boats ({groupedSpots.boats.length})</h3></div><div className="space-y-3 pr-2">{groupedSpots.boats.map(renderSpotCard)}</div></div>)}
                    {groupedSpots.piers.length > 0 && (<div className="mb-6"><div className="sticky top-0 bg-slate-100/95 backdrop-blur z-10 px-2 py-3 mb-2 flex items-center gap-2 border-b border-slate-200"><Anchor size={16} /><h3 className="text-xs font-black text-slate-500">Piers ({groupedSpots.piers.length})</h3></div><div className="space-y-3 pr-2">{groupedSpots.piers.map(renderSpotCard)}</div></div>)}
                    {groupedSpots.digital.length > 0 && (<div className="mb-6"><div className="sticky top-0 bg-slate-100/95 backdrop-blur z-10 px-2 py-3 mb-2 flex items-center gap-2 border-b border-slate-200"><MonitorPlay size={16} /><h3 className="text-xs font-black text-slate-500">Digital ({groupedSpots.digital.length})</h3></div><div className="space-y-3 pr-2">{groupedSpots.digital.map(renderSpotCard)}</div></div>)}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-grow relative rounded-[3.5rem] overflow-hidden shadow-2xl border-[6px] border-white bg-slate-200">
                <div ref={mapContainerRef} className="absolute inset-0 z-0"></div>

                {/* Search Bar Overlay */}
                <div className="absolute top-6 left-6 z-[400] max-w-sm w-full">
                    <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-2 flex items-center gap-2 border border-white/50">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            <MapPin size={20} />
                        </div>
                        <form onSubmit={handleSearchLocation} className="flex-grow flex items-center">
                            <input
                                type="text"
                                className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 font-bold text-sm"
                                placeholder="ค้นหาสถานที่ (เช่น ไอคอนสยาม)..."
                                value={mapSearchQuery}
                                onChange={(e) => setMapSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={isSearchingMap}
                                className="p-2 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                            >
                                {isSearchingMap ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : <Search size={20} />}
                            </button>
                        </form>
                    </div>

                    {/* Autocomplete Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border border-white/50 animate-fadeIn">
                            {searchResults.map(spot => (
                                <div
                                    key={spot.id}
                                    onClick={() => handleSelectLocation(spot)}
                                    className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-none flex items-center gap-3 group"
                                >
                                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-700">{spot.name}</div>
                                        <div className="text-[10px] font-bold text-slate-400">{spot.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {isEditingRoute && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1002] flex flex-col items-center gap-4 animate-slideUp">
                        <div className="bg-slate-900/90 backdrop-blur-2xl text-white p-2.5 rounded-[3.5rem] flex flex-col gap-3">
                            <div className="flex gap-3 pr-6 pl-6 py-2">
                                <button onClick={handleSave} className="px-10 py-3 bg-indigo-600 text-white rounded-[2rem] text-[13px] font-black">บันทึกเส้นทาง</button>
                                <button onClick={() => { setIsEditingRoute(false); setIsPanelCollapsed(false); }} className="p-3 text-slate-500 hover:text-white"><X size={24} /></button>
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 bg-black/20 backdrop-blur px-4 py-1.5 rounded-full text-center">
                                คลิกบนแผนที่เพื่อเพิ่มจุด • ลากจุดเพื่อย้าย • คลิกขวาเพื่อลบ
                            </div>
                        </div>
                    </div>
                )}
                {selectedEquipment && !isPanelCollapsed && (
                    <div className="absolute bottom-6 left-6 z-[1002] bg-white p-4 rounded-[2rem] shadow-2xl border border-slate-100 w-80 animate-slideUp">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner">{EQUIPMENT_ICONS[selectedEquipment.type]}</div>
                            <div>
                                <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{selectedEquipment.id}</div>
                                <h3 className="font-bold text-slate-900 leading-tight">{selectedEquipment.name}</h3>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600">{selectedEquipment.serialNumber}</span>
                                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: EQUIPMENT_STATUS_COLORS[selectedEquipment.status] }}>{selectedEquipment.status}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedEquipment(null)} className="absolute top-2 right-2 p-2 text-slate-300 hover:text-slate-600"><X size={16} /></button>
                    </div>
                )}
                {isPanelCollapsed && !isEditingRoute && (
                    <button onClick={() => setIsPanelCollapsed(false)} className="absolute left-8 top-1/2 -translate-y-1/2 z-[1001] p-5 bg-white rounded-3xl shadow-4xl text-slate-400 hover:text-indigo-600 border border-slate-50 hover:scale-110"><ChevronRight size={28} /></button>
                )}

                {/* Details Panel */}
                {selectedSpot && (
                    <div className={`absolute right-0 top-0 bottom-0 z-[1001] bg-white transition-all duration-700 flex flex-col shadow-[-40px_0_80px_rgba(0,0,0,0.1)] ${isPanelCollapsed && !isEditingRoute ? 'w-20' : 'w-full md:w-[600px]'}`}>
                        <div className="p-8 flex items-center gap-6 border-b border-slate-50 relative">
                            <button onClick={() => setIsPanelCollapsed(!isPanelCollapsed)} className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-indigo-600 transition-all">{isPanelCollapsed ? <Maximize2 size={24} /> : <Expand size={24} className="rotate-45" />}</button>
                            {!isPanelCollapsed && (<div className="flex-grow min-w-0"><h2 className="text-xl font-black text-slate-900 leading-none uppercase truncate">{selectedSpot.name}</h2><p className="text-[12px] font-bold text-indigo-500 uppercase mt-1.5">ID: #{selectedSpot.id}</p></div>)}
                            <div className="flex items-center gap-1">
                                {isAdmin && !isEditingRoute && !isPanelCollapsed && (<><button onClick={handleStartEditRoute} className="p-4 text-slate-300 hover:text-indigo-600 rounded-2xl" title="แก้ไขเส้นทาง"><MapIcon size={28} /></button><button onClick={handleStartEditDetails} className="p-4 text-slate-300 hover:text-indigo-600 rounded-2xl" title="แก้ไขข้อมูล"><SquarePen size={28} /></button></>)}
                                <button onClick={() => { setSelectedSpot(null); setIsEditingRoute(false); setIsEditingDetails(false); }} className="p-4 text-slate-200 hover:text-rose-500"><X size={32} /></button>
                            </div>
                        </div>

                        {!isPanelCollapsed && (
                            <div className="flex-grow overflow-y-auto custom-scrollbar p-10 space-y-12 animate-fadeIn bg-slate-50/50">
                                {isEditingDetails ? (
                                    // Edited Form
                                    <div className="space-y-8 pb-20">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-2"><Edit size={24} /> แก้ไขจุดโฆษณา</h3>
                                            <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"><Save size={18} /> บันทึก</button>
                                        </div>

                                        <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                            <div className="space-y-2"><label className="text-sm font-bold text-slate-900 uppercase">ชื่อจุดโฆษณา</label><input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2"><label className="text-sm font-bold text-slate-900 uppercase">ประเภท</label><select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value as MediaType })}>{Object.keys(MediaTypeLabel).map(k => (<option key={k} value={k}>{MediaTypeLabel[k as MediaType]}</option>))}</select></div>
                                                <div className="space-y-2"><label className="text-sm font-bold text-slate-900 uppercase">ราคา/วัน</label><input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none" value={editForm.pricePerDay || 0} onChange={e => setEditForm({ ...editForm, pricePerDay: Number(e.target.value) })} /></div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                                <h4 className="text-lg font-black text-slate-800 uppercase flex items-center gap-2"><ImageIcon size={20} /> จัดการสื่อและรูปภาพ</h4>
                                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold">Total: {(editForm.gallery?.length || 0) + (editForm.videoGallery?.length || 0) + 1}</span>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">รูปภาพหลัก (Main Image)</label>
                                                <div className="relative group w-full h-48 bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 hover:border-indigo-500 transition-all cursor-pointer">
                                                    {editForm.imageUrl ? (
                                                        <img src={editForm.imageUrl} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full text-slate-400"><Upload size={32} /><span className="text-xs mt-2 font-bold">Upload Main Image</span></div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                                        <span className="font-bold flex items-center gap-2"><Edit size={16} /> เปลี่ยนรูปภาพ</span>
                                                    </div>
                                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">แกลเลอรี่ (Gallery)</label>
                                                <div className="grid grid-cols-4 gap-3">
                                                    {editForm.gallery?.map((img, idx) => (
                                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-slate-100 border border-slate-200">
                                                            <img src={img} className="w-full h-full object-cover" />
                                                            <button onClick={() => handleRemoveMedia(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><X size={12} /></button>
                                                        </div>
                                                    ))}
                                                    <div className="relative aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-50 text-slate-400 hover:text-indigo-600">
                                                        <Plus size={24} />
                                                        <span className="text-[9px] font-bold mt-1">Add Image</span>
                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" multiple onChange={(e) => handleImageUpload(e, false)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">วิดีโอ (Videos)</label>
                                                <div className="space-y-2">
                                                    {editForm.videoGallery?.map((vid, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                            <div className="p-2 bg-slate-200 rounded text-slate-500"><Video size={16} /></div>
                                                            <div className="flex-grow text-xs font-medium text-slate-600 truncate">{vid.startsWith('data:') ? 'Uploaded Video File' : vid}</div>
                                                            <button onClick={() => handleRemoveMedia(idx, true)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                    <div className="relative w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer group">
                                                        <Plus size={16} />
                                                        <span>อัปโหลดวิดีโอ (Upload Video)</span>
                                                        <input
                                                            type="file"
                                                            accept="video/*"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={handleVideoUpload}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                            {editForm.type === MediaType.FERRY ? (
                                                <FerryScheduleTable
                                                    schedules={editForm.boatSchedules || []}
                                                    isEditing={true}
                                                    onUpdate={handleUpdateSchedule}
                                                    onAdd={handleAddSchedule}
                                                    onDelete={handleDeleteSchedule}
                                                />
                                            ) : (
                                                <ServiceScheduleTable
                                                    schedules={editForm.boatSchedules || []}
                                                    isEditing={true}
                                                    onUpdate={handleUpdateSchedule}
                                                    onAdd={handleAddSchedule}
                                                    onDelete={handleDeleteSchedule}
                                                />
                                            )}
                                        </div>

                                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                            <AdvertisingMediaTable
                                                packages={editForm.pricingPackages || []}
                                                isEditing={true}
                                                onUpdate={(idx, key, val) => handleUpdatePricingPackage(idx, key as string, val)}
                                                onAdd={handleAddPricingPackage}
                                                onDelete={handleDeletePricingPackage}
                                            />
                                        </div>

                                        <button onClick={handleSave} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase shadow-xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all transform hover:scale-[1.01]"><Save size={20} /> บันทึกการเปลี่ยนแปลง (Save Changes)</button>
                                    </div>
                                ) : (
                                    <div className="space-y-10 animate-fadeIn">
                                        <div className="flex gap-2 p-1.5 bg-white rounded-full w-fit shadow-lg shadow-slate-200/50 border border-slate-100">
                                            {(selectedSpot.type === MediaType.PIER ? ['OVERVIEW', 'AUDIENCE', 'PACKAGES', 'MARKETING'] : ['OVERVIEW', 'AUDIENCE', 'PACKAGES']).map(t => (
                                                <button key={t} onClick={() => setActiveTab(t as any)} className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{t === 'PACKAGES' ? 'MEDIA PACKAGES' : t}</button>
                                            ))}
                                        </div>

                                        {activeTab === 'OVERVIEW' && (
                                            <div className="space-y-8">
                                                <div
                                                    className="relative rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl group border-4 border-white bg-slate-100 cursor-pointer"
                                                    onClick={() => {
                                                        const idx = allMediaForLightbox.findIndex(m => m.url === activeMedia?.url);
                                                        if (idx !== -1) setLightboxIndex(idx);
                                                    }}
                                                >
                                                    {activeMedia?.type === 'video' ? (
                                                        <video src={activeMedia.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                                    ) : (
                                                        <img src={activeMedia?.url || selectedSpot.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                    )}
                                                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent text-white pointer-events-none">
                                                        <h3 className="text-3xl font-black mb-2 leading-tight drop-shadow-md">{selectedSpot.name}</h3>
                                                        <p className="text-sm opacity-90 flex items-center gap-2 font-medium drop-shadow">
                                                            <MapPin size={16} className="text-rose-400" /> {selectedSpot.nearbyLandmarks?.[0] || 'Premium Location'}
                                                        </p>
                                                    </div>
                                                </div>




                                                {allMediaForLightbox.some(m => m.type === 'image') && (
                                                    <div className="space-y-2">
                                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รูปภาพ (Photos)</h5>
                                                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                                            {allMediaForLightbox.filter(m => m.type === 'image').map((media, idx) => (
                                                                <button key={`img-${idx}`} onClick={(e) => { e.stopPropagation(); setActiveMedia(media); }} className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeMedia?.url === media.url ? 'border-indigo-600 ring-2 ring-indigo-100 scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}>
                                                                    <img src={media.url} className="w-full h-full object-cover" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {allMediaForLightbox.some(m => m.type === 'video') && (
                                                    <div className="space-y-2">
                                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">วิดีโอ (Videos)</h5>
                                                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                                            {allMediaForLightbox.filter(m => m.type === 'video').map((media, idx) => (
                                                                <button key={`vid-${idx}`} onClick={(e) => { e.stopPropagation(); setActiveMedia(media); }} className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeMedia?.url === media.url ? 'border-indigo-600 ring-2 ring-indigo-100 scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}>
                                                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center"><Play size={20} className="text-white" /></div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedSpot.type === MediaType.FERRY ? (
                                                    <FerryScheduleTable schedules={selectedSpot.boatSchedules || []} />
                                                ) : (
                                                    <ServiceScheduleTable schedules={selectedSpot.boatSchedules || []} />
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'AUDIENCE' && (
                                            <div className="space-y-8 animate-fadeIn">
                                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2"><TrendingUp className="text-indigo-600" /> ข้อมูลเชิงลึกการจราจร</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-[2rem] border border-indigo-100 shadow-sm relative overflow-hidden group">
                                                        <div className="relative z-10">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4"><Briefcase size={20} /></div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">วันธรรมดา (จันทร์-ศุกร์)</p>
                                                            {isEditingDetails ? (
                                                                <input
                                                                    type="number"
                                                                    className="text-3xl font-black text-slate-900 w-full bg-white border-2 border-indigo-300 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
                                                                    value={editForm?.audience?.trafficBreakdown?.weekday || 0}
                                                                    onChange={(e) => setEditForm({
                                                                        ...editForm,
                                                                        audience: {
                                                                            ...editForm.audience!,
                                                                            trafficBreakdown: {
                                                                                ...editForm.audience?.trafficBreakdown!,
                                                                                weekday: parseInt(e.target.value) || 0
                                                                            }
                                                                        }
                                                                    })}
                                                                />
                                                            ) : (
                                                                <h4 className="text-3xl font-black text-slate-900">{(displayAudience?.trafficBreakdown?.weekday || selectedSpot.audience.trafficBreakdown?.weekday || 0).toLocaleString()}</h4>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-[2rem] border border-amber-100 shadow-sm relative overflow-hidden group">
                                                        <div className="relative z-10">
                                                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4"><Palmtree size={20} /></div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">วันหยุดสุดสัปดาห์</p>
                                                            {isEditingDetails ? (
                                                                <input
                                                                    type="number"
                                                                    className="text-3xl font-black text-slate-900 w-full bg-white border-2 border-amber-300 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                                                                    value={editForm?.audience?.trafficBreakdown?.weekend || 0}
                                                                    onChange={(e) => setEditForm({
                                                                        ...editForm,
                                                                        audience: {
                                                                            ...editForm.audience!,
                                                                            trafficBreakdown: {
                                                                                ...editForm.audience?.trafficBreakdown!,
                                                                                weekend: parseInt(e.target.value) || 0
                                                                            }
                                                                        }
                                                                    })}
                                                                />
                                                            ) : (
                                                                <h4 className="text-3xl font-black text-slate-900">{(displayAudience?.trafficBreakdown?.weekend || selectedSpot.audience.trafficBreakdown?.weekend || 0).toLocaleString()}</h4>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-[2rem] border border-rose-100 shadow-sm relative overflow-hidden group">
                                                        <div className="relative z-10">
                                                            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4"><PartyPopper size={20} /></div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">วันหยุดนักขัตฤกษ์</p>
                                                            {isEditingDetails ? (
                                                                <input
                                                                    type="number"
                                                                    className="text-3xl font-black text-slate-900 w-full bg-white border-2 border-rose-300 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                                                                    value={editForm?.audience?.trafficBreakdown?.holiday || 0}
                                                                    onChange={(e) => setEditForm({
                                                                        ...editForm,
                                                                        audience: {
                                                                            ...editForm.audience!,
                                                                            trafficBreakdown: {
                                                                                ...editForm.audience?.trafficBreakdown!,
                                                                                holiday: parseInt(e.target.value) || 0
                                                                            }
                                                                        }
                                                                    })}
                                                                />
                                                            ) : (
                                                                <h4 className="text-3xl font-black text-slate-900">{(displayAudience?.trafficBreakdown?.holiday || selectedSpot.audience.trafficBreakdown?.holiday || 0).toLocaleString()}</h4>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Top 5 Interests */}
                                                {displayAudience?.topInterests && displayAudience.topInterests.length > 0 && (
                                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
                                                        <h4 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest flex items-center gap-2"><Target size={18} className="text-rose-500" /> ความสนใจ 5 อันดับแรก (Top 5 Interests)</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                            {displayAudience.topInterests.slice(0, 5).map((item: any, idx: number) => {
                                                                const rank = idx + 1;
                                                                let colors = {
                                                                    rankBg: 'bg-slate-100',
                                                                    rankText: 'text-slate-500',
                                                                    iconBg: 'bg-slate-50',
                                                                    iconColor: 'text-slate-400',
                                                                    barColor: 'bg-slate-300',
                                                                    labelColor: 'text-slate-600'
                                                                };

                                                                if (rank === 1) colors = { rankBg: 'bg-rose-500 shadow-rose-200 shadow-lg ring-2 ring-rose-100', rankText: 'text-white', iconBg: 'bg-rose-50', iconColor: 'text-rose-500', barColor: 'bg-gradient-to-r from-rose-400 to-rose-600', labelColor: 'text-rose-900' };
                                                                else if (rank === 2) colors = { rankBg: 'bg-orange-500 shadow-orange-200 shadow-lg ring-2 ring-orange-100', rankText: 'text-white', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', barColor: 'bg-gradient-to-r from-orange-400 to-orange-600', labelColor: 'text-orange-900' };
                                                                else if (rank === 3) colors = { rankBg: 'bg-amber-400 shadow-amber-200 shadow-lg ring-2 ring-amber-100', rankText: 'text-white', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', barColor: 'bg-gradient-to-r from-amber-300 to-amber-500', labelColor: 'text-amber-900' };
                                                                else if (rank === 4) colors = { rankBg: 'bg-emerald-500 shadow-emerald-200 shadow-lg ring-2 ring-emerald-100', rankText: 'text-white', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', barColor: 'bg-gradient-to-r from-emerald-400 to-emerald-600', labelColor: 'text-emerald-900' };
                                                                else if (rank === 5) colors = { rankBg: 'bg-indigo-500 shadow-indigo-200 shadow-lg ring-2 ring-indigo-100', rankText: 'text-white', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', barColor: 'bg-gradient-to-r from-indigo-400 to-indigo-600', labelColor: 'text-indigo-900' };

                                                                return (
                                                                    <div key={idx} className="flex items-center gap-4 group p-2 rounded-xl transition-all hover:bg-slate-50/80">
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 transition-transform group-hover:scale-110 ${colors.rankBg} ${colors.rankText}`}>
                                                                            {rank}
                                                                        </div>
                                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.iconBg} ${colors.iconColor}`}>
                                                                            {getInterestIcon(item.category)}
                                                                        </div>
                                                                        <div className="flex-grow">
                                                                            <div className="flex justify-between items-end mb-1">
                                                                                <span className={`text-sm font-bold ${colors.labelColor}`}>{item.category}</span>
                                                                                <span className={`text-xs font-bold ${colors.iconColor}`}>{item.value}%</span>
                                                                            </div>
                                                                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                                <div className={`h-full rounded-full shadow-sm ${colors.barColor}`} style={{ width: `${item.value}%` }}></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Passenger Profile */}
                                                <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 opacity-5"><Ship size={200} /></div>

                                                    <div className="flex justify-between items-center relative z-10">
                                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                                            <Users className="text-indigo-600" /> ข้อมูลผู้โดยสารเจ้าพระยา (Passenger Profile)
                                                        </h3>
                                                        <span className="text-[10px] bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-400 font-bold uppercase">Base: 3,000 Passengers</span>
                                                    </div>

                                                    {/* Row 1: Demographics & Occupation */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">ข้อมูลประชากร (Profile)</h4>
                                                                <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">Avg. Age 32</div>
                                                            </div>
                                                            <div className="flex items-center justify-around">
                                                                <div className="text-center">
                                                                    <div className="relative h-24 w-12 bg-slate-100 rounded-full mx-auto overflow-hidden mb-2 ring-4 ring-white shadow-lg">
                                                                        <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: '32%' }}></div>
                                                                        <Users size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600 mix-blend-multiply" />
                                                                    </div>
                                                                    <div className="text-2xl font-black text-slate-800">32%</div>
                                                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Male</div>
                                                                </div>
                                                                <div className="h-16 w-px bg-slate-100"></div>
                                                                <div className="text-center">
                                                                    <div className="relative h-24 w-12 bg-slate-100 rounded-full mx-auto overflow-hidden mb-2 ring-4 ring-white shadow-lg">
                                                                        <div className="absolute bottom-0 w-full bg-rose-500" style={{ height: '68%' }}></div>
                                                                        <Users size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600 mix-blend-multiply" />
                                                                    </div>
                                                                    <div className="text-2xl font-black text-slate-800">68%</div>
                                                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Female</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">อาชีพ & รายได้ (Job & Income)</h4>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Briefcase size={18} /></div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex justify-between text-xs font-bold mb-1">
                                                                            <span className="text-slate-700">พนักงานบริษัท (Non-blue collar)</span>
                                                                            <span className="text-indigo-600">62%</span>
                                                                        </div>
                                                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-[62%]"></div></div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center"><BookOpen size={18} /></div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex justify-between text-xs font-bold mb-1">
                                                                            <span className="text-slate-700">นักเรียน / นักศึกษา</span>
                                                                            <span className="text-sky-600">31%</span>
                                                                        </div>
                                                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-sky-500 w-[31%]"></div></div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">รายได้เฉลี่ยต่อครัวเรือน</span>
                                                                    <span className="text-xl font-black text-emerald-600">฿45,334</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Row 2: SEC & Living & Commuting */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                                        <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-lg relative overflow-hidden flex flex-col justify-between">
                                                            <div className="absolute top-0 right-0 p-6 opacity-10"><DollarSign size={80} /></div>
                                                            <div>
                                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">สถานะทางสังคม (SEC)</h4>
                                                                <div className="space-y-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div><span className="font-bold text-sm">Class A</span></div>
                                                                        <span className="text-2xl font-black text-amber-400">36%</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div><span className="font-bold text-sm text-slate-300">Class B</span></div>
                                                                        <span className="text-xl font-bold text-slate-300">16%</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-400"></div><span className="font-bold text-sm text-orange-200">Class C</span></div>
                                                                        <span className="text-xl font-bold text-orange-400">27%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="md:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6">
                                                            <div className="grid grid-cols-3 gap-4">
                                                                <div className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-100">
                                                                    <Home size={20} className="mx-auto text-indigo-500 mb-1" />
                                                                    <div className="text-xl font-black text-slate-800">72%</div>
                                                                    <div className="text-[9px] font-bold text-slate-500 uppercase">Owned House</div>
                                                                </div>
                                                                <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
                                                                    <Building2 size={20} className="mx-auto text-purple-500 mb-1" />
                                                                    <div className="text-xl font-black text-slate-800">18%</div>
                                                                    <div className="text-[9px] font-bold text-slate-500 uppercase">Condo / Flat</div>
                                                                </div>
                                                                <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                                                                    <div className="text-lg font-black text-slate-700 mt-2">87%</div>
                                                                    <div className="text-[9px] font-bold text-slate-400">ใช้เรือ 3-6 วัน/สัปดาห์</div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                                                <div className="flex justify-between items-end">
                                                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">เหตุผลที่ใช้เรือ (Key Reasons)</h4>
                                                                    <div className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">Avg Time: 52 mins/trip</div>
                                                                </div>
                                                                {[
                                                                    { label: 'เลี่ยงรถติด (Avoid Traffic)', val: 80, color: 'bg-rose-500' },
                                                                    { label: 'ใกล้จุดหมาย (Close to Dest.)', val: 67, color: 'bg-orange-500' },
                                                                    { label: 'กะเวลาได้ (Predictable)', val: 50, color: 'bg-amber-500' }
                                                                ].map((r, i) => (
                                                                    <div key={i}>
                                                                        <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                                                                            <span>{r.label}</span>
                                                                            <span>{r.val}%</span>
                                                                        </div>
                                                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                            <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.val}%` }}></div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'PACKAGES' && (
                                            <div className="space-y-8 animate-fadeIn">
                                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                                    <LayoutGrid className="text-indigo-600" size={24} /> Media Packages
                                                </h3>
                                                <AdvertisingMediaTable packages={selectedSpot.pricingPackages || []} />
                                            </div>
                                        )}

                                        {activeTab === 'MARKETING' && selectedSpot.type === MediaType.PIER && (
                                            <div className="space-y-8 animate-fadeIn relative">
                                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                                    <div className="w-full md:w-5/12">
                                                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white h-64 bg-slate-100">
                                                            <img src={selectedSpot.imageUrl} className="w-full h-full object-cover" />
                                                        </div>
                                                    </div>
                                                    <div className="w-full md:w-7/12 space-y-4">
                                                        <h3 className="text-2xl font-black text-slate-900">{selectedSpot.name}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Fullscreen Lightbox Modal ... */}
                {lightboxIndex !== null && (
                    <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fadeIn">
                        <button onClick={() => setLightboxIndex(null)} className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[3010]"><X size={24} /></button>
                        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
                            <div className="w-full h-full max-w-7xl flex items-center justify-center">
                                {allMediaForLightbox[lightboxIndex].type === 'video' ? (
                                    <video src={allMediaForLightbox[lightboxIndex].url} className="max-w-full max-h-full rounded-2xl shadow-2xl" controls autoPlay />
                                ) : (
                                    <img src={allMediaForLightbox[lightboxIndex].url} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
                                )}
                            </div>
                            <button onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : allMediaForLightbox.length - 1))} className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110"><ChevronLeft size={32} /></button>
                            <button onClick={() => setLightboxIndex((prev) => (prev !== null && prev < allMediaForLightbox.length - 1 ? prev + 1 : 0))} className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110"><ChevronRight size={32} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};