import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { usePopup } from '../contexts/PopupContext';

const PopupToggle: React.FC = () => {
  const { popupsEnabled, togglePopups } = usePopup();

  return (
    <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
      <div className="flex items-center gap-2">
        {popupsEnabled ? (
          <Bell className="w-5 h-5 text-green-400" />
        ) : (
          <BellOff className="w-5 h-5 text-red-400" />
        )}
        <span className="text-sm font-medium text-white">
          Pop-up Messages
        </span>
      </div>
      
      <button
        onClick={togglePopups}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
          ${popupsEnabled ? 'bg-green-500' : 'bg-gray-600'}
        `}
        role="switch"
        aria-checked={popupsEnabled}
        aria-label={popupsEnabled ? 'Disable pop-up messages' : 'Enable pop-up messages'}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
            ${popupsEnabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      
      <span className={`text-xs font-medium ${
        popupsEnabled ? 'text-green-400' : 'text-red-400'
      }`}>
        {popupsEnabled ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
};

export default PopupToggle;