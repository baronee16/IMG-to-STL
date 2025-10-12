
import React from 'react';
import { StlSettings } from '../types';

interface SettingsPanelProps {
    settings: StlSettings;
    onSettingsChange: (newSettings: StlSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
    const handleSettingChange = <K extends keyof StlSettings,>(
        key: K,
        value: StlSettings[K]
    ) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="baseHeight" className="block text-sm font-medium text-gray-300">Base Height (mm): <span className="text-teal-400 font-bold">{settings.baseHeight}</span></label>
                <input
                    id="baseHeight"
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={settings.baseHeight}
                    onChange={(e) => handleSettingChange('baseHeight', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="modelHeight" className="block text-sm font-medium text-gray-300">Model Height (mm): <span className="text-teal-400 font-bold">{settings.modelHeight}</span></label>
                <input
                    id="modelHeight"
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={settings.modelHeight}
                    onChange={(e) => handleSettingChange('modelHeight', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            
            <div className="space-y-2">
                <label htmlFor="maxSize" className="block text-sm font-medium text-gray-300">Detail Level (Max Size): <span className="text-teal-400 font-bold">{settings.maxSize}px</span></label>
                <input
                    id="maxSize"
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={settings.maxSize}
                    onChange={(e) => handleSettingChange('maxSize', parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                 <p className="text-xs text-gray-500">Higher values increase detail but take longer to process.</p>
            </div>

            <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                <label htmlFor="invert" className="text-sm font-medium text-gray-300">Invert Height (Dark becomes high)</label>
                <div className="relative inline-flex items-center cursor-pointer">
                    <input
                        id="invert"
                        type="checkbox"
                        checked={settings.invert}
                        onChange={(e) => handleSettingChange('invert', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
