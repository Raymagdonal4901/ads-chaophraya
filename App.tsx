import React, { useState, useEffect } from 'react';
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

const App: React.FC = () => {
  // Intro State
  const [hasEntered, setHasEntered] = useState(false);

  // Auth State
  const [user, setUser] = useState<User | null>(null);

  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  
  // -- Data States --
  
  // Ad Spots
  const [adSpots, setAdSpots] = useState<AdSpot[]>(() => {
    try {
      const savedData = localStorage.getItem('adspacenav_spots_data_v4');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return sanitizeLoadedData(parsed);
      }
    } catch (error) {
      console.error('Failed to load local data:', error);
    }
    return MOCK_AD_SPOTS;
  });

  // Equipment List (Managed by Service)
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(false);

  // Selected Equipment to focus on Map
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  // Seed default users if empty
  useEffect(() => {
    const storedUsers = localStorage.getItem('adspacenav_users_v2');
    if (!storedUsers) {
      const defaultUsers: StoredUser[] = [
        { username: 'admin', password: 'admin', name: 'Administrator', role: 'ADMIN' },
        { username: 'sale', password: 'sale', name: 'Sale Representative', role: 'SALE' }
      ];
      localStorage.setItem('adspacenav_users_v2', JSON.stringify(defaultUsers));
    }
  }, []);

  // Helper to migrate old data
  function sanitizeLoadedData(data: any[]): AdSpot[] {
    return data.map(spot => {
        // Ensure audience structure is correct for v4
        const audience = spot.audience || {};
        
        // Backward compatibility: If trafficBreakdown is missing, try to use old weeklyBreakdown or default
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
            // Ensure array existence
            boatSchedules: spot.boatSchedules || [],
            pricingPackages: spot.pricingPackages || []
        };
    });
  }

  // Persist Ad Spots
  useEffect(() => {
    localStorage.setItem('adspacenav_spots_data_v4', JSON.stringify(adSpots));
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
      // Optimistic UI Update
      setEquipmentList(prev => prev.map(e => e.id === updatedEq.id ? updatedEq : e));
      try {
        await equipmentService.update(updatedEq);
      } catch (err) {
        alert("Failed to save changes to server.");
        // Revert on failure could be implemented here
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
      if(confirm('Are you sure you want to delete this equipment from the database?')) {
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
    setCurrentView(ViewState.MAP);
  };

  const handleLogout = () => {
    setUser(null);
    setHasEntered(false); // Optional: Go back to intro on logout, or keep at login.
    setCurrentView(ViewState.HOME);
  };

  // Navigate to map and focus on specific equipment
  const handleLocateEquipment = (eq: Equipment) => {
    setSelectedEquipmentId(eq.id);
    setCurrentView(ViewState.MAP);
  };

  // --- Render Logic ---

  if (!hasEntered) {
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
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView} 
      user={user}
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
};

export default App;