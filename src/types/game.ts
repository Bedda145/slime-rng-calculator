// Import the expanded SlimeType union from your wiki API service file
// (Adjust the relative path if your file structure is different)
import type { SlimeType } from '../services/wikiApi';
export interface Slime {
  pageid: number;
  title: string;
  // This now dynamically handles 'Base', 'BigShinyInverted', etc.
  imageUrls: Partial<Record<SlimeType, string>> | null;
}

export interface Potion {
  id: string;
  name: string;
  luckMultiplier: number;
  durationMinutes: number;
}

export interface RollResult {
  slime: Slime;
  rolledOdds: number;
  isNew: boolean;
}