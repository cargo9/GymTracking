import type { WorkoutSet, Exercise } from "./types.ts";

const exercises: Exercise[] = [];

function render() {
  const list = document.getElementById("workout-list") as HTMLDivElement;
  list.innerHTML = "";

  exercises.forEach((exercise, exIndex) => {
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
  localStorage.setItem("exercises", JSON.stringify(exercises));
}

function load() {
  const saved = localStorage.getItem("exercises");
  if (saved) {
    const parsed = JSON.parse(saved);
    exercises.push(...parsed);
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

  const existing = exercises.find(
    (ex) => ex.name.toLowerCase() === name.toLowerCase(),
  );

  if (existing) {
    existing.sets.push(workoutSet);
  } else {
    const newExercise: Exercise = { name: name, sets: [workoutSet] };
    exercises.push(newExercise);
  }

  render();
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
    const exercise = exercises[exIndex];
    if (exercise) {
      exercise.sets.splice(setIndex, 1);
    }
    save();
    render();
  }

  if (target.classList.contains("del-exercise")) {
    const exIndex = parseInt(target.dataset.ex as string);
    exercises.splice(exIndex, 1);
    save();
    render();
  }
});

load();
render();
