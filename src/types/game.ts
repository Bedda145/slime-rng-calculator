export interface Slime {
  pageid: number;
  title: string;
  imageUrl: string | null;
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