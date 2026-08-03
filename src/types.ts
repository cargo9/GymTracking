
export type WorkoutSet = { weight: number; reps: number; rest: number };
export type Exercise = { name: string; sets: WorkoutSet[] };
export type Workout = { date: string; exercises: Exercise[] };


// type WorkoutSet = {
//   weight: number;
//   reps: number;
//   rest: number;
// };

// type Exercise = {
//   name: string;
//   sets: WorkoutSet[];
// };

// type Workout = {
//   date: string;
//   exercises: Exercise[];
// };