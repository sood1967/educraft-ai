import React, { useState } from 'react';

interface MagicBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const MagicBar: React.FC<MagicBarProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleMic = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    // Simple voice input stub - ideally would need complex handling for listening state
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 no-print">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-xl">✨</span>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Describe what you need (e.g., 'Lesson plan for Photosynthesis Class 7')..."
          className="block w-full pl-12 pr-12 py-4 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-lg transition-all"
        />
        <button
          type="button"
          onClick={handleMic}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-indigo-600 text-gray-400 transition-colors"
        >
          <span className="text-xl">🎤</span>
        </button>
      </form>
    </div>
  );
};

export default MagicBar;
