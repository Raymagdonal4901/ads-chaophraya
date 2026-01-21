import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Equipment, EquipmentStatus, EquipmentType, SimCard, SimCardStatus
} from '../types';
import {
  Search, Plus, AlertTriangle, CheckCircle, Clock, Wrench, XCircle,
  Filter, FileText, Image as ImageIcon, Calendar, MapPin, Save, Trash2, Edit, Upload, X,
  LayoutGrid, List, Folder, Map, ArrowRight, FolderOpen, Power, Loader2, ScanLine, QrCode, Download, Crosshair, Smartphone, Package
} from 'lucide-react';
import { equipmentService } from '../services/equipmentService';
import { simCardService, getSimStatusLabel, getSimStatusColor } from '../services/simCardService';

declare global {
  interface Window {
    L: any;
  }
}

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
  [EquipmentType.ROUTER_4G]: 'Router 4G',
  [EquipmentType.SIM_AIS]: 'SIM AIS',
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

  // Scanner & QR States
  const [isScanning, setIsScanning] = useState(false);
  const [qrModalItem, setQrModalItem] = useState<Equipment | null>(null);
  const [scanResultItem, setScanResultItem] = useState<Equipment | null>(null);
  const [qrFolderName, setQrFolderName] = useState<string | null>(null);

  // Image Viewer State
  const [viewImage, setViewImage] = useState<{ images: string[], index: number } | null>(null);

  // Folder Management States
  const [emptyFolders, setEmptyFolders] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('equipment_empty_folders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [deleteFolderConfirm, setDeleteFolderConfirm] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);

  // Map Picker States
  const [showMapPicker, setShowMapPicker] = useState(false);
  const pickerMapContainerRef = useRef<HTMLDivElement>(null);
  const pickerMapInstanceRef = useRef<any>(null);
  const pickerMarkerRef = useRef<any>(null);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [isSearchingMap, setIsSearchingMap] = useState(false);

  // Long Press State
  const [longPressId, setLongPressId] = useState<string | null>(null);
  const deleteTimerRef = useRef<any>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Equipment>>({});

  // SIM Card States
  const [simCards, setSimCards] = useState<SimCard[]>([]);
  const [isSimLoading, setIsSimLoading] = useState(false);
  const [showSimModal, setShowSimModal] = useState(false);
  const [editingSim, setEditingSim] = useState<SimCard | null>(null);
  const [simFormData, setSimFormData] = useState<Partial<SimCard>>({
    phoneNumber: '',
    status: 'ACTIVE',
    location: '',
    notes: ''
  });
  const [showSimSection, setShowSimSection] = useState(false);

  // Load SIM Cards
  useEffect(() => {
    const loadSimCards = async () => {
      setIsSimLoading(true);
      try {
        const data = await simCardService.getAll();
        setSimCards(data);
      } catch (error) {
        console.error('Failed to load SIM cards:', error);
      } finally {
        setIsSimLoading(false);
      }
    };
    loadSimCards();
  }, []);

  // SIM Card Handlers
  const handleAddSim = () => {
    setEditingSim(null);
    setSimFormData({ phoneNumber: '', status: 'ACTIVE', location: '', notes: '' });
    setShowSimModal(true);
  };

  const handleEditSim = (sim: SimCard) => {
    setEditingSim(sim);
    setSimFormData({ ...sim });
    setShowSimModal(true);
  };

  const handleSaveSim = async () => {
    if (!simFormData.phoneNumber) {
      alert('กรุณากรอกเบอร์โทรศัพท์');
      return;
    }

    setIsSimLoading(true);
    try {
      if (editingSim) {
        const updated = await simCardService.update({ ...editingSim, ...simFormData } as SimCard);
        setSimCards(prev => prev.map(s => s.id === updated.id ? updated : s));
      } else {
        const created = await simCardService.create(simFormData as Omit<SimCard, 'id' | 'createdAt' | 'updatedAt'>);
        setSimCards(prev => [...prev, created]);
      }
      setShowSimModal(false);
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setIsSimLoading(false);
    }
  };

  const handleDeleteSim = async (id: string) => {
    if (!confirm('ต้องการลบ SIM นี้หรือไม่?')) return;

    setIsSimLoading(true);
    try {
      await simCardService.delete(id);
      setSimCards(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบ');
    } finally {
      setIsSimLoading(false);
    }
  };

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
  const [showStockStats, setShowStockStats] = useState(false);

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

  const stockStats = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(EquipmentType).forEach(type => {
      counts[type] = 0;
    });

    equipmentList.forEach(item => {
      if (counts[item.type] !== undefined) {
        counts[item.type]++;
      }
    });

    return counts;
  }, [equipmentList]);

  // Grouping by Folder (Location) - includes empty folders
  const folders = useMemo(() => {
    const groups: Record<string, Equipment[]> = {};
    // Add empty folders first
    emptyFolders.forEach(folderName => {
      if (!groups[folderName]) groups[folderName] = [];
    });
    // Then add equipment-based folders
    equipmentList.forEach(item => {
      const loc = item.location ? item.location.trim() : 'ไม่ระบุตำแหน่ง';
      if (!groups[loc]) groups[loc] = [];
      groups[loc].push(item);
    });
    return groups;
  }, [equipmentList, emptyFolders]);

  // Sort items for QR View (Purchase Date -> Warranty Expiry -> Days Remaining)
  const sortedQrItems = useMemo(() => {
    if (!qrFolderName || !folders[qrFolderName]) return [];
    return [...folders[qrFolderName]].sort((a, b) => {
      // 1. Purchase Date (Ascending)
      const pA = new Date(a.purchaseDate).getTime();
      const pB = new Date(b.purchaseDate).getTime();
      if (pA !== pB) return pA - pB;

      // 2. Warranty Expiry (Ascending)
      const wA = new Date(a.warrantyExpireDate).getTime();
      const wB = new Date(b.warrantyExpireDate).getTime();
      if (wA !== wB) return wA - wB;

      // 3. Days Remaining (Ascending)
      const daysA = checkWarranty(a.warrantyExpireDate).days;
      const daysB = checkWarranty(b.warrantyExpireDate).days;
      return daysA - daysB;
    });
  }, [folders, qrFolderName]);

  // Persist empty folders
  useEffect(() => {
    localStorage.setItem('equipment_empty_folders', JSON.stringify(emptyFolders));
  }, [emptyFolders]);

  // Initialize Map Picker
  useEffect(() => {
    if (showMapPicker && pickerMapContainerRef.current && !pickerMapInstanceRef.current && window.L) {
      // Default center (Bangkok) or current selection
      const initialLat = formData.lat || 13.7563;
      const initialLng = formData.lng || 100.5018;

      const map = window.L.map(pickerMapContainerRef.current, { zoomControl: false }).setView([initialLat, initialLng], 13);

      window.L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 20
      }).addTo(map);

      if (formData.lat && formData.lng) {
        pickerMarkerRef.current = window.L.marker([formData.lat, formData.lng], {
          icon: window.L.divIcon({
            className: 'custom-pin',
            html: '<div style="background-color:#4f46e5;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }).addTo(map);
        map.setView([formData.lat, formData.lng], 16);
      }

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        setFormData(prev => ({ ...prev, lat, lng }));

        if (pickerMarkerRef.current) {
          pickerMarkerRef.current.setLatLng([lat, lng]);
        } else {
          pickerMarkerRef.current = window.L.marker([lat, lng], {
            icon: window.L.divIcon({
              className: 'custom-pin',
              html: '<div style="background-color:#4f46e5;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })
          }).addTo(map);
        }
      });

      pickerMapInstanceRef.current = map;
    }
  }, [showMapPicker]);

  const closeMapPicker = () => {
    if (pickerMapInstanceRef.current) {
      pickerMapInstanceRef.current.remove();
      pickerMapInstanceRef.current = null;
      pickerMarkerRef.current = null;
    }
    setShowMapPicker(false);
  };

  const handleSearchLocation = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!mapSearchQuery.trim()) return;

    setIsSearchingMap(true);
    try {
      // Use OSM Nominatim for searching real places
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);

        setFormData(prev => ({ ...prev, lat: newLat, lng: newLng }));

        if (pickerMapInstanceRef.current && window.L) {
          const map = pickerMapInstanceRef.current;
          map.setView([newLat, newLng], 16);

          if (pickerMarkerRef.current) {
            pickerMarkerRef.current.setLatLng([newLat, newLng]);
          } else {
            pickerMarkerRef.current = window.L.marker([newLat, newLng], {
              icon: window.L.divIcon({
                className: 'custom-pin',
                html: '<div style="background-color:#4f46e5;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })
            }).addTo(map);
          }
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



  // Handlers
  const handleAddNew = (presetLocation?: string) => {
    setEditingItem(null);
    setFormData({
      type: EquipmentType.TV_SCREEN,
      status: EquipmentStatus.AVAILABLE,
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpireDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      isOnline: true, // Default
      location: presetLocation || '', // Pre-populate if adding to folder
      images: []
    });
    setIsModalOpen(true);
  };

  // Folder Handlers
  const handleCreateFolder = () => {
    const trimmedName = newFolderName.trim();
    if (!trimmedName) {
      alert('กรุณาระบุชื่อโฟลเดอร์');
      return;
    }
    if (folders[trimmedName]) {
      alert('โฟลเดอร์นี้มีอยู่แล้ว');
      return;
    }
    setEmptyFolders(prev => [...prev, trimmedName]);
    setNewFolderName('');
    setShowCreateFolderModal(false);
  };

  const handleDeleteFolder = (folderName: string) => {
    const itemsInFolder = folders[folderName] || [];

    if (itemsInFolder.length > 0) {
      // Move all items to "ไม่ระบุตำแหน่ง" 
      itemsInFolder.forEach(item => {
        onUpdate({ ...item, location: '' });
      });
    }

    // Remove from empty folders if exists
    setEmptyFolders(prev => prev.filter(f => f !== folderName));
    setDeleteFolderConfirm(null);

    // If currently inside the deleted folder, go back
    if (activeFolder === folderName) {
      setActiveFolder(null);
    }
  };

  const handleEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormData({
      ...item,
      images: item.images || (item.imageUrl ? [item.imageUrl] : [])
    });
    setIsModalOpen(true);
  };

  const handleStartDelete = (id: string) => {
    setLongPressId(id);
    deleteTimerRef.current = setTimeout(() => {
      onDelete(id);
      setLongPressId(null);
    }, 2000);
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
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        const newImages = [...(formData.images || [])];
        // Support uploading multiple files if the input allowed it, or just one
        for (let i = 0; i < files.length; i++) {
          const imageUrl = await equipmentService.uploadImage(files[i]);
          newImages.push(imageUrl);
        }

        setFormData(prev => ({
          ...prev,
          images: newImages,
          imageUrl: newImages[0] // Always update main thumb to first image
        }));
      } catch (error) {
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => {
      const currentImages = prev.images || [];
      const newImages = currentImages.filter((_, index) => index !== indexToRemove);
      return {
        ...prev,
        images: newImages,
        imageUrl: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
          // Optional: reverse geocode here to fill "location" text
        },
        (error) => {
          alert("Unable to retrieve location. Please check permission.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleMapClick = (e: React.MouseEvent, item: Equipment) => {
    e.stopPropagation();
    onLocateEquipment(item);
  };

  const toggleOnlineStatus = (e: React.MouseEvent, item: Equipment) => {
    e.stopPropagation();
    onUpdate({ ...item, isOnline: !item.isOnline });
  };



  const handleViewImages = (item: Equipment) => {
    const images = item.images && item.images.length > 0 ? item.images : (item.imageUrl ? [item.imageUrl] : []);
    if (images.length > 0) {
      setViewImage({ images, index: 0 });
    }
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (viewImage) {
      setViewImage(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
    }
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (viewImage) {
      setViewImage(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
    }
  };
  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch((err: any) => console.error(err));
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Initialize Scanner when isScanning becomes true
  useEffect(() => {
    if (isScanning) {
      setTimeout(() => {
        const Html5QrcodeScanner = (window as any).Html5QrcodeScanner;
        if (Html5QrcodeScanner) {
          const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
                    /* verbose= */ false
          );

          scanner.render(
            (decodedText: string) => {
              console.log(`Scan result: ${decodedText}`);
              const found = equipmentList.find(e =>
                e.id === decodedText ||
                e.serialNumber.toLowerCase() === decodedText.toLowerCase()
              );

              if (found) {
                setScanResultItem(found);
                stopScanning();
              } else {
                alert(`ไม่พบอุปกรณ์รหัส: ${decodedText} ในระบบ`);
              }
            },
            (errorMessage: any) => {
              // ignore errors
            }
          );
          scannerRef.current = scanner;
        } else {
          alert("Scanner library failed to load.");
          setIsScanning(false);
        }
      }, 300);
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err: any) => console.error(err));
      }
    };
  }, [isScanning, equipmentList]);

  const filteredList = equipmentList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchesFolder = viewMode === 'FOLDER' && activeFolder ? item.location === activeFolder : true;

    return matchesSearch && matchesType && matchesStatus && matchesFolder;
  });

  return (
    <div className="bg-slate-50 min-h-screen p-6 pb-20 relative">

      {isLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-[2px] z-[5000] flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center">
            <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
            <span className="text-slate-600 font-bold animate-pulse">Syncing Database...</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Wrench className="text-indigo-600" size={32} />
              ระบบตรวจสอบอุปกรณ์ (Backend Connected)
            </h1>
            <p className="text-slate-500 mt-1">จัดการสต๊อก แจ้งเตือนประกัน และสถานะการซ่อมบำรุง</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShowStockStats(!showStockStats)} className={`${showStockStats ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'} text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95`}>
              <Package size={20} /> สรุปสต๊อก
            </button>
            <button onClick={() => setShowSimSection(!showSimSection)} className={`${showSimSection ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-600'} text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95`}>
              <Smartphone size={20} /> จัดการ SIM ({simCards.length})
            </button>
            <button onClick={startScanning} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
              <ScanLine size={20} /> สแกน QR
            </button>
            <button onClick={() => handleAddNew()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
              <Plus size={20} /> เพิ่มอุปกรณ์ใหม่
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="อุปกรณ์ทั้งหมด" value={stats.total} icon={FileText} color="bg-white border-slate-200" textColor="text-slate-900" />
          <StatCard label="แจ้งเตือนประกัน" value={stats.warning} icon={AlertTriangle} color="bg-amber-50 border-amber-100" textColor="text-amber-600" />
          <StatCard label="ส่งซ่อม" value={stats.repair} icon={Wrench} color="bg-orange-50 border-orange-100" textColor="text-orange-600" />
          <StatCard label="ชำรุด/เสียหาย" value={stats.broken} icon={XCircle} color="bg-red-50 border-red-100" textColor="text-red-600" />
          <StatCard label="รอจัดซื้อ" value={stats.waiting} icon={Clock} color="bg-purple-50 border-purple-100" textColor="text-purple-600" />
        </div>

        {/* Stock Summary Section */}
        {showStockStats && (
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden animate-fadeIn">
            <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Package className="text-blue-600" size={24} />
                <div>
                  <h2 className="font-bold text-slate-900">สรุปจำนวนสต๊อกอุปกรณ์</h2>
                  <p className="text-xs text-slate-500">แยกตามประเภทอุปกรณ์</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.values(EquipmentType).map(type => (
                  <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-sm font-medium text-slate-600 truncate mr-2" title={EQUIPMENT_TYPE_LABELS[type]}>
                      {EQUIPMENT_TYPE_LABELS[type]}
                    </span>
                    <span className="text-lg font-black text-slate-900 bg-white px-3 py-1 rounded-lg shadow-sm min-w-[3rem] text-center">
                      {stockStats[type]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SIM Registration Section */}
        {showSimSection && (
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden animate-fadeIn">
            <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Smartphone className="text-emerald-600" size={24} />
                <div>
                  <h2 className="font-bold text-slate-900">ระบบลงทะเบียน SIM</h2>
                  <p className="text-xs text-slate-500">จัดการ SIM Card ทั้งหมด ({simCards.length} รายการ)</p>
                </div>
              </div>
              <button
                onClick={handleAddSim}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus size={18} /> เพิ่ม SIM ใหม่
              </button>
            </div>

            {isSimLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
              </div>
            ) : simCards.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Smartphone size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-bold">ยังไม่มี SIM ในระบบ</p>
                <p className="text-sm">กดปุ่ม "เพิ่ม SIM ใหม่" เพื่อเริ่มต้น</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left p-4 font-bold text-slate-700">เบอร์โทรศัพท์</th>
                      <th className="text-left p-4 font-bold text-slate-700">สถานะ</th>
                      <th className="text-left p-4 font-bold text-slate-700">สถานที่</th>
                      <th className="text-left p-4 font-bold text-slate-700">หมายเหตุ</th>
                      <th className="text-center p-4 font-bold text-slate-700">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simCards.map(sim => (
                      <tr key={sim.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-900">{sim.phoneNumber}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSimStatusColor(sim.status)}`}>
                            {getSimStatusLabel(sim.status)}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600">{sim.location || '-'}</td>
                        <td className="p-4 text-slate-500 truncate max-w-[200px]">{sim.notes || '-'}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditSim(sim)} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors" title="แก้ไข">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteSim(sim.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="ลบ">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SIM Modal */}
        {showSimModal && (
          <div className="fixed inset-0 z-[5000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-slideUp">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="text-emerald-600" size={24} />
                  {editingSim ? 'แก้ไข SIM' : 'เพิ่ม SIM ใหม่'}
                </h2>
                <button onClick={() => setShowSimModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase">เบอร์โทรศัพท์ *</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 font-mono font-medium"
                    placeholder="เช่น 08X-XXX-XXXX"
                    value={simFormData.phoneNumber || ''}
                    onChange={e => setSimFormData({ ...simFormData, phoneNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase">สถานะ</label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 font-medium"
                    value={simFormData.status || 'ACTIVE'}
                    onChange={e => setSimFormData({ ...simFormData, status: e.target.value as SimCardStatus })}
                  >
                    <option value="ACTIVE">ใช้งาน</option>
                    <option value="BROKEN">ชำรุด</option>
                    <option value="LOST">สูญหาย</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase">สถานที่</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 font-medium"
                    placeholder="เช่น ติดตั้งที่ท่าเรือสาทร"
                    value={simFormData.location || ''}
                    onChange={e => setSimFormData({ ...simFormData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase">หมายเหตุ</label>
                  <textarea
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 font-medium h-24"
                    placeholder="รายละเอียดเพิ่มเติม..."
                    value={simFormData.notes || ''}
                    onChange={e => setSimFormData({ ...simFormData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowSimModal(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                  ยกเลิก
                </button>
                <button onClick={handleSaveSim} disabled={isSimLoading} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSimLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

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

        {viewMode === 'FOLDER' && !activeFolder && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header with Create Folder Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-700">โฟลเดอร์ทั้งหมด ({Object.keys(folders).length})</h2>
              <button
                onClick={() => setShowCreateFolderModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
              >
                <Plus size={18} /> สร้างโฟลเดอร์ใหม่
              </button>
            </div>

            {/* Folder Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div className="flex-grow">
                      <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{folderName}</h3>
                      <span className="text-xs text-slate-500 font-medium">{folders[folderName].length} รายการ</span>
                    </div>
                    <div className="flex flex-col gap-1 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); setQrFolderName(folderName); }}
                        className="p-2 bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors"
                        title="ดู QR Code วันหมดประกันทั้งหมด"
                      >
                        <QrCode size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteFolderConfirm(folderName); }}
                        className="p-2 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                        title="ลบโฟลเดอร์"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-indigo-500 gap-1 mt-2">
                    เปิดดูรายการ <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(viewMode === 'GRID' || activeFolder) && (
          <div className="space-y-4">
            {activeFolder && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveFolder(null)} className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-sm font-bold">
                    <Folder size={16} /> โฟลเดอร์ทั้งหมด
                  </button>
                  <ArrowRight size={14} className="text-slate-300" />
                  <span className="text-slate-900 font-bold">{activeFolder}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQrFolderName(activeFolder)}
                    className="bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
                  >
                    <QrCode size={16} /> QR รวม
                  </button>
                  <button
                    onClick={() => handleAddNew(activeFolder)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                  >
                    <Plus size={16} /> เพิ่มอุปกรณ์ใน folder นี้
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredList.map(item => {
                const warranty = checkWarranty(item.warrantyExpireDate);
                const StatusIcon = STATUS_CONFIG[item.status].icon;

                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full relative">
                    <div
                      className="h-48 bg-slate-100 relative overflow-hidden group/image cursor-pointer"
                      onClick={() => handleViewImages(item)}
                    >
                      {item.imageUrl || (item.images && item.images.length > 0) ? (
                        <div className="w-full h-full relative">
                          <img src={item.imageUrl || (item.images ? item.images[0] : '')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {item.images && item.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                              +{item.images.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ImageIcon size={48} />
                        </div>
                      )}

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
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="mb-1 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{EQUIPMENT_TYPE_LABELS[item.type]}</div>
                      <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{item.name}</h3>

                      <div className="space-y-2 text-sm text-slate-500 mb-4 flex-grow">
                        <div className="flex items-center gap-2" title="วันที่ซื้อ"><Calendar size={14} /> <span className="truncate">{new Date(item.purchaseDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</span></div>
                        <div className="flex items-center gap-2 group/loc">
                          <MapPin size={14} className="group-hover/loc:text-indigo-600 transition-colors" />
                          <span className="truncate flex-grow">{item.location || 'ไม่ระบุตำแหน่ง'}</span>
                          {(item.lat && item.lng) || !item.lat ? (
                            <button
                              onClick={(e) => handleMapClick(e, item)}
                              className="opacity-0 group-hover/loc:opacity-100 p-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-all"
                              title="ดู/แก้ไข บนแผนที่"
                            >
                              <Map size={12} />
                            </button>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {item.noWarranty ? (
                            <span className="text-amber-600 font-bold">ไม่มีประกัน</span>
                          ) : (
                            <span>ติดตั้ง: {item.installationDate ? new Date(item.installationDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-'}</span>
                          )}
                        </div>
                      </div>

                      {/* Warranty Card Logic */}
                      <div className="mb-4">
                        {warranty.status !== 'OK' && (
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${warranty.status === 'EXPIRED' ? 'bg-red-500 text-white' : 'bg-amber-400 text-slate-900'}`}>
                            <AlertTriangle size={14} />
                            <span>{warranty.status === 'EXPIRED' ? `หมดประกัน (${warranty.days} วัน)` : `เหลือประกัน ${warranty.days} วัน`}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                        <button onClick={() => handleEdit(item)} className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={18} /></button>
                        <button onClick={() => setQrModalItem(item)} className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-colors"><QrCode size={18} /></button>
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
                          <Trash2 size={18} className={`relative z-10 transition-colors ${longPressId === item.id ? 'text-red-600' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">สถานะ / ประกัน</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">สถานที่</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map(item => {
                    const warranty = checkWarranty(item.warrantyExpireDate);
                    return (
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
                              {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="m-auto mt-2.5 text-slate-300" />}
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
                          <div className="flex flex-col items-start gap-1">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${STATUS_CONFIG[item.status].color}`}>
                              {STATUS_CONFIG[item.status].label}
                            </span>
                            {item.noWarranty ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold w-fit bg-amber-100 text-amber-700 border border-amber-200">
                                <AlertTriangle size={10} /> ไม่มีประกัน
                              </span>
                            ) : (
                              warranty.status !== 'OK' && (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold w-fit ${warranty.status === 'EXPIRED' ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                                  <AlertTriangle size={10} />
                                  {warranty.status === 'EXPIRED' ? `หมด (${warranty.days} วัน)` : `เหลือ ${warranty.days} วัน`}
                                </span>
                              )
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2 group/listloc">
                            <span>{item.location}</span>
                            <button
                              onClick={(e) => handleMapClick(e, item)}
                              className="opacity-0 group-hover/listloc:opacity-100 text-indigo-500 hover:text-indigo-700 transition-opacity"
                              title="ดูบนแผนที่"
                            >
                              <Map size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors inline-block align-middle"><Edit size={16} /></button>
                          <button onClick={() => setQrModalItem(item)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors inline-block align-middle ml-1"><QrCode size={16} /></button>
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
                            <Trash2 size={16} className={`relative z-10 transition-colors ${longPressId === item.id ? 'text-red-600' : ''}`} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredList.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Filter size={48} className="mx-auto mb-4 opacity-50" />
            <p>ไม่พบรายการอุปกรณ์ตามเงื่อนไข</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          {!showMapPicker ? (
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {editingItem ? <Edit size={20} className="text-indigo-600" /> : <Plus size={20} className="text-indigo-600" />}
                  {editingItem ? 'แก้ไขข้อมูลอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase mb-2 block">รูปภาพประกอบ ({formData.images?.length || 0})</label>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {formData.images?.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <div className="relative group cursor-pointer aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all">
                      {isUploading ? (
                        <div className="flex flex-col items-center text-indigo-500">
                          <Loader2 size={24} className="mb-1 animate-spin" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          <Upload size={24} className="mb-1 group-hover:text-indigo-500" />
                          <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-indigo-500">เพิ่มรูป</span>
                        </div>
                      )}
                      <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 uppercase">ชื่ออุปกรณ์</label>
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="ระบุชื่อรุ่น/ยี่ห้อ" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 uppercase">หมายเลขเครื่อง (Serial No.)</label>
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.serialNumber || ''} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} placeholder="SN-XXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 uppercase">ประเภท</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as EquipmentType })}>
                      {Object.values(EquipmentType).map(t => (
                        <option key={t} value={t}>{EQUIPMENT_TYPE_LABELS[t]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 uppercase">สถานะ</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as EquipmentStatus })}>
                      {Object.values(EquipmentStatus).map(s => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                      ))}
                    </select>
                  </div>

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
                    <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.purchaseDate} onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })} />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 uppercase">วันหมดประกัน</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.noWarranty || false}
                          onChange={e => setFormData({ ...formData, noWarranty: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-500">ไม่มีประกัน</span>
                      </label>
                    </div>
                    {!formData.noWarranty && (
                      <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.warrantyExpireDate} onChange={e => setFormData({ ...formData, warrantyExpireDate: e.target.value })} />
                    )}
                    {formData.noWarranty && (
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm font-bold">
                        ⚠️ สินค้านี้ไม่มีประกัน
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 uppercase">วันที่ติดตั้ง</label>
                    <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.installationDate || ''} onChange={e => setFormData({ ...formData, installationDate: e.target.value })} />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 uppercase">สถานที่ติดตั้ง / เก็บ</label>
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="เช่น ท่าเรือสาทร, คลัง A" />
                  </div>

                  {/* NEW: Map / GPS Coordinates Picker */}
                  <div className="md:col-span-2 space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
                      <MapPin size={14} /> พิกัดตำแหน่ง (GPS Location)
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-grow p-3 bg-slate-100 rounded-xl text-sm font-mono text-slate-600 border border-slate-200 flex items-center justify-between">
                        <span>{formData.lat && formData.lng ? `${formData.lat.toFixed(6)}, ${formData.lng.toFixed(6)}` : 'ยังไม่ได้ระบุพิกัด'}</span>
                        {formData.lat && <CheckCircle size={16} className="text-emerald-500" />}
                      </div>
                      <button
                        onClick={handleGetCurrentLocation}
                        className="p-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold hover:bg-emerald-200 transition-colors tooltip"
                        title="ดึงพิกัดปัจจุบัน"
                      >
                        <Crosshair size={20} />
                      </button>
                      <button
                        onClick={() => setShowMapPicker(true)}
                        className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                      >
                        <MapPin size={16} /> ปักหมุด
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 uppercase">รายละเอียดเพิ่มเติม / หมายเหตุ</label>
                    <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 h-24 text-slate-900 font-medium" value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="รายละเอียดเพิ่มเติม..." ></textarea>
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
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col animate-slideUp overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MapPin size={20} className="text-indigo-600" /> เลือกตำแหน่งบนแผนที่
                </h2>
                <button onClick={closeMapPicker} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <div className="flex-grow relative bg-slate-100">
                <div ref={pickerMapContainerRef} className="absolute inset-0 z-0"></div>

                {/* Map Search Overlay */}
                <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur shadow-lg rounded-xl p-2 pointer-events-auto flex items-center gap-2 max-w-md mx-auto w-full">
                    <Search size={20} className="text-slate-400 ml-2" />
                    <form onSubmit={handleSearchLocation} className="flex-grow flex items-center">
                      <input
                        type="text"
                        className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                        placeholder="ค้นหาสถานที่ (เช่น ไอคอนสยาม, ท่าเรือสาทร)..."
                        value={mapSearchQuery}
                        onChange={(e) => setMapSearchQuery(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={isSearchingMap}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isSearchingMap ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                      </button>
                    </form>
                  </div>
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-xs font-bold text-slate-600 border border-slate-200 mx-auto w-fit">
                    คลิกบนแผนที่เพื่อปรับตำแหน่งหมุด
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="text-sm">
                  <span className="text-slate-500 font-bold mr-2">Selected:</span>
                  <span className="font-mono font-bold text-indigo-600">
                    {formData.lat ? `${formData.lat.toFixed(5)}, ${formData.lng?.toFixed(5)}` : '-'}
                  </span>
                </div>
                <button onClick={closeMapPicker} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                  ยืนยันตำแหน่ง
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SCANNER OVERLAY --- */}
      {isScanning && (
        <div className="fixed inset-0 z-[6000] bg-black/90 flex flex-col items-center justify-center p-4">
          <button onClick={stopScanning} className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full hover:bg-white/20">
            <X size={32} />
          </button>
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden relative">
            <div id="reader" className="w-full"></div>
            <div className="p-6 text-center bg-slate-50">
              <p className="text-slate-600 font-bold mb-2">กำลังสแกน QR Code...</p>
              <p className="text-xs text-slate-400">วาง QR Code ให้อยู่ในกรอบสี่เหลี่ยม</p>
            </div>
          </div>
        </div>
      )}

      {/* --- QR CODE GENERATE MODAL with Simulate Button --- */}
      {qrModalItem && (
        <div className="fixed inset-0 z-[6002] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-slideUp w-full max-w-sm relative">
            <button onClick={() => setQrModalItem(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={24} /></button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">QR Code อุปกรณ์</h3>
              <p className="text-sm text-slate-500">{qrModalItem.name}</p>
            </div>


            <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm mb-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                  JSON.stringify({
                    id: qrModalItem.id,
                    name: qrModalItem.name,
                    serial: qrModalItem.serialNumber,
                    type: EQUIPMENT_TYPE_LABELS[qrModalItem.type],
                    status: STATUS_CONFIG[qrModalItem.status]?.label,
                    purchaseDate: qrModalItem.purchaseDate,
                    warrantyExpire: qrModalItem.noWarranty ? 'ไม่มีประกัน' : qrModalItem.warrantyExpireDate,
                    installationDate: qrModalItem.installationDate || '-',
                    location: qrModalItem.location || '-',
                    notes: qrModalItem.notes || '-'
                  })
                )}`}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>

            <div className="w-full space-y-3">
              <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">ID</span>
                <span className="font-mono font-bold text-slate-900">{qrModalItem.id}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">Serial No.</span>
                <span className="font-mono font-bold text-slate-900">{qrModalItem.serialNumber}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">ประเภท</span>
                <span className="font-bold text-slate-900">{EQUIPMENT_TYPE_LABELS[qrModalItem.type]}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">วันที่ซื้อ</span>
                <span className="font-bold text-slate-900">{new Date(qrModalItem.purchaseDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">วันที่ติดตั้ง</span>
                <span className="font-bold text-slate-900">{qrModalItem.installationDate ? new Date(qrModalItem.installationDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">สถานที่</span>
                <span className="font-bold text-slate-900">{qrModalItem.location || '-'}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500">วันหมดประกัน</span>
                <span className="font-bold text-slate-900">
                  {qrModalItem.noWarranty ? (
                    <span className="text-amber-600">ไม่มีประกัน</span>
                  ) : (
                    new Date(qrModalItem.warrantyExpireDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
                  )}
                </span>
              </div>
              {!qrModalItem.noWarranty && (() => {
                const w = checkWarranty(qrModalItem.warrantyExpireDate);
                if (w.status === 'OK') return null;
                const isExpired = w.status === 'EXPIRED';
                return (
                  <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${isExpired ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                    <AlertTriangle size={16} />
                    {isExpired ? `หมดประกันแล้ว ${w.days} วัน` : `เหลือประกัน ${w.days} วัน`}
                  </div>
                );
              })()}
            </div>

            <div className="mt-8 w-full">
              <button
                onClick={() => {
                  const itemToScan = qrModalItem;
                  setQrModalItem(null);
                  setScanResultItem(itemToScan);
                }}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <ScanLine size={18} /> จำลองการสแกน (Demo)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOLDER QR CODE MODAL (Combined Warranty) --- */}
      {qrFolderName && folders[qrFolderName] && (
        <div className="fixed inset-0 z-[6002] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-slideUp w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setQrFolderName(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={24} /></button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Folder size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">QR Code - {qrFolderName}</h3>
              <p className="text-sm text-slate-500 mt-1">{folders[qrFolderName].length} อุปกรณ์ในโฟลเดอร์นี้</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm mb-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                  (() => {
                    const items = sortedQrItems;
                    const lines = [
                      `📁 ${qrFolderName}`,
                      `อุปกรณ์: ${items.length} รายการ`,
                      `---`,
                      ...items.map((item, index) => {
                        const buyDate = new Date(item.purchaseDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
                        const installDate = item.installationDate ? new Date(item.installationDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-';
                        const warrantyStatus = item.noWarranty ? 'ไม่มีประกัน' : (() => {
                          const w = checkWarranty(item.warrantyExpireDate);
                          return w.status === 'EXPIRED' ? `หมด ${w.days}วัน` : `${w.days}วัน`;
                        })();
                        const statusEmoji = item.noWarranty ? '⚠️' : (() => {
                          const w = checkWarranty(item.warrantyExpireDate);
                          return w.status === 'EXPIRED' ? '❌' : w.status === 'WARNING' ? '⚠️' : '✅';
                        })();
                        return `${index + 1}. ${item.name} ติดตั้ง:${installDate} ${warrantyStatus} ${statusEmoji}`;
                      })
                    ];
                    return lines.join('\n');
                  })()
                )}`}
                alt="Folder QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            {/* Warranty Summary Cards */}
            <div className="w-full space-y-3 mb-6">
              {(() => {
                const items = folders[qrFolderName];
                const warrantyStats = {
                  expired: items.filter(i => checkWarranty(i.warrantyExpireDate).status === 'EXPIRED').length,
                  warning: items.filter(i => checkWarranty(i.warrantyExpireDate).status === 'WARNING').length,
                  ok: items.filter(i => checkWarranty(i.warrantyExpireDate).status === 'OK').length,
                };
                return (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                      <div className="text-xl font-black text-emerald-600">{warrantyStats.ok}</div>
                      <div className="text-[10px] font-bold text-emerald-500 uppercase">ปกติ</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                      <div className="text-xl font-black text-amber-600">{warrantyStats.warning}</div>
                      <div className="text-[10px] font-bold text-amber-500 uppercase">ใกล้หมด</div>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                      <div className="text-xl font-black text-red-600">{warrantyStats.expired}</div>
                      <div className="text-[10px] font-bold text-red-500 uppercase">หมดแล้ว</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Equipment List with Warranty */}
            <div className="w-full bg-slate-50 rounded-2xl p-4 space-y-2 max-h-60 overflow-y-auto">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">รายการอุปกรณ์ ({sortedQrItems.length})</h4>
              {sortedQrItems.map((item, index) => {
                const w = item.noWarranty ? null : checkWarranty(item.warrantyExpireDate);
                const buyDate = new Date(item.purchaseDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
                const installDate = item.installationDate ? new Date(item.installationDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

                return (
                  <div key={item.id} className="flex flex-col bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 overflow-hidden">
                        <span className="text-xs font-bold text-slate-400 min-w-[20px] mt-0.5">{index + 1}.</span>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate leading-tight">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.serialNumber}</p>
                        </div>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap ml-2 flex flex-col items-end ${item.noWarranty ? 'bg-amber-50 text-amber-600' :
                          w?.status === 'EXPIRED' ? 'bg-red-50 text-red-600' :
                            w?.status === 'WARNING' ? 'bg-amber-50 text-amber-600' :
                              'bg-emerald-50 text-emerald-600'
                        }`}>
                        <span>{installDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-8 text-[11px] text-slate-500 border-t border-slate-50 pt-2 mt-1">
                      <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded text-slate-600">
                        🛒 ซื้อ: <span className="font-bold">{buyDate}</span>
                      </span>
                      {item.noWarranty ? (
                        <span className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-600 font-bold">
                          ⚠️ ไม่มีประกัน
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded text-slate-600">
                          ⏳ เหลือ: <span className={`font-bold ${w?.status === 'EXPIRED' ? 'text-red-500' : w?.status === 'WARNING' ? 'text-amber-500' : 'text-emerald-500'}`}>{w?.days} วัน</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setQrFolderName(null)}
              className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
      {scanResultItem && (
        <div className="fixed inset-0 z-[6001] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-slideUp p-6">

            <div className="flex justify-between items-start mb-2">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${STATUS_CONFIG[scanResultItem.status].color}`}>
                {STATUS_CONFIG[scanResultItem.status].label}
              </span>
              <span className="text-slate-400 font-bold text-sm">{scanResultItem.serialNumber}</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-6">{scanResultItem.name}</h3>

            <div className="relative bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 overflow-hidden mb-8 shadow-inner">
              {(() => {
                const w = checkWarranty(scanResultItem.warrantyExpireDate);
                let bgClass = 'bg-emerald-500';
                let text = 'รับประกันปกติ';
                let icon = CheckCircle;

                if (w.status === 'EXPIRED') { bgClass = 'bg-red-500'; text = 'หมดอายุแล้ว'; icon = XCircle; }
                else if (w.status === 'WARNING') { bgClass = 'bg-amber-500'; text = 'ใกล้หมดอายุ'; icon = AlertTriangle; }

                const StatusIcon = icon;

                return (
                  <>
                    <div className={`absolute top-0 left-0 w-full h-1.5 ${bgClass}`}></div>
                    <p className="text-slate-400 text-xs font-bold mb-2">วันหมดอายุประกัน</p>
                    <h2 className="text-2xl font-black text-slate-900 mb-4">
                      {new Date(scanResultItem.warrantyExpireDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h2>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md ${bgClass}`}>
                      <StatusIcon size={14} /> {text} {w.status !== 'OK' && `(${w.days} วัน)`}
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setScanResultItem(null); handleEdit(scanResultItem); }} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 text-sm transition-colors">
                <Edit size={16} /> แก้ไขข้อมูล
              </button>
              <button onClick={() => setScanResultItem(null)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center text-sm transition-colors shadow-lg shadow-indigo-200">
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE FOLDER MODAL --- */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 z-[6003] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Folder className="text-indigo-600" size={24} /> สร้างโฟลเดอร์ใหม่
              </h3>
              <button onClick={() => { setShowCreateFolderModal(false); setNewFolderName(''); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 uppercase">ชื่อโฟลเดอร์</label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 font-medium"
                  placeholder="เช่น ท่าเรือสาทร, คลังสินค้า A"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowCreateFolderModal(false); setNewFolderName(''); }}
                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleCreateFolder}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                <Plus size={18} /> สร้าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE FOLDER CONFIRMATION MODAL --- */}
      {deleteFolderConfirm && (
        <div className="fixed inset-0 z-[6003] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">ลบโฟลเดอร์</h3>
              <p className="text-slate-600 text-sm">
                คุณต้องการลบโฟลเดอร์ "<span className="font-bold">{deleteFolderConfirm}</span>" ใช่ไหม?
              </p>
              {folders[deleteFolderConfirm]?.length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold">
                  <AlertTriangle size={14} className="inline-block mr-1" />
                  อุปกรณ์ {folders[deleteFolderConfirm].length} รายการในโฟลเดอร์นี้จะถูกย้ายไป "ไม่ระบุตำแหน่ง"
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteFolderConfirm(null)}
                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDeleteFolder(deleteFolderConfirm)}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> ลบ
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- IMAGE VIEWER MODAL --- */}
      {viewImage && (
        <div className="fixed inset-0 z-[7000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setViewImage(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50"
          >
            <X size={24} />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
            {viewImage.images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-0 p-4 text-white/50 hover:text-white hover:scale-110 transition-all z-40 outline-none"
              >
                <ArrowRight size={48} className="rotate-180" />
              </button>
            )}

            <img
              src={viewImage.images[viewImage.index]}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              alt="Full preview"
            />

            {viewImage.images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-0 p-4 text-white/50 hover:text-white hover:scale-110 transition-all z-40 outline-none"
              >
                <ArrowRight size={48} />
              </button>
            )}
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/10">
            {viewImage.index + 1} / {viewImage.images.length}
          </div>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2 no-scrollbar">
            {viewImage.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setViewImage(prev => prev ? { ...prev, index: idx } : null)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === viewImage.index ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
