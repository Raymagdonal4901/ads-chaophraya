/**
 * SIM Card Registration Service
 * Manages SIM card data in localStorage
 */

import { SimCard, SimCardStatus } from '../types';

const STORAGE_KEY = 'adspacenav_simcards_v1';
const SIMULATED_LATENCY_MS = 300;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class SimCardService {

    // GET all SIM cards
    async getAll(): Promise<SimCard[]> {
        await delay(SIMULATED_LATENCY_MS);
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) {
                return [];
            }
            return JSON.parse(data);
        } catch (error) {
            console.error("Failed to fetch SIM cards", error);
            throw new Error("Failed to load SIM card data");
        }
    }

    // CREATE new SIM card
    async create(simCard: Omit<SimCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<SimCard> {
        await delay(SIMULATED_LATENCY_MS);
        const currentList = this.getLocalData();

        const newSimCard: SimCard = {
            ...simCard,
            id: `SIM-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const newList = [...currentList, newSimCard];
        this.saveLocalData(newList);
        return newSimCard;
    }

    // UPDATE existing SIM card
    async update(simCard: SimCard): Promise<SimCard> {
        await delay(SIMULATED_LATENCY_MS);
        const currentList = this.getLocalData();
        const index = currentList.findIndex(s => s.id === simCard.id);

        if (index === -1) {
            throw new Error(`SIM card with ID ${simCard.id} not found`);
        }

        const updatedSimCard: SimCard = {
            ...simCard,
            updatedAt: new Date().toISOString()
        };

        const newList = [...currentList];
        newList[index] = updatedSimCard;
        this.saveLocalData(newList);
        return updatedSimCard;
    }

    // DELETE SIM card
    async delete(id: string): Promise<void> {
        await delay(SIMULATED_LATENCY_MS);
        const currentList = this.getLocalData();
        const newList = currentList.filter(s => s.id !== id);
        this.saveLocalData(newList);
    }

    // --- Internal Helpers ---
    private getLocalData(): SimCard[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    private saveLocalData(data: SimCard[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
}

export const simCardService = new SimCardService();

// Helper function for status display
export const getSimStatusLabel = (status: SimCardStatus): string => {
    switch (status) {
        case 'ACTIVE': return 'ใช้งาน';
        case 'BROKEN': return 'ชำรุด';
        case 'LOST': return 'สูญหาย';
        default: return status;
    }
};

export const getSimStatusColor = (status: SimCardStatus): string => {
    switch (status) {
        case 'ACTIVE': return 'bg-emerald-100 text-emerald-700';
        case 'BROKEN': return 'bg-amber-100 text-amber-700';
        case 'LOST': return 'bg-red-100 text-red-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

