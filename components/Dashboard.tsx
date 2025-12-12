import React from 'react';
import { Tool } from '../types';
import { PACKS } from '../constants';

interface DashboardProps {
  onToolSelect: (tool: Tool) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onToolSelect }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {PACKS.map(pack => (
          <div key={pack.id} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">Pack {pack.id}</span>
              {pack.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pack.tools.map(tool => (
                <button
                  key={tool.id}
                  id={`card-${tool.id}`}
                  onClick={() => onToolSelect(tool)}
                  className="group flex flex-col items-start p-5 bg-white rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all text-left h-full"
                >
                  <div className="font-bold text-indigo-900 group-hover:text-indigo-600 mb-1">{tool.name}</div>
                  <div className="text-sm text-gray-500">{tool.description}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;