import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViewState, AdSpot, User, StoredUser, Equipment } from './types';
import { MOCK_AD_SPOTS } from './constants';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { MapExplorer } from './views/MapExplorer';
import { Insights } from './views/Insights';
import { AEDashboard } from './views/AEDashboard';
import { Login } from './views/Login';
import { UserManagement } from './views/UserManagement';
import { EquipmentManager } from './views/EquipmentManager';
import { SalesKit } from './views/SalesKit';
import { IntroScreen } from './views/IntroScreen';
import { equipmentService } from './services/equipmentService';
import { storageService, STORAGE_KEYS } from './services/storageService';

// ==================== UNDO/REDO HOOK ====================
const MAX_HISTORY = 20;

function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setHistory(prev => {
      const current = prev[currentIndex];
      const next = typeof newState === 'function'
        ? (newState as (prev: T) => T)(current)
        : newState;

      // Don't add if identical (shallow comparison for arrays)
      if (JSON.stringify(next) === JSON.stringify(current)) {
        return prev;
      }

      // Slice off any "future" states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(next);

      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
        return newHistory;
      }

      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [currentIndex]);

  const undo = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex(prev => Math.min(history.length - 1, prev + 1));
  }, [history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { state, setState, undo, redo, canUndo, canRedo };
}

// ==================== MAIN APP ====================

const App: React.FC = () => {
  // Intro State
  const [hasEntered, setHasEntered] = useState(false);

  // Auth State - Now with session persistence
  const [user, setUser] = useState<User | null>(() => {
    const session = storageService.getSession();
    if (session) {
      return {
        username: session.username,
        name: session.name,
        role: session.role as User['role']
      };
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  // -- Data States with Undo/Redo --

  // Load initial data
  const loadInitialSpots = (): AdSpot[] => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.SPOTS);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return sanitizeLoadedData(parsed);
      }
    } catch (error) {
      console.error('Failed to load local data:', error);
    }
    return MOCK_AD_SPOTS;
  };

  // Ad Spots with Undo/Redo
  const {
    state: adSpots,
    setState: setAdSpots,
    undo: undoSpots,
    redo: redoSpots,
    canUndo,
    canRedo
  } = useHistory<AdSpot[]>(loadInitialSpots());

  // Equipment List (Managed by Service)
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(false);

  // Selected Equipment to focus on Map
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  // File input ref for backup import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Run migrations on startup
  useEffect(() => {
    storageService.runMigrations();
  }, []);

  // Seed default users if empty
  useEffect(() => {
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!storedUsers) {
      const defaultUsers: StoredUser[] = [
        { username: 'admin', password: 'admin', name: 'Administrator', role: 'ADMIN' },
        { username: 'sale', password: 'sale', name: 'Sale Representative', role: 'SALE' }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
  }, []);

  // Helper to migrate old data
  function sanitizeLoadedData(data: any[]): AdSpot[] {
    return data.map(spot => {
      const audience = spot.audience || {};
      const trafficBreakdown = audience.trafficBreakdown || {
        weekday: audience.weeklyBreakdown?.weekday || 0,
        weekend: audience.weeklyBreakdown?.weekend || 0,
        holiday: 0
      };

      return {
        ...spot,
        audience: {
          ...audience,
          trafficBreakdown,
          monthlyTraffic: audience.monthlyTraffic || [],
          topInterests: audience.topInterests || []
        },
        gallery: spot.gallery || [],
        boatSchedules: spot.boatSchedules || [],
        pricingPackages: spot.pricingPackages || []
      };
    });
  }

  // Persist Ad Spots with safe save
  useEffect(() => {
    const result = storageService.safeSetItem(STORAGE_KEYS.SPOTS, JSON.stringify(adSpots));
    if (!result.success) {
      console.error('Failed to save:', result.error);
      alert(result.error);
    }
  }, [adSpots]);

  // Load Equipment Data from Backend Service
  useEffect(() => {
    const loadEquipment = async () => {
      setIsEquipmentLoading(true);
      try {
        const data = await equipmentService.getAll();
        setEquipmentList(data);
      } catch (error) {
        console.error("System Error: Could not fetch equipment data", error);
      } finally {
        setIsEquipmentLoading(false);
      }
    };

    if (user) {
      loadEquipment();
    }
  }, [user]);

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redoSpots();
        } else {
          e.preventDefault();
          undoSpots();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoSpots, redoSpots]);

  // -- Handlers --

  const handleAddSpot = (spot: AdSpot) => {
    setAdSpots(prev => [...prev, spot]);
  };

  const handleUpdateSpot = (updatedSpot: AdSpot) => {
    setAdSpots(prev => prev.map(s => s.id === updatedSpot.id ? updatedSpot : s));
  };

  const handleDeleteSpot = (id: string) => {
    setAdSpots(prev => prev.filter(s => s.id !== id));
  };

  // Async Equipment Handlers
  const handleUpdateEquipment = async (updatedEq: Equipment) => {
    setEquipmentList(prev => prev.map(e => e.id === updatedEq.id ? updatedEq : e));
    try {
      await equipmentService.update(updatedEq);
    } catch (err) {
      alert("Failed to save changes to server.");
    }
  };

  const handleAddEquipment = async (newEq: Equipment) => {
    setIsEquipmentLoading(true);
    try {
      const created = await equipmentService.create(newEq);
      setEquipmentList(prev => [...prev, created]);
    } catch (err) {
      alert("Failed to create equipment.");
    } finally {
      setIsEquipmentLoading(false);
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (confirm('Are you sure you want to delete this equipment from the database?')) {
      setIsEquipmentLoading(true);
      try {
        await equipmentService.delete(id);
        setEquipmentList(prev => prev.filter(e => e.id !== id));
      } catch (err) {
        alert("Failed to delete equipment.");
      } finally {
        setIsEquipmentLoading(false);
      }
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    storageService.saveSession(loggedInUser);
    setCurrentView(ViewState.MAP);
  };

  const handleLogout = () => {
    setUser(null);
    storageService.clearSession();
    setHasEntered(false);
    setCurrentView(ViewState.HOME);
  };

  const handleLocateEquipment = (eq: Equipment) => {
    setSelectedEquipmentId(eq.id);
    setCurrentView(ViewState.MAP);
  };

  // Backup handlers
  const handleExportBackup = () => {
    storageService.downloadBackup();
  };

  const handleImportBackup = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const backup = await storageService.readBackupFile(file);
      const result = storageService.importBackup(backup);

      if (result.success) {
        alert(`Backup restored successfully!\nRestored: ${result.restoredKeys.join(', ')}\n\nPage will reload.`);
        window.location.reload();
      } else {
        alert(`Failed to restore backup: ${result.error}`);
      }
    } catch (err) {
      alert(`Error reading backup file: ${err}`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- Render Logic ---

  // Skip intro if user has session
  if (!hasEntered && !user) {
    return <IntroScreen onEnter={() => setHasEntered(true)} />;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    const mapProps = {
      adSpots,
      onAddSpot: handleAddSpot,
      onUpdateSpot: handleUpdateSpot,
      onDeleteSpot: handleDeleteSpot,
      currentUser: user,
      equipmentList: equipmentList,
      onUpdateEquipment: handleUpdateEquipment,
      focusedEquipmentId: selectedEquipmentId
    };

    switch (currentView) {
      case ViewState.HOME:
        return <MapExplorer {...mapProps} />;
      case ViewState.MAP:
        return <MapExplorer {...mapProps} />;
      case ViewState.MARKETING:
        return <SalesKit />;
      case ViewState.INSIGHTS:
        return <Insights />;
      case ViewState.DASHBOARD:
        return <AEDashboard adSpots={adSpots} />;
      case ViewState.USER_MANAGEMENT:
        return <UserManagement currentUser={user} onLogout={handleLogout} />;
      case ViewState.EQUIPMENT:
        return <EquipmentManager
          currentUser={user}
          equipmentList={equipmentList}
          onAdd={handleAddEquipment}
          onUpdate={handleUpdateEquipment}
          onDelete={handleDeleteEquipment}
          onLocateEquipment={handleLocateEquipment}
          isLoading={isEquipmentLoading}
        />;
      default:
        return <MapExplorer {...mapProps} />;
    }
  };

  return (
    <>
      {/* Hidden file input for backup import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelected}
        className="hidden"
      />

      <Layout
        currentView={currentView}
        onChangeView={setCurrentView}
        user={user}
        onLogout={handleLogout}
        onUndo={undoSpots}
        onRedo={redoSpots}
        canUndo={canUndo}
        canRedo={canRedo}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      >
        {renderView()}
      </Layout>
    </>
  );
};

export default App;