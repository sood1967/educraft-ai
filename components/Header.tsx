import React, { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Board, Language, UserSettings } from '../types';

interface HeaderProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const Header: React.FC<HeaderProps> = ({ settings, setSettings }) => {
  
  // Load logo from local storage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('schoolLogo');
    if (savedLogo) {
      setSettings(prev => ({ ...prev, logo: savedLogo }));
    }
  }, [setSettings]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) { // 500KB
      alert("Please upload a smaller logo (under 500KB).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      localStorage.setItem('schoolLogo', result);
      setSettings(prev => ({ ...prev, logo: result }));
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Branding Area */}
        <div className="flex items-center space-x-4">
           {settings.logo ? (
             <img src={settings.logo} alt="School Logo" className="h-12 w-auto object-contain" />
           ) : (
             <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">🏫</div>
           )}
           <div>
             <h1 className="text-xl font-bold text-indigo-900 leading-tight">Excell EduCraft AI™</h1>
             <p className="text-xs text-gray-500">Standard Edition V15.0</p>
           </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={settings.board}
            onChange={(e) => setSettings(p => ({...p, board: e.target.value as Board}))}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {Object.values(Board).map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select 
            value={settings.language}
            onChange={(e) => setSettings(p => ({...p, language: e.target.value as Language}))}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {Object.values(Language).map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <label className="cursor-pointer px-4 py-2 bg-white border border-indigo-200 text-indigo-700 text-sm font-medium rounded-md hover:bg-indigo-50 transition-colors flex items-center gap-2">
            <span>🏢 Upload Logo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </label>

          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            🖨️ Print
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;