
import React from 'react';

const Spinner: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        <span>Processing...</span>
    </div>
);

export default Spinner;
