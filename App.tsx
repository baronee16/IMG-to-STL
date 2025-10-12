
import React, { useState, useCallback } from 'react';
import { StlSettings } from './types';
import { generateStl } from './services/stlGenerator';
import FileUpload from './components/FileUpload';
import SettingsPanel from './components/SettingsPanel';
import Spinner from './components/Spinner';
import { DownloadIcon, CubeIcon } from './components/IconComponents';

const App: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [settings, setSettings] = useState<StlSettings>({
        baseHeight: 1,
        modelHeight: 10,
        invert: false,
        maxSize: 200,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stlData, setStlData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (file: File) => {
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setStlData(null);
        setError(null);
    };

    const handleGenerateStl = useCallback(async () => {
        if (!imageUrl) {
            setError("No image selected.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setStlData(null);

        try {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw new Error("Could not get canvas context");
                }
                
                let { width, height } = img;
                if (width > settings.maxSize || height > settings.maxSize) {
                    if (width > height) {
                        height = Math.round(height * (settings.maxSize / width));
                        width = settings.maxSize;
                    } else {
                        width = Math.round(width * (settings.maxSize / height));
                        height = settings.maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);

                const stlString = generateStl(imageData, settings);
                setStlData(stlString);
                setIsLoading(false);
            };
            img.onerror = () => {
                throw new Error("Failed to load the image.");
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setIsLoading(false);
        }
    }, [imageUrl, settings]);

    const handleDownload = () => {
        if (!stlData) return;
        const blob = new Blob([stlData], { type: 'model/stl' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const fileName = imageFile?.name.split('.').slice(0, -1).join('.') || 'model';
        link.download = `${fileName}.stl`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };
    
    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setStlData(null);
        setError(null);
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-8 font-sans">
            <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Image to STL Converter</h1>
                <p className="text-gray-400 mt-2">Turn your 2D heightmaps into 3D printable models.</p>
            </header>

            <main className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 ring-1 ring-white/10">
                {!imageUrl ? (
                    <FileUpload onFileSelect={handleFileSelect} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col items-center justify-center space-y-4">
                             <div className="w-full aspect-square bg-gray-900 rounded-lg overflow-hidden ring-2 ring-teal-500/50 flex items-center justify-center">
                                <img src={imageUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                            </div>
                            <button
                                onClick={handleReset}
                                className="w-full text-center px-4 py-2 bg-red-600/80 hover:bg-red-500 rounded-md transition-colors duration-200 shadow-lg">
                                Use a Different Image
                            </button>
                        </div>

                        <div className="flex flex-col space-y-6">
                            <h2 className="text-2xl font-semibold border-b-2 border-teal-500/50 pb-2">3D Model Settings</h2>
                            <SettingsPanel settings={settings} onSettingsChange={setSettings} />

                            <div className="pt-4 space-y-4">
                                <button
                                    onClick={handleGenerateStl}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                                    {isLoading ? <Spinner /> : <><CubeIcon className="w-6 h-6 mr-2" /> Generate STL</>}
                                </button>

                                {stlData && !isLoading && (
                                    <button
                                        onClick={handleDownload}
                                        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl animate-fade-in">
                                        <DownloadIcon className="w-6 h-6 mr-2" />
                                        Download .STL File
                                    </button>
                                )}
                            </div>
                            {error && <p className="text-red-400 text-center animate-fade-in">{error}</p>}
                        </div>
                    </div>
                )}
            </main>
             <footer className="text-center mt-8 text-gray-500 text-sm">
                <p>Created by a World-Class Senior Frontend React Engineer.</p>
                <p>STL files can be imported into slicer software like Cura for 3D printing.</p>
            </footer>
        </div>
    );
};

export default App;
