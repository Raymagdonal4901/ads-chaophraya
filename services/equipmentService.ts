import { Equipment } from '../types';
import { MOCK_EQUIPMENT } from '../constants';

const STORAGE_KEY = 'adspacenav_equipment_v1';
const SIMULATED_LATENCY_MS = 600; // Simulate 600ms server response time

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class EquipmentService {
  
  // GET /api/equipment
  async getAll(): Promise<Equipment[]> {
    await delay(SIMULATED_LATENCY_MS);
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Initialize with mock data if empty (First run)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_EQUIPMENT));
        return MOCK_EQUIPMENT;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Backend Error: Failed to fetch equipment", error);
      throw new Error("Failed to load equipment data");
    }
  }

  // POST /api/equipment
  async create(equipment: Equipment): Promise<Equipment> {
    await delay(SIMULATED_LATENCY_MS);
    const currentList = await this.getLocalData();
    const newList = [...currentList, equipment];
    this.saveLocalData(newList);
    return equipment;
  }

  // PUT /api/equipment/:id
  async update(equipment: Equipment): Promise<Equipment> {
    await delay(SIMULATED_LATENCY_MS);
    const currentList = await this.getLocalData();
    const index = currentList.findIndex(e => e.id === equipment.id);
    
    if (index === -1) {
      throw new Error(`Equipment with ID ${equipment.id} not found`);
    }

    const newList = [...currentList];
    newList[index] = equipment;
    this.saveLocalData(newList);
    return equipment;
  }

  // DELETE /api/equipment/:id
  async delete(id: string): Promise<void> {
    await delay(SIMULATED_LATENCY_MS);
    const currentList = await this.getLocalData();
    const newList = currentList.filter(e => e.id !== id);
    this.saveLocalData(newList);
  }

  // POST /api/upload
  // Simulates uploading a file to a storage bucket (S3/Firebase Storage)
  async uploadImage(file: File): Promise<string> {
    await delay(1000); // Uploads usually take longer
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // --- Internal Helpers (Database Abstraction) ---
  private getLocalData(): Equipment[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveLocalData(data: Equipment[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export const equipmentService = new EquipmentService();