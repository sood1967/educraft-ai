import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { Board, Language, Tool, UserSettings } from './types';
import Auth from './components/Auth';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ToolView from './components/ToolView';
import MagicBar from './components/MagicBar';
import { generateEduContent } from './services/gemini';
import ContentRenderer from './components/ContentRenderer';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [settings, setSettings] = useState<UserSettings>({
    board: Board.CBSE,
    language: Language.ENGLISH,
    logo: null,
  });

  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [globalContent, setGlobalContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGlobalMagicPrompt = async (text: string) => {
    // If prompt is from the main dashboard, we use a generic generation or try to infer tool?
    // The prompt says "infer and state the selected mode".
    setLoading(true);
    const result = await generateEduContent(text, settings.board, settings.language);
    setGlobalContent(result);
    setLoading(false);
  };

  const handleBack = () => {
    setActiveTool(null);
    setGlobalContent(null);
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center text-indigo-600">Loading...</div>;
  if (!user) return <Auth />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header settings={settings} setSettings={setSettings} />

      <main className="flex-1">
        {/* Render Active Tool or Global Result or Dashboard */}
        {activeTool ? (
          <div className="py-8">
            <ToolView tool={activeTool} settings={settings} onBack={handleBack} />
          </div>
        ) : globalContent ? (
          <div className="max-w-5xl mx-auto px-4 py-8">
             <button 
                onClick={handleBack}
                className="mb-6 text-gray-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors no-print"
              >
                ← Back to Dashboard
              </button>
             <div className="content-card bg-white p-8 md:p-12 rounded-xl shadow-xl border border-gray-200">
               {settings.logo && <img id="print-logo" src={settings.logo} alt="Logo" className="hidden" />}
               <ContentRenderer content={globalContent} />
             </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 h-full">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-900 font-medium animate-pulse">Processing your request...</p>
          </div>
        ) : (
          <>
            <div className="py-12 bg-gradient-to-b from-white to-slate-50 border-b border-indigo-50">
               <div className="text-center mb-8 px-4">
                 <h2 className="text-3xl font-extrabold text-indigo-900 mb-3">Hello, Educator.</h2>
                 <p className="text-lg text-gray-600 max-w-2xl mx-auto">What would you like to create today?</p>
               </div>
               <MagicBar onSend={handleGlobalMagicPrompt} />
            </div>
            <div className="py-8">
              <Dashboard onToolSelect={setActiveTool} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;