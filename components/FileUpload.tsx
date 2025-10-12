
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './IconComponents';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    }, [onFileSelect]);

    return (
        <div
            className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-teal-400 bg-gray-700/50' : 'border-gray-600 hover:border-teal-500'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/png, image/jpeg, image/bmp, image/webp"
                onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center text-center cursor-pointer">
                <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
                <p className="text-xl font-semibold text-gray-300">
                    <span className="text-teal-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-gray-500 mt-1">PNG, JPG, BMP, or WEBP</p>
                <p className="text-xs text-gray-500 mt-2">Image brightness will be converted to model height.</p>
            </label>
        </div>
    );
};

export default FileUpload;
