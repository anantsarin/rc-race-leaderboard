export interface Driver {
  id: string;
  name: string;
  qualifyingTime?: number; // seconds
  sprintRace: {
    laps: number;
    totalTime: number; // seconds
    position?: number;
  };
  featureRace: {
    laps: number;
    totalTime: number; // seconds
    position?: number;
  };
  fastestLap?: number; // seconds
  totalPoints: number;
}

export const SPRINT_POINTS = [10, 8, 6, 5, 4, 3, 2, 1]; // Top 8
export const FEATURE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]; // Top 10
export const FASTEST_LAP_BONUS = 1;