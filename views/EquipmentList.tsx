
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Equipment, EquipmentStatus, EquipmentType
} from '../types';
import { 
  Search, Plus, AlertTriangle, CheckCircle, Clock, Wrench, XCircle, 
  Filter, FileText, Image as ImageIcon, Calendar, MapPin, Save, Trash2, Edit, Upload, X,
  LayoutGrid, List, Folder, Map, ArrowRight, FolderOpen, Power, Loader2
} from 'lucide-react';
import { equipmentService } from '../services/equipmentService';

interface EquipmentManagerProps {
  currentUser?: any;
  equipmentList: Equipment[];
  onAdd: (eq: Equipment) => void;
  onUpdate: (eq: Equipment) => void;
  onDelete: (id: string) => void;
  onLocateEquipment: (eq: Equipment) => void;
  isLoading?: boolean;
}

type ViewMode = 'GRID' | 'LIST' | 'FOLDER';

const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  [EquipmentType.TV_SCREEN]: 'จอทีวี 43" - 60" นิ้ว',
  [EquipmentType.ANDROID_BOX]: 'กล่องแอนดรอยด์ (Android Box)',
  [EquipmentType.SPLITTER]: 'สปริตเตอร์ (Splitter 4 Output)',
  [EquipmentType.TIMER]: 'ตัวตั้งเวลา (Timer)',
  [EquipmentType.EQUIPMENT_BOX]: 'กล่องเก็บอุปกรณ์',
  [EquipmentType.HDMI_CABLE]: 'สาย HDMI 5-30 เมตร',
  [EquipmentType.LAN_CABLE]: 'สาย LAN 5-30 เมตร',
  [EquipmentType.POWER_CABLE]: 'สายไฟ',
  [EquipmentType.OTHER]: 'อื่นๆ'
};

const STATUS_CONFIG = {
  [EquipmentStatus.AVAILABLE]: { label: 'พร้อมใช้งาน', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  [EquipmentStatus.INSTALLED]: { label: 'ใช้งานปกติ', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  [EquipmentStatus.WAITING_PURCHASE]: { label: 'รอจัดซื้อ', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Clock },
  [EquipmentStatus.IN_REPAIR]: { label: 'ส่งซ่อม', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Wrench },
  [EquipmentStatus.BROKEN]: { label: 'ชำรุด', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  [EquipmentStatus.LOST]: { label: 'สูญหาย', color: 'bg-slate-200 text-slate-700 border-slate-300', icon: AlertTriangle },
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, textColor }) => (
  <div className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between ${color}`}>
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-wider opacity-80 ${textColor}`}>{label}</p>
      <h3 className={`text-2xl font-black ${textColor}`}>{value}</h3>
    </div>
    <div className={`p-3 rounded-xl bg-white/60 ${textColor}`}>
      <Icon size={20} />
    </div>
  </div>
);

export const EquipmentManager: React.FC<EquipmentManagerProps> = ({ 
  currentUser, 
  equipmentList, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onLocateEquipment,
  isLoading = false
}) => {
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<EquipmentType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<EquipmentStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Long Press State
  const [longPressId, setLongPressId] = useState<string | null>(null);
  const deleteTimerRef = useRef<any>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Equipment>>({});

  // Warranty Check Logic
  const checkWarranty = (expireDate: string) => {
    const today = new Date();
    const expire = new Date(expireDate);
    const diffTime = expire.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'EXPIRED', days: Math.abs(diffDays) };
    if (diffDays <= 30) return { status: 'WARNING', days: diffDays };
    return { status: 'OK', days: diffDays };
  };

  // Stats
  const stats = useMemo(() => {
    const total = equipmentList.length;
    const warning = equipmentList.filter(e => {
       const w = checkWarranty(e.warrantyExpireDate);
       return w.status === 'WARNING' || w.status === 'EXPIRED';
    }).length;
    const repair = equipmentList.filter(e => e.status === EquipmentStatus.IN_REPAIR).length;
    const broken = equipmentList.filter(e => e.status === EquipmentStatus.BROKEN).length;
    const waiting = equipmentList.filter(e => e.status === EquipmentStatus.WAITING_PURCHASE).length;

    return { total, warning, repair, broken, waiting };
  }, [equipmentList]);

  // Grouping by Folder (Location)
  const folders = useMemo(() => {
    const groups: Record<string, Equipment[]> = {};
    equipmentList.forEach(item => {
      const loc = item.location ? item.location.trim() : 'ไม่ระบุตำแหน่ง';
      if (!groups[loc]) groups[loc] = [];
      groups[loc].push(item);
    });
    return groups;
  }, [equipmentList]);

  // Handlers
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      type: EquipmentType.TV_SCREEN,
      status: EquipmentStatus.AVAILABLE,
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpireDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      isOnline: true // Default
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  // Long Press Delete Logic
  const handleStartDelete = (id: string) => {
    setLongPressId(id);
    deleteTimerRef.current = setTimeout(() => {
        onDelete(id);
        setLongPressId(null);
    }, 2000); // 2 seconds delay
  };

  const handleCancelDelete = () => {
    if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
        deleteTimerRef.current = null;
    }
    setLongPressId(null);
  };

  const handleSaveForm = () => {
    if (!formData.name || !formData.type || !formData.status) {
      alert('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน');
      return;
    }

    if (editingItem) {
      // Update
      onUpdate({ ...editingItem, ...formData } as Equipment);
    } else {
      // Create
      const newItem: Equipment = {
        ...formData as Equipment,
        id: `EQ-${Date.now()}`,
        serialNumber: formData.serialNumber || 'N/A'
      };
      onAdd(newItem);
    }
    setIsModalOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Use the service to upload
        const imageUrl = await equipmentService.uploadImage(file);
        setFormData(prev => ({ ...prev, imageUrl }));
      } catch (error) {
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleMapClick = (e: React.MouseEvent, item: Equipment) => {
    e.stopPropagation();
    onLocateEquipment(item);
  };

  // Toggle Online Status Function
  const toggleOnlineStatus = (e: React.MouseEvent, item: Equipment) => {
    e.stopPropagation();
    onUpdate({ ...item, isOnline: !item.isOnline });
  };

  const filteredList = equipmentList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    
    // If in folder view and a folder is active, filter by that location
    const matchesFolder = viewMode === 'FOLDER' && activeFolder ? item.location === activeFolder : true;
    
    return matchesSearch && matchesType && matchesStatus && matchesFolder;
  });

  return (
    <div className="bg-slate-50 min-h-screen p-6 pb-20 relative">
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-[2px] z-[5000] flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center">
                <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                <span className="text-slate-600 font-bold animate-pulse">Syncing Database...</span>
            </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Wrench className="text-indigo-600" size={32} />
              ระบบตรวจสอบอุปกรณ์ (Backend Connected)
            </h1>
            <p className="text-slate-500 mt-1">จัดการสต๊อก แจ้งเตือนประกัน และสถานะการซ่อมบำรุง</p>
          </div>
          <button onClick={handleAddNew} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Plus size={20} /> เพิ่มอุปกรณ์ใหม่
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
           <StatCard label="อุปกรณ์ทั้งหมด" value={stats.total} icon={FileText} color="bg-white border-slate-200" textColor="text-slate-900" />
           <StatCard label="แจ้งเตือนประกัน" value={stats.warning} icon={AlertTriangle} color="bg-amber-50 border-amber-100" textColor="text-amber-600" />
           <StatCard label="ส่งซ่อม" value={stats.repair} icon={Wrench} color="bg-orange-50 border-orange-100" textColor="text-orange-600" />
           <StatCard label="ชำรุด/เสียหาย" value={stats.broken} icon={XCircle} color="bg-red-50 border-red-100" textColor="text-red-600" />
           <StatCard label="รอจัดซื้อ" value={stats.waiting} icon={Clock} color="bg-purple-50 border-purple-100" textColor="text-purple-600" />
        </div>

        {/* Filters & View Toggle */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="flex flex-col md:flex-row gap-4 flex-grow w-full">
               <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="ค้นหาชื่อ, หมายเลขเครื่อง, สถานที่..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                  <select 
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-700 min-w-[150px]"
                    value={filterType}
                    onChange={e => setFilterType(e.target.value as any)}
                  >
                     <option value="ALL">ทุกประเภทอุปกรณ์</option>
                     {Object.values(EquipmentType).map(t => (
                       <option key={t} value={t}>{EQUIPMENT_TYPE_LABELS[t]}</option>
                     ))}
                  </select>
                  <select 
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-700 min-w-[150px]"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as any)}
                  >
                     <option value="ALL">ทุกสถานะ</option>
                     {Object.values(EquipmentStatus).map(s => (
                       <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                     ))}
                  </select>
               </div>
           </div>
           
           {/* View Toggles */}
           <div className="flex bg-slate-100 p-1 rounded-xl flex-shrink-0">
              <button 
                onClick={() => { setViewMode('FOLDER'); setActiveFolder(null); }} 
                className={`p-2 rounded-lg transition-all ${viewMode === 'FOLDER' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="มุมมองโฟลเดอร์"
              >
                <Folder size={20} />
              </button>
              <button 
                onClick={() => { setViewMode('GRID'); setActiveFolder(null); }} 
                className={`p-2 rounded-lg transition-all ${viewMode === 'GRID' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="มุมมองการ์ด"
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => { setViewMode('LIST'); setActiveFolder(null); }} 
                className={`p-2 rounded-lg transition-all ${viewMode === 'LIST' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="มุมมองรายการ"
              >
                <List size={20} />
              </button>
           </div>
        </div>

        {/* --- FOLDER VIEW --- */}
        {viewMode === 'FOLDER' && !activeFolder && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
             {Object.keys(folders).map(folderName => (
               <div 
                  key={folderName}
                  onClick={() => setActiveFolder(folderName)}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg cursor-pointer transition-all group relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                     <FolderOpen size={100} />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Folder size={28} />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{folderName}</h3>
                        <span className="text-xs text-slate-500 font-medium">{folders[folderName].length} รายการ</span>
                     </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-indigo-500 gap-1 mt-2">
                     เปิดดูรายการ <ArrowRight size={14}/>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* --- GRID VIEW & ACTIVE FOLDER VIEW --- */}
        {(viewMode === 'GRID' || activeFolder) && (
          <div className="space-y-4">
            {activeFolder && (
              <div className="flex items-center gap-2 mb-4">
                 <button onClick={() => setActiveFolder(null)} className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-sm font-bold">
                    <Folder size={16}/> โฟลเดอร์ทั้งหมด
                 </button>
                 <ArrowRight size={14} className="text-slate-300"/>
                 <span className="text-slate-900 font-bold">{activeFolder}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredList.map(item => {
                const warranty = checkWarranty(item.warrantyExpireDate);
                const StatusIcon = STATUS_CONFIG[item.status].icon;
                
                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full relative">
                     <div className="h-48 bg-slate-100 relative overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={48} />
                          </div>
                        )}
                        
                        {/* Online/Offline Indicator (Top Left) */}
                        <button 
                            onClick={(e) => toggleOnlineStatus(e, item)}
                            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-10 border border-slate-100"
                            title={item.isOnline ? 'สถานะ: ออนไลน์ (กดเพื่อเปลี่ยน)' : 'สถานะ: ออฟไลน์ (กดเพื่อเปลี่ยน)'}
                        >
                            <div className="relative flex h-3 w-3">
                                {item.isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${item.isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            </div>
                        </button>

                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm border ${STATUS_CONFIG[item.status].color}`}>
                           <StatusIcon size={12} />
                           {STATUS_CONFIG[item.status].label}
                        </div>
                        {warranty.status !== 'OK' && (
                           <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1 ${warranty.status === 'EXPIRED' ? 'bg-red-500 text-white' : 'bg-amber-400 text-slate-900'}`}>
                              <AlertTriangle size={12} />
                              {warranty.status === 'EXPIRED' ? `หมดประกัน (${warranty.days} วัน)` : `เหลือประกัน ${warranty.days} วัน`}
                           </div>
                        )}
                     </div>
                     
                     <div className="p-5 flex flex-col flex-grow">
                        <div className="mb-1 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{EQUIPMENT_TYPE_LABELS[item.type]}</div>
                        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{item.name}</h3>
                        
                        <div className="space-y-2 text-sm text-slate-500 mb-4 flex-grow">
                           <div className="flex items-center gap-2"><FileText size={14}/> <span className="truncate">{item.serialNumber || '-'}</span></div>
                           <div className="flex items-center gap-2 group/loc">
                             <MapPin size={14} className="group-hover/loc:text-indigo-600 transition-colors"/> 
                             <span className="truncate flex-grow">{item.location || 'ไม่ระบุตำแหน่ง'}</span>
                             {(item.lat && item.lng) || !item.lat ? (
                               <button 
                                 onClick={(e) => handleMapClick(e, item)}
                                 className="opacity-0 group-hover/loc:opacity-100 p-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-all"
                                 title="ดู/แก้ไข บนแผนที่"
                               >
                                 <Map size={12}/>
                               </button>
                             ) : null}
                           </div>
                           <div className="flex items-center gap-2"><Calendar size={14}/> <span>หมดประกัน: {new Date(item.warrantyExpireDate).toLocaleDateString('th-TH')}</span></div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                           <button onClick={() => handleEdit(item)} className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={18}/></button>
                           {/* Long Press Delete Button */}
                           <button 
                               onMouseDown={() => handleStartDelete(item.id)}
                               onMouseUp={handleCancelDelete}
                               onMouseLeave={handleCancelDelete}
                               onTouchStart={() => handleStartDelete(item.id)}
                               onTouchEnd={handleCancelDelete}
                               className="relative p-2 rounded-lg overflow-hidden group/delete transition-colors hover:bg-red-50 text-slate-400 hover:text-red-600"
                               title="กดค้าง 2 วินาทีเพื่อลบ"
                           >
                               <div className={`absolute inset-0 bg-red-100 origin-left transition-transform duration-[2000ms] ease-linear ${longPressId === item.id ? 'scale-x-100' : 'scale-x-0'}`}></div>
                               <Trash2 size={18} className={`relative z-10 transition-colors ${longPressId === item.id ? 'text-red-600' : ''}`}/>
                           </button>
                        </div>
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- LIST VIEW --- */}
        {viewMode === 'LIST' && (
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-fadeIn">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Online</th>
                          <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">อุปกรณ์</th>
                          <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">ประเภท</th>
                          <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Serial No.</th>
                          <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">สถานะ</th>
                          <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">สถานที่</th>
                          <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">จัดการ</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {filteredList.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                             <td className="p-4 text-center w-16">
                                <button 
                                    onClick={(e) => toggleOnlineStatus(e, item)}
                                    className="relative flex h-3 w-3 mx-auto"
                                    title={item.isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
                                >
                                    {item.isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${item.isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                </button>
                             </td>
                             <td className="p-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                      {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon size={20} className="m-auto mt-2.5 text-slate-300"/>}
                                   </div>
                                   <div>
                                      <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                                      <div className="text-[10px] text-slate-400">{item.id}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="p-4 text-sm text-slate-600">{EQUIPMENT_TYPE_LABELS[item.type]}</td>
                             <td className="p-4 text-sm text-slate-500 font-mono">{item.serialNumber}</td>
                             <td className="p-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${STATUS_CONFIG[item.status].color}`}>
                                   {STATUS_CONFIG[item.status].label}
                                </span>
                             </td>
                             <td className="p-4 text-sm text-slate-600">
                                <div className="flex items-center gap-2 group/listloc">
                                   <span>{item.location}</span>
                                   <button 
                                      onClick={(e) => handleMapClick(e, item)}
                                      className="opacity-0 group-hover/listloc:opacity-100 text-indigo-500 hover:text-indigo-700 transition-opacity" 
                                      title="ดูบนแผนที่"
                                   >
                                      <Map size={14}/>
                                   </button>
                                </div>
                             </td>
                             <td className="p-4 text-right">
                                <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit size={16}/></button>
                                {/* Long Press Delete Button for List */}
                                <button 
                                   onMouseDown={() => handleStartDelete(item.id)}
                                   onMouseUp={handleCancelDelete}
                                   onMouseLeave={handleCancelDelete}
                                   onTouchStart={() => handleStartDelete(item.id)}
                                   onTouchEnd={handleCancelDelete}
                                   className="relative p-2 rounded-lg overflow-hidden group/delete transition-colors inline-block align-middle ml-2 hover:bg-red-50 text-slate-400 hover:text-red-600"
                                   title="กดค้าง 2 วินาทีเพื่อลบ"
                                >
                                   <div className={`absolute inset-0 bg-red-100 origin-left transition-transform duration-[2000ms] ease-linear ${longPressId === item.id ? 'scale-x-100' : 'scale-x-0'}`}></div>
                                   <Trash2 size={16} className={`relative z-10 transition-colors ${longPressId === item.id ? 'text-red-600' : ''}`}/>
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
        
        {/* Empty state etc... same as before */}
        {filteredList.length === 0 && (
          <div className="text-center py-20 text-slate-400">
             <Filter size={48} className="mx-auto mb-4 opacity-50" />
             <p>ไม่พบรายการอุปกรณ์ตามเงื่อนไข</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                 <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {editingItem ? <Edit size={20} className="text-indigo-600"/> : <Plus size={20} className="text-indigo-600"/>}
                    {editingItem ? 'แก้ไขข้อมูลอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่'}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              
              <div className="p-6 space-y-6">
                 {/* Image Upload */}
                 <div className="flex justify-center">
                    <div className="relative group cursor-pointer w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all">
                       {isUploading ? (
                          <div className="flex flex-col items-center text-indigo-500">
                             <Loader2 size={32} className="mb-2 animate-spin"/>
                             <span className="text-xs font-bold uppercase tracking-wider">Uploading...</span>
                          </div>
                       ) : formData.imageUrl ? (
                          <img src={formData.imageUrl} className="w-full h-full object-cover" />
                       ) : (
                          <div className="flex flex-col items-center text-slate-400">
                             <Upload size={32} className="mb-2 group-hover:text-indigo-500" />
                             <span className="text-xs font-bold uppercase tracking-wider group-hover:text-indigo-500">อัปโหลดรูปภาพ</span>
                          </div>
                       )}
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-900 uppercase">ชื่ออุปกรณ์</label>
                       <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="ระบุชื่อรุ่น/ยี่ห้อ" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-900 uppercase">หมายเลขเครื่อง (Serial No.)</label>
                       <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.serialNumber || ''} onChange={e => setFormData({...formData, serialNumber: e.target.value})} placeholder="SN-XXXXX" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-900 uppercase">ประเภท</label>
                       <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as EquipmentType})}>
                          {Object.values(EquipmentType).map(t => (
                             <option key={t} value={t}>{EQUIPMENT_TYPE_LABELS[t]}</option>
                          ))}
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-900 uppercase">สถานะ</label>
                       <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as EquipmentStatus})}>
                          {Object.values(EquipmentStatus).map(s => (
                             <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                          ))}
                       </select>
                    </div>
                    
                    {/* New: Online Status Toggle in Modal */}
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-900 uppercase">สถานะการเชื่อมต่อ (Online Status)</label>
                       <div className="flex items-center gap-3 h-[50px]">
                           <button 
                              onClick={() => setFormData({ ...formData, isOnline: !formData.isOnline })}
                              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${formData.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}
                           >
                              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${formData.isOnline ? 'translate-x-6' : 'translate-x-0'}`}></div>
                           </button>
                           <span className={`text-sm font-bold ${formData.isOnline ? 'text-emerald-600' : 'text-slate-500'}`}>
                              {formData.isOnline ? 'Online' : 'Offline'}
                           </span>
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-900 uppercase">วันที่ซื้อ</label>
                       <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-900 uppercase">วันหมดประกัน</label>
                       <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.warrantyExpireDate} onChange={e => setFormData({...formData, warrantyExpireDate: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                       <label className="text-xs font-bold text-slate-900 uppercase">สถานที่ติดตั้ง / เก็บ</label>
                       <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="เช่น ท่าเรือสาทร, คลัง A" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                       <label className="text-xs font-bold text-slate-900 uppercase">รายละเอียดเพิ่มเติม / หมายเหตุ</label>
                       <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 h-24 text-slate-900 font-medium" value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="รายละเอียดเพิ่มเติม..." ></textarea>
                    </div>
                 </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 sticky bottom-0 rounded-b-3xl">
                 <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors">ยกเลิก</button>
                 <button onClick={handleSaveForm} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Save size={18} /> บันทึกข้อมูล
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
