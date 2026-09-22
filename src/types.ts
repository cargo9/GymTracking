export type WorkoutSet = { weight: number; reps: number; rest: number };
export type Exercise = { name: string; sets: WorkoutSet[] };
export type CardioEntry = { minutes: number };
export type Workout = {
  date: string;
  exercises: Exercise[];
  cardio: CardioEntry[];
  startedAt?: number;
  updatedAt?: number;
};
