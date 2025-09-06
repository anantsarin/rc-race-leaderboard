import { Driver, SPRINT_POINTS, FEATURE_POINTS, FASTEST_LAP_BONUS } from '@/types/racing';

export function calculatePoints(drivers: Driver[]): Driver[] {
  // Find fastest lap of the day
  const fastestLapOfDay = Math.min(
    ...drivers
      .filter(d => d.fastestLap && d.fastestLap > 0)
      .map(d => d.fastestLap!)
  );

  return drivers.map(driver => {
    let totalPoints = 0;

    // Sprint Race Points
    if (driver.sprintRace.position && driver.sprintRace.position <= SPRINT_POINTS.length) {
      totalPoints += SPRINT_POINTS[driver.sprintRace.position - 1];
    }

    // Feature Race Points
    if (driver.featureRace.position && driver.featureRace.position <= FEATURE_POINTS.length) {
      totalPoints += FEATURE_POINTS[driver.featureRace.position - 1];
    }

    // Fastest Lap Bonus
    if (driver.fastestLap === fastestLapOfDay && fastestLapOfDay !== Infinity) {
      totalPoints += FASTEST_LAP_BONUS;
    }

    return {
      ...driver,
      totalPoints
    };
  });
}

export function formatTime(seconds: number): string {
  if (!seconds || seconds === 0) return '--';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins > 0) {
    return `${mins}:${secs.toFixed(3).padStart(6, '0')}`;
  }
  
  return secs.toFixed(3);
}

export function parseTime(timeStr: string): number {
  if (!timeStr || timeStr === '--') return 0;
  
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  
  return parseFloat(timeStr);
}