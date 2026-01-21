/**
 * Storage Service - Central data persistence management
 * Provides: Backup/Restore, Quota Checking, Schema Management, Session Management
 */

// Storage Keys
export const STORAGE_KEYS = {
    SPOTS: 'adspacenav_spots_data_v4',
    EQUIPMENT: 'adspacenav_equipment_v1',
    USERS: 'adspacenav_users_v2',
    FOLDERS: 'equipment_empty_folders',
    SESSION: 'adspacenav_session',
    LAST_SAVED: 'adspacenav_last_saved',
    SCHEMA_VERSION: 'adspacenav_schema_version'
} as const;

export const CURRENT_SCHEMA_VERSION = 1;

export interface BackupData {
    version: number;
    exportedAt: string;
    spots: string | null;
    equipment: string | null;
    users: string | null;
    folders: string | null;
}

export interface StorageQuota {
    usedBytes: number;
    usedMB: string;
    maxMB: number;
    percentage: number;
    isWarning: boolean;
    isCritical: boolean;
}

export interface SessionData {
    username: string;
    name: string;
    role: string;
    loginAt: string;
}

class StorageService {
    private readonly MAX_STORAGE_MB = 5; // localStorage limit
    private readonly WARNING_THRESHOLD = 0.7; // 70%
    private readonly CRITICAL_THRESHOLD = 0.9; // 90%

    // ==================== QUOTA MANAGEMENT ====================

    /**
     * Check current localStorage usage
     */
    getStorageQuota(): StorageQuota {
        let totalBytes = 0;

        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const value = localStorage.getItem(key);
                if (value) {
                    // Each character in localStorage is 2 bytes (UTF-16)
                    totalBytes += value.length * 2;
                }
            }
        }

        const usedMB = totalBytes / 1024 / 1024;
        const percentage = (usedMB / this.MAX_STORAGE_MB) * 100;

        return {
            usedBytes: totalBytes,
            usedMB: usedMB.toFixed(2),
            maxMB: this.MAX_STORAGE_MB,
            percentage: Math.round(percentage),
            isWarning: percentage >= this.WARNING_THRESHOLD * 100,
            isCritical: percentage >= this.CRITICAL_THRESHOLD * 100
        };
    }

    /**
     * Safe save with quota check
     */
    safeSetItem(key: string, value: string): { success: boolean; error?: string } {
        try {
            const quota = this.getStorageQuota();
            if (quota.isCritical) {
                console.warn('Storage is critically full. Consider exporting backup.');
            }
            localStorage.setItem(key, value);
            this.updateLastSaved();
            return { success: true };
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                return { success: false, error: 'Storage quota exceeded. Please export backup and clear old data.' };
            }
            return { success: false, error: String(error) };
        }
    }

    // ==================== BACKUP & RESTORE ====================

    /**
     * Export all data as JSON backup
     */
    exportBackup(): BackupData {
        const backup: BackupData = {
            version: CURRENT_SCHEMA_VERSION,
            exportedAt: new Date().toISOString(),
            spots: localStorage.getItem(STORAGE_KEYS.SPOTS),
            equipment: localStorage.getItem(STORAGE_KEYS.EQUIPMENT),
            users: localStorage.getItem(STORAGE_KEYS.USERS),
            folders: localStorage.getItem(STORAGE_KEYS.FOLDERS)
        };
        return backup;
    }

    /**
     * Download backup as JSON file
     */
    downloadBackup(): void {
        const backup = this.exportBackup();
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `adspacenav_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Validate backup file structure
     */
    validateBackup(data: unknown): { valid: boolean; error?: string } {
        if (!data || typeof data !== 'object') {
            return { valid: false, error: 'Invalid backup file format' };
        }

        const backup = data as Partial<BackupData>;

        if (typeof backup.version !== 'number') {
            return { valid: false, error: 'Missing or invalid version number' };
        }

        if (!backup.exportedAt) {
            return { valid: false, error: 'Missing export timestamp' };
        }

        return { valid: true };
    }

    /**
     * Import backup from JSON data
     */
    importBackup(backup: BackupData): { success: boolean; error?: string; restoredKeys: string[] } {
        const validation = this.validateBackup(backup);
        if (!validation.valid) {
            return { success: false, error: validation.error, restoredKeys: [] };
        }

        const restoredKeys: string[] = [];

        try {
            if (backup.spots) {
                localStorage.setItem(STORAGE_KEYS.SPOTS, backup.spots);
                restoredKeys.push('Ad Spots');
            }
            if (backup.equipment) {
                localStorage.setItem(STORAGE_KEYS.EQUIPMENT, backup.equipment);
                restoredKeys.push('Equipment');
            }
            if (backup.users) {
                localStorage.setItem(STORAGE_KEYS.USERS, backup.users);
                restoredKeys.push('Users');
            }
            if (backup.folders) {
                localStorage.setItem(STORAGE_KEYS.FOLDERS, backup.folders);
                restoredKeys.push('Folders');
            }

            this.updateLastSaved();
            return { success: true, restoredKeys };
        } catch (error) {
            return { success: false, error: String(error), restoredKeys };
        }
    }

    /**
     * Read backup file and return parsed data
     */
    readBackupFile(file: File): Promise<BackupData> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    resolve(data);
                } catch {
                    reject(new Error('Invalid JSON file'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // ==================== SESSION MANAGEMENT ====================

    /**
     * Save user session
     */
    saveSession(user: { username: string; name: string; role: string }): void {
        const session: SessionData = {
            ...user,
            loginAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    }

    /**
     * Get stored session
     */
    getSession(): SessionData | null {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.SESSION);
            if (!data) return null;
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

    /**
     * Clear session (logout)
     */
    clearSession(): void {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
    }

    // ==================== LAST SAVED TRACKING ====================

    /**
     * Update last saved timestamp
     */
    updateLastSaved(): void {
        localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
    }

    /**
     * Get last saved timestamp
     */
    getLastSaved(): Date | null {
        const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);
        if (!timestamp) return null;
        return new Date(timestamp);
    }

    /**
     * Get human-readable "time ago" string
     */
    getLastSavedText(): string {
        const lastSaved = this.getLastSaved();
        if (!lastSaved) return 'Never saved';

        const now = new Date();
        const diffMs = now.getTime() - lastSaved.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);

        if (diffSec < 10) return 'Just now';
        if (diffSec < 60) return `${diffSec} seconds ago`;
        if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;

        return lastSaved.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // ==================== SCHEMA VERSION ====================

    /**
     * Get current schema version
     */
    getSchemaVersion(): number {
        const version = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
        return version ? parseInt(version, 10) : 0;
    }

    /**
     * Set schema version
     */
    setSchemaVersion(version: number): void {
        localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, String(version));
    }

    /**
     * Check if migration is needed
     */
    needsMigration(): boolean {
        return this.getSchemaVersion() < CURRENT_SCHEMA_VERSION;
    }

    /**
     * Run migrations if needed
     */
    runMigrations(): void {
        const currentVersion = this.getSchemaVersion();

        if (currentVersion < CURRENT_SCHEMA_VERSION) {
            console.log(`Migrating schema from v${currentVersion} to v${CURRENT_SCHEMA_VERSION}`);

            // Add migration logic here as needed
            // Example:
            // if (currentVersion < 1) { migrateToV1(); }
            // if (currentVersion < 2) { migrateToV2(); }

            this.setSchemaVersion(CURRENT_SCHEMA_VERSION);
        }
    }

    // ==================== CLEAR ALL DATA ====================

    /**
     * Clear all app data (dangerous!)
     */
    clearAllData(): void {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
}

export const storageService = new StorageService();
