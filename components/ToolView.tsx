import React, { useState } from 'react';
import { Tool, UserSettings } from '../types';
import ContentRenderer from './ContentRenderer';
import MagicBar from './MagicBar';
import { generateEduContent } from '../services/gemini';

interface ToolViewProps {
  tool: Tool;
  settings: UserSettings;
  onBack: () => void;
}

const ToolView: React.FC<ToolViewProps> = ({ tool, settings, onBack }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Specific UI for Syllabus Parser
  const handleFileUpload = () => {
    alert("File Uploaded Successfully! (Simulation)");
  };

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    setContent(null);
    const result = await generateEduContent(prompt, settings.board, settings.language, tool.name);
    setContent(result);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12 min-h-screen">
      <button 
        onClick={onBack}
        className="mb-6 text-gray-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors no-print"
      >
        ← Back to Dashboard
      </button>

      {/* Tool Header - Visible in Print */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 text-center">
        <h2 className="text-2xl font-bold text-indigo-900 mb-2">MODE: Pack {tool.packId} — {tool.name}</h2>
        <div className="flex items-center justify-center gap-4 text-sm font-medium text-indigo-700">
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">BOARD: {settings.board}</span>
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">LANGUAGE: {settings.language}</span>
        </div>
      </div>

      {/* Special Input for Syllabus Parser */}
      {tool.id === 'pack3-syllabus' && (
        <div className="mb-8 p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl text-center no-print">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Syllabus File</h3>
          <p className="text-gray-500 text-sm mb-4">Supported: .pdf, .doc, .docx, .txt</p>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      )}

      {/* Input Area */}
      {!content && !loading && (
        <div className="mb-12 no-print">
           <div className="text-center mb-4 text-gray-500">What would you like to generate?</div>
           <MagicBar onSend={handleGenerate} />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-900 font-medium animate-pulse">Consulting Pedagogical Engine...</p>
        </div>
      )}

      {/* Result Area */}
      {content && (
        <div className="content-card bg-white p-8 md:p-12 rounded-xl shadow-xl border border-gray-200 print:shadow-none print:border-none print:p-0">
          {/* Print-only Logo Placeholder - Handled by global CSS #print-logo but we need an img tag */}
          {settings.logo && <img id="print-logo" src={settings.logo} alt="Logo" className="hidden" />}
          
          <ContentRenderer content={content} />
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center no-print">
             <button 
               onClick={() => setContent(null)}
               className="text-indigo-600 hover:text-indigo-800 font-medium"
             >
               Start New Generation
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolView;
