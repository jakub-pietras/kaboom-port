export const speedLevelsMap: Map<number, number> = new Map([
  [1, 500],
  [2, 700],
  [3, 900],
  [4, 1100],
  [5, 1300],
  [6, 1500],
  [7, 1700],
  [8, 2000],
]);

const speedLevels = Array.from(speedLevelsMap.keys());
export const MAX_SPEED_LEVEL = Math.max(...speedLevels);
export const MIN_SPEED_LEVEL = Math.min(...speedLevels);
