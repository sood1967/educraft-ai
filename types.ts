export enum Board {
  CBSE = 'CBSE',
  ICSE = 'ICSE',
}

export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  MARATHI = 'Marathi',
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  packId: number;
}

export interface Pack {
  id: number;
  title: string;
  tools: Tool[];
}

export interface UserSettings {
  board: Board;
  language: Language;
  logo: string | null;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

// Gemini specific types
export interface GeneratedContent {
  text: string;
}
