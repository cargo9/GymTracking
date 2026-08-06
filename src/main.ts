import type { WorkoutSet, Exercise, Workout } from "./types.ts";

const workouts: Workout[] = [];

function getToday(): string {
  return new Date().toISOString().substring(0, 10);
}

function render() {
  const list = document.getElementById("workout-list") as HTMLDivElement;
  list.innerHTML = "";

  const today = getToday();
  const workout = workouts.find((w) => w.date === today);

  workout?.exercises.forEach((exercise, exIndex) => {
    list.innerHTML += `<div>
      <strong>${exercise.name}</strong>
      <button class="del-exercise" data-ex="${exIndex}">🗑 всё</button>
    </div>`;
    exercise.sets.forEach((set, setIndex) => {
      list.innerHTML += `<div>
        ${set.weight} кг × ${set.reps} — отдых ${set.rest}с
        <button class="del-set" data-ex="${exIndex}" data-set="${setIndex}">🗑</button>
      </div>`;
    });
  });
}

function save() {
  localStorage.setItem("workouts", JSON.stringify(workouts));
}

function load() {
  const saved = localStorage.getItem("workouts");
  if (saved) {
    const parsed: Workout[] = JSON.parse(saved);
    workouts.push(...parsed.filter((w) => w.exercises.length > 0));
  }
}

const addSetBtn = document.getElementById("add-set") as HTMLButtonElement;

addSetBtn.addEventListener("click", () => {
  const nameInput = document.getElementById(
    "exercise-name",
  ) as HTMLInputElement;
  const weightInput = document.getElementById("weight") as HTMLInputElement;
  const repsInput = document.getElementById("reps") as HTMLInputElement;
  const restInput = document.getElementById("rest") as HTMLInputElement;

  const name = nameInput.value;
  const weight = parseFloat(weightInput.value);
  const reps = parseInt(repsInput.value);
  const rest = parseInt(restInput.value);

  if (isNaN(weight) || isNaN(reps) || isNaN(rest)) {
    alert("Please enter valid numbers for weight, reps, and rest.");
    return;
  }

  if (name.trim() === "") {
    alert("Please enter an exercise name.");
    return;
  }

  const workoutSet: WorkoutSet = { weight, reps, rest };

  const today = getToday();

  let workout = workouts.find((w) => w.date === today);

  if (!workout) {
    workout = { date: today, exercises: [] };
    workouts.push(workout);
  }

  const existing = workout.exercises.find(
    (ex) => ex.name.toLowerCase() === name.toLowerCase(),
  );

  if (existing) {
    existing.sets.push(workoutSet);
  } else {
    const newExercise: Exercise = { name, sets: [workoutSet] };
    workout.exercises.push(newExercise);
  }

  render();
  renderCalendar();
  save();

  weightInput.value = "";
  repsInput.value = "";
  restInput.value = "";
});

const list = document.getElementById("workout-list") as HTMLDivElement;

list.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("del-set")) {
  const exIndex = parseInt(target.dataset.ex as string);
  const setIndex = parseInt(target.dataset.set as string);

  const workout = workouts.find((w) => w.date === getToday());
  const exercise = workout?.exercises[exIndex];
  if (exercise) {
    exercise.sets.splice(setIndex, 1);
  }

  save();
  render();
  renderCalendar();
}

if (target.classList.contains("del-exercise")) {
  const exIndex = parseInt(target.dataset.ex as string);

  const workout = workouts.find((w) => w.date === getToday());
  if (workout) {
    workout.exercises.splice(exIndex, 1);

    if (workout.exercises.length === 0) {
      const wIndex = workouts.indexOf(workout);
      workouts.splice(wIndex, 1);
    }
  }

  save();
  render();
  renderCalendar();
}
});





function daysInCurrentMonth(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

function renderCalendar() {
  const grid = document.getElementById("calendar-grid") as HTMLDivElement;
  grid.innerHTML = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = daysInCurrentMonth();

  for (let day = 1; day <= days; day++) {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const hasWorkout = workouts.some((w) => w.date === dateStr);

    const cls = hasWorkout ? "trained" : "";

    grid.innerHTML += `<span class="${cls}">${day}</span>`;
  }
}

load();
renderCalendar();
render();
