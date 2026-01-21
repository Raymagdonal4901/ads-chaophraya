import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, HardDrive, Check, Undo2, Redo2, Download, Upload } from 'lucide-react';
import { storageService, StorageQuota } from '../services/storageService';

interface SaveIndicatorProps {
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    onExportBackup?: () => void;
    onImportBackup?: () => void;
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false,
    onExportBackup,
    onImportBackup
}) => {
    const [lastSavedText, setLastSavedText] = useState('');
    const [quota, setQuota] = useState<StorageQuota | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const updateStatus = () => {
            setLastSavedText(storageService.getLastSavedText());
            setQuota(storageService.getStorageQuota());
        };

        updateStatus();
        const interval = setInterval(updateStatus, 10000); // Update every 10s

        return () => clearInterval(interval);
    }, []);

    const getQuotaColor = () => {
        if (!quota) return 'text-slate-400';
        if (quota.isCritical) return 'text-red-500';
        if (quota.isWarning) return 'text-amber-500';
        return 'text-emerald-500';
    };

    const getQuotaIcon = () => {
        if (!quota) return <HardDrive size={14} />;
        if (quota.isCritical) return <AlertTriangle size={14} className="animate-pulse" />;
        if (quota.isWarning) return <AlertTriangle size={14} />;
        return <Check size={14} />;
    };

    return (
        <div className="relative">
            <div
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 cursor-pointer hover:bg-slate-700/50 transition-colors"
                onClick={() => setShowDetails(!showDetails)}
            >
                {/* Undo/Redo Buttons */}
                {(onUndo || onRedo) && (
                    <div className="flex items-center gap-1 pr-2 border-r border-slate-600">
                        <button
                            onClick={(e) => { e.stopPropagation(); onUndo?.(); }}
                            disabled={!canUndo}
                            className={`p-1 rounded transition-colors ${canUndo ? 'text-slate-300 hover:text-white hover:bg-slate-600' : 'text-slate-600 cursor-not-allowed'}`}
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo2 size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onRedo?.(); }}
                            disabled={!canRedo}
                            className={`p-1 rounded transition-colors ${canRedo ? 'text-slate-300 hover:text-white hover:bg-slate-600' : 'text-slate-600 cursor-not-allowed'}`}
                            title="Redo (Ctrl+Shift+Z)"
                        >
                            <Redo2 size={14} />
                        </button>
                    </div>
                )}

                {/* Save Status */}
                <div className="flex items-center gap-1.5">
                    <Save size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-300 font-medium">{lastSavedText}</span>
                </div>

                {/* Storage Quota */}
                {quota && (
                    <div className={`flex items-center gap-1 ${getQuotaColor()}`}>
                        {getQuotaIcon()}
                        <span className="text-xs font-bold">{quota.percentage}%</span>
                    </div>
                )}
            </div>

            {/* Details Dropdown */}
            {showDetails && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 animate-fadeIn z-50">
                    <h4 className="text-sm font-bold text-white mb-3">Storage Status</h4>

                    {/* Quota Bar */}
                    {quota && (
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Used: {quota.usedMB} MB</span>
                                <span>Max: {quota.maxMB} MB</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all ${quota.isCritical ? 'bg-red-500' : quota.isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${Math.min(quota.percentage, 100)}%` }}
                                />
                            </div>
                            {quota.isCritical && (
                                <p className="text-xs text-red-400 mt-2">
                                    ⚠️ Storage critically full. Export backup now!
                                </p>
                            )}
                        </div>
                    )}

                    {/* Backup Actions */}
                    <div className="flex gap-2">
                        {onExportBackup && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onExportBackup(); setShowDetails(false); }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                                <Download size={14} />
                                Export
                            </button>
                        )}
                        {onImportBackup && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onImportBackup(); setShowDetails(false); }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                                <Upload size={14} />
                                Import
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
