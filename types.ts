export interface ICP {
  id: string;
  role: string;
  companySize: string;
  painPoints: string[];
  goals: string[];
  buyingTriggers: string[];
  preferredChannels: string[];
  techStack: string[];
}

export interface CreativeAsset {
  id: string;
  title: string;
  type: 'copy' | 'image_prompt' | 'email';
  content: string;
  version: number;
  status: 'draft' | 'review' | 'approved';
  feedback?: Feedback[];
}

export interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  revisedContent?: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  vertical: string;
  sentiment: number; // 0-100
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ICP_GEN = 'ICP_GEN',
  CREATIVE_LOOP = 'CREATIVE_LOOP',
  CRM = 'CRM'
}
