
import React, { useState, useEffect } from 'react';
import { User, StoredUser, UserRole } from '../types';
import { Trash2, Edit, Plus, UserPlus, Save, X, User as UserIcon, Shield, Lock, CheckCircle } from 'lucide-react';

interface UserManagementProps {
  currentUser: User;
  onLogout: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUserUsername, setSelectedUserUsername] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('SALE');
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Load Users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const raw = localStorage.getItem('adspacenav_users_v2');
      if (raw) {
        setUsers(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveUsers = (newUsers: StoredUser[]) => {
    setUsers(newUsers);
    localStorage.setItem('adspacenav_users_v2', JSON.stringify(newUsers));
  };

  const resetForm = () => {
    setFormName('');
    setFormUsername('');
    setFormPassword('');
    setFormRole('SALE');
    setMsg(null);
    setIsEditing(false);
    setShowAddForm(false);
    setSelectedUserUsername(null);
  };

  const handleEditClick = (user: StoredUser) => {
    setFormName(user.name);
    setFormUsername(user.username);
    setFormPassword(user.password || '');
    setFormRole(user.role);
    setSelectedUserUsername(user.username);
    setIsEditing(true);
    setShowAddForm(true);
    setMsg(null);
  };

  const handleDeleteClick = (username: string) => {
    const isSelf = username === currentUser.username;
    
    if (confirm(isSelf 
        ? `คำเตือน: คุณกำลังจะลบบัญชีของคุณเอง (${username}) ระบบจะทำการออกจากระบบทันทีหลังจากลบ ยืนยันหรือไม่?` 
        : `ยืนยันการลบผู้ใช้ ${username}?`)) {
        
        const updated = users.filter(u => u.username !== username);
        saveUsers(updated);

        if (isSelf) {
            onLogout();
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!formName || !formUsername || !formPassword) {
        setMsg({type: 'error', text: 'กรุณากรอกข้อมูลให้ครบถ้วน'});
        return;
    }

    // Edit Existing
    if (isEditing && selectedUserUsername) {
        // Check if renaming username conflicts with others
        if (formUsername !== selectedUserUsername && users.some(u => u.username === formUsername)) {
            setMsg({type: 'error', text: 'ชื่อผู้ใช้งานนี้มีอยู่แล้ว'});
            return;
        }

        const updated = users.map(u => 
            u.username === selectedUserUsername 
            ? { ...u, name: formName, username: formUsername, password: formPassword, role: formRole }
            : u
        );
        saveUsers(updated);
        setMsg({type: 'success', text: 'บันทึกการแก้ไขสำเร็จ'});
        
        // If editing self, update displayed currentUser? (App state update requires more wiring, 
        // but typically user stays logged in with old token/state until refresh, or we could force logout. 
        // For now, simpler to just save.)
        
        setTimeout(resetForm, 1500);
    } 
    // Add New
    else {
        if (users.some(u => u.username === formUsername)) {
            setMsg({type: 'error', text: 'ชื่อผู้ใช้งานนี้มีอยู่แล้ว'});
            return;
        }

        const newUser: StoredUser = {
            name: formName,
            username: formUsername,
            password: formPassword,
            role: formRole
        };
        saveUsers([...users, newUser]);
        setMsg({type: 'success', text: 'เพิ่มผู้ใช้ใหม่สำเร็จ'});
        setTimeout(resetForm, 1500);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                    <UserIcon className="mr-3 w-8 h-8 text-indigo-600"/> จัดการผู้ใช้งาน
                </h1>
                <p className="text-slate-500 mt-1">เพิ่ม ลบ หรือแก้ไขข้อมูลผู้ใช้งานในระบบ</p>
            </div>
            
            {!showAddForm && (
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow hover:bg-indigo-700 transition-colors"
                >
                    <UserPlus size={18} className="mr-2" /> เพิ่มผู้ใช้ใหม่
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* User List */}
            <div className="md:col-span-2 space-y-4">
                {users.map((u) => (
                    <div key={u.username} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                                {u.role === 'ADMIN' ? <Shield size={24} /> : <UserIcon size={24} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{u.name}</h3>
                                <div className="flex items-center text-sm text-slate-500 space-x-2">
                                    <span>@{u.username}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="uppercase text-xs font-bold tracking-wider">{u.role}</span>
                                    {u.username === currentUser.username && (
                                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">คุณ</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleEditClick(u)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                title="แก้ไข"
                            >
                                <Edit size={18} />
                            </button>
                            <button 
                                onClick={() => handleDeleteClick(u.username)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="ลบ"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            {showAddForm && (
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 sticky top-24 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg text-slate-900">
                                {isEditing ? 'แก้ไขข้อมูล' : 'เพิ่มผู้ใช้ใหม่'}
                            </h2>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ใช้งาน (Username)</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formUsername}
                                    onChange={e => setFormUsername(e.target.value)}
                                    disabled={isEditing && formUsername === currentUser.username} // Can't rename own username
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="w-full border border-slate-300 rounded-lg p-2 pr-8 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formPassword}
                                        onChange={e => setFormPassword(e.target.value)}
                                        required
                                    />
                                    <Lock size={14} className="absolute right-3 top-3 text-slate-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ระดับสิทธิ์</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormRole('SALE')}
                                        className={`p-2 rounded border text-xs font-bold ${formRole === 'SALE' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}
                                    >
                                        SALE
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormRole('ADMIN')}
                                        className={`p-2 rounded border text-xs font-bold ${formRole === 'ADMIN' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}
                                    >
                                        ADMIN
                                    </button>
                                </div>
                            </div>

                            {msg && (
                                <div className={`text-sm p-2 rounded text-center flex items-center justify-center ${msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {msg.type === 'success' && <CheckCircle size={14} className="mr-1"/>}
                                    {msg.text}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                                <Save size={18} className="mr-2" /> บันทึก
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
