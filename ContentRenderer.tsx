import React, { useEffect, useState, useRef } from 'react';

interface ContentRendererProps {
  content: string;
}

// Helper to clean image description for URL
const getPollinationsUrl = (desc: string) => {
  const cleanDesc = desc.replace(/Nano Banana Style - /i, '').trim();
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanDesc)}?width=800&height=400&nologo=true`;
};

// Component for a single Image with Skeleton loading
const NanoImage: React.FC<{ description: string }> = ({ description }) => {
  const [loaded, setLoaded] = useState(false);
  const url = getPollinationsUrl(description);
  const cleanDesc = description.replace(/Nano Banana Style - /i, '').trim();

  return (
    <div className="my-6 nano-card no-break">
      {!loaded && (
        <div className="w-full h-64 bg-gray-200 rounded-lg border-2 border-yellow-400 animate-pulse flex items-center justify-center">
          <span className="text-gray-500 font-medium flex items-center">
            <span className="animate-bounce mr-2">🎨</span> Painting Nano Banana Visual...
          </span>
        </div>
      )}
      <div className={`${loaded ? 'block' : 'hidden'} rounded-lg overflow-hidden border border-gray-200 shadow-md bg-white`}>
        <img
          src={url}
          alt={cleanDesc}
          className="w-full h-auto object-cover"
          onLoad={() => setLoaded(true)}
        />
        <div className="p-2 bg-yellow-50 text-xs text-yellow-800 font-semibold border-t border-yellow-100">
          🍌 Nano Banana Visual: {cleanDesc}
        </div>
      </div>
    </div>
  );
};

// Component for Voice Button
const VoiceButton: React.FC<{ text: string }> = ({ text }) => {
  const speak = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Indian Voice Logic
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India')) || voices[0];
    if (indianVoice) utterance.voice = indianVoice;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className="my-2 inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold rounded-full shadow-md transition-all no-print"
    >
      <span className="mr-2">▶</span> Play Audio Script
    </button>
  );
};

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  // We need to parse the content and split it into parts: Text, Image, Voice
  // Regex for IMAGE: \[IMAGE: (.*?)\]
  // Regex for VOICE: \[VOICE SCRIPT\]([\s\S]*?)\[\/VOICE SCRIPT\]
  
  const renderParts = () => {
    if (!content) return null;

    // First split by Voice Script to isolate audio chunks
    const voiceParts = content.split(/(\[VOICE SCRIPT\][\s\S]*?\[\/VOICE SCRIPT\])/g);

    return voiceParts.map((part, index) => {
      // Check if this part is a Voice Script
      const voiceMatch = part.match(/^\[VOICE SCRIPT\]([\s\S]*?)\[\/VOICE SCRIPT\]$/);
      if (voiceMatch) {
        return <VoiceButton key={`voice-${index}`} text={voiceMatch[1].trim()} />;
      }

      // If not voice, it might contain text and images
      const imageParts = part.split(/(\[IMAGE: .*?\])/g);
      
      return (
        <React.Fragment key={`text-block-${index}`}>
          {imageParts.map((subPart, subIndex) => {
            const imageMatch = subPart.match(/^\[IMAGE: (.*?)\]$/);
            if (imageMatch) {
              return <NanoImage key={`img-${index}-${subIndex}`} description={imageMatch[1]} />;
            }
            // Regular text
            if (!subPart.trim()) return null;
            return <div key={`txt-${index}-${subIndex}`} className="whitespace-pre-wrap mb-4">{subPart}</div>;
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="output-area text-slate-800 leading-relaxed font-sans">
      {renderParts()}
    </div>
  );
};

export default ContentRenderer;
