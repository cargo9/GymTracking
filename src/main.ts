import type { WorkoutSet, Exercise, Workout } from "./types.ts";

const workouts: Workout[] = [];

type Lang = "en" | "ru";
type Unit = "kg" | "lb";
type Settings = { defaultRest: number; sound: boolean; lang: Lang; unit: Unit };
const settings: Settings = { defaultRest: 90, sound: false, lang: "en", unit: "kg" };

const KG_PER_LB = 0.45359237;

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    appTitle: "Workout Tracker",
    legendStrength: "Strength",
    legendCardio: "Cardio",
    settingsBtn: "Settings",
    settingsTitle: "Settings",
    settingsLanguage: "Language",
    settingsUnits: "Units",
    settingsDefaultRest: "Default rest",
    settingsSound: "Sound",
    settingsDarkTheme: "Dark theme",
    settingsDarkThemeHint: "Only dark theme is available for now",
    heroTitle: "Workout",
    statStreak: "Day streak",
    statVolume: "Volume",
    statDuration: "Session time",
    modeStrength: "Strength",
    modeCardio: "Cardio",
    fieldExercise: "Exercise name",
    fieldExercisePlaceholder: "Bench press",
    fieldWeight: "Weight",
    fieldWeightPlaceholder: "60",
    fieldReps: "Reps",
    fieldRepsPlaceholder: "8",
    fieldRest: "Rest after this set, s",
    fieldRestPlaceholder: "90",
    btnAddSet: "Add set",
    fieldCardio: "Cardio duration, min",
    fieldCardioPlaceholder: "30",
    btnAddCardio: "Add cardio",
    timerTitleRest: "Rest timer",
    timerTitleCardio: "Cardio timer",
    timerIdleLabelStrength: "Add a set",
    timerIdleSublabelStrength: "the rest timer will start automatically",
    timerIdleLabelCardio: "Add cardio",
    timerIdleSublabelCardio: "the cardio timer will start automatically",
    timerRunning: "In progress",
    timerSetWord: "Set",
    timerDoneRest: "Rest finished, go again",
    timerDoneCardio: "Cardio finished",
    timerReset: "Reset timer",
    todayTitle: "Today",
    weekTitle: "This week",
    prTitle: "Personal records",
    prEmpty: "No data yet",
    deleteAll: "Delete all",
    weekWord: "Week",
    alertNumbers: "Please enter valid numbers for weight, reps, and rest.",
    alertName: "Please enter an exercise name.",
    alertCardio: "Please enter cardio duration in minutes.",
    unitKg: "kg",
    unitLb: "lb",
    cardioMinUnit: "min",
    restRow: "rest",
    secUnit: "s",
  },
  ru: {
    appTitle: "Трекер тренировок",
    legendStrength: "Сила",
    legendCardio: "Кардио",
    settingsBtn: "Настройки",
    settingsTitle: "Настройки",
    settingsLanguage: "Язык",
    settingsUnits: "Единицы",
    settingsDefaultRest: "Отдых по умолчанию",
    settingsSound: "Звук",
    settingsDarkTheme: "Тёмная тема",
    settingsDarkThemeHint: "Пока доступна только тёмная тема",
    heroTitle: "Тренировка",
    statStreak: "Дней подряд",
    statVolume: "Тоннаж",
    statDuration: "Время тренировки",
    modeStrength: "Силовая",
    modeCardio: "Кардио",
    fieldExercise: "Название упражнения",
    fieldExercisePlaceholder: "Жим лёжа",
    fieldWeight: "Вес",
    fieldWeightPlaceholder: "60",
    fieldReps: "Повторы",
    fieldRepsPlaceholder: "8",
    fieldRest: "Отдых после подхода, с",
    fieldRestPlaceholder: "90",
    btnAddSet: "Добавить подход",
    fieldCardio: "Длительность кардио, мин",
    fieldCardioPlaceholder: "30",
    btnAddCardio: "Добавить кардио",
    timerTitleRest: "Таймер отдыха",
    timerTitleCardio: "Таймер кардио",
    timerIdleLabelStrength: "Добавьте подход",
    timerIdleSublabelStrength: "таймер отдыха запустится сам",
    timerIdleLabelCardio: "Добавьте кардио",
    timerIdleSublabelCardio: "таймер кардио запустится сам",
    timerRunning: "Идёт",
    timerSetWord: "Подход",
    timerDoneRest: "Отдых окончен, продолжайте",
    timerDoneCardio: "Кардио завершено",
    timerReset: "Сбросить таймер",
    todayTitle: "Сегодня",
    weekTitle: "Эта неделя",
    prTitle: "Личные рекорды",
    prEmpty: "Пока нет данных",
    deleteAll: "Удалить всё",
    weekWord: "Неделя",
    alertNumbers: "Введите корректные числа веса, повторов и отдыха.",
    alertName: "Введите название упражнения.",
    alertCardio: "Введите длительность кардио в минутах.",
    unitKg: "кг",
    unitLb: "фунт",
    cardioMinUnit: "мин",
    restRow: "отдых",
    secUnit: "с",
  },
};

function t(key: string): string {
  return STRINGS[settings.lang][key] ?? key;
}

const MONTH_NAMES: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
};
const WEEKDAY_FULL: Record<Lang, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  ru: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
};
const WEEKDAY_SHORT: Record<Lang, string[]> = {
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
};

const TRASH_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;

function getToday(): string {
  return new Date().toISOString().substring(0, 10);
}

function dateToStr(d: Date): string {
  return d.toISOString().substring(0, 10);
}

function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function hasActivity(w: Workout | undefined): boolean {
  return !!w && (w.exercises.length > 0 || w.cardio.length > 0);
}

function findWorkout(date: string): Workout | undefined {
  return workouts.find((w) => w.date === date);
}

// ---- units ----

function unitLabel(): string {
  return settings.unit === "lb" ? t("unitLb") : t("unitKg");
}

function kgToDisplay(kg: number): number {
  return settings.unit === "lb" ? kg / KG_PER_LB : kg;
}

function displayToKg(value: number): number {
  return settings.unit === "lb" ? value * KG_PER_LB : value;
}

function formatWeight(kg: number): string {
  const val = kgToDisplay(kg);
  const rounded = Math.round(val * 10) / 10;
  const text = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
  return `${text} ${unitLabel()}`;
}

function formatVolume(totalKg: number): string {
  if (settings.unit === "lb") {
    return `${Math.round(totalKg / KG_PER_LB)} ${t("unitLb")}`;
  }
  if (totalKg >= 1000) {
    return `${(totalKg / 1000).toFixed(1)}${settings.lang === "ru" ? "т" : "t"}`;
  }
  return `${Math.round(totalKg)} ${t("unitKg")}`;
}

// ---- today list ----

function render() {
  const list = document.getElementById("workout-list") as HTMLDivElement;
  list.innerHTML = "";

  const today = getToday();
  const workout = findWorkout(today);

  workout?.exercises.forEach((exercise, exIndex) => {
    list.innerHTML += `<div>
      <strong>${exercise.name}</strong>
      <button class="del-exercise" data-ex="${exIndex}">${TRASH_ICON}<span>${t("deleteAll")}</span></button>
    </div>`;
    exercise.sets.forEach((set, setIndex) => {
      list.innerHTML += `<div>
        ${formatWeight(set.weight)} × ${set.reps} — ${t("restRow")} ${set.rest}${t("secUnit")}
        <button class="del-set" data-ex="${exIndex}" data-set="${setIndex}">${TRASH_ICON}</button>
      </div>`;
    });
  });

  if (workout && workout.cardio.length > 0) {
    list.innerHTML += `<div>
      <strong>${t("legendCardio")}</strong>
    </div>`;
    workout.cardio.forEach((entry, cIndex) => {
      list.innerHTML += `<div class="cardio-row">
        ${entry.minutes} ${t("cardioMinUnit")}
        <button class="del-cardio" data-cardio="${cIndex}">${TRASH_ICON}</button>
      </div>`;
    });
  }
}

function save() {
  localStorage.setItem("workouts", JSON.stringify(workouts));
}

function load() {
  const saved = localStorage.getItem("workouts");
  if (saved) {
    const parsed: Workout[] = JSON.parse(saved);
    const normalized = parsed.map((w) => ({ ...w, cardio: w.cardio ?? [] }));
    workouts.push(...normalized.filter((w) => w.exercises.length > 0 || w.cardio.length > 0));
  }
}

function loadSettings() {
  const raw = localStorage.getItem("settings");
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    if (typeof parsed.defaultRest === "number") settings.defaultRest = parsed.defaultRest;
    if (typeof parsed.sound === "boolean") settings.sound = parsed.sound;
    if (parsed.lang === "en" || parsed.lang === "ru") settings.lang = parsed.lang;
    if (parsed.unit === "kg" || parsed.unit === "lb") settings.unit = parsed.unit;
  } catch {
    // ignore corrupt settings
  }
}

function saveSettings() {
  localStorage.setItem("settings", JSON.stringify(settings));
}

// ---- rest timer ----

let timerInterval: number | undefined;

function playBeep() {
  try {
    const AudioCtxCtor = window.AudioContext;
    const ctx = new AudioCtxCtor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.42);
  } catch {
    // ignore, sound is a non-critical nicety
  }
}

function timerModeIsCardio(): boolean {
  return (document.getElementById("mode-cardio") as HTMLInputElement).checked;
}

function paintIdleTimer() {
  const cardio = timerModeIsCardio();
  const title = cardio ? t("timerTitleCardio") : t("timerTitleRest");
  const label = cardio ? t("timerIdleLabelCardio") : t("timerIdleLabelStrength");
  const sublabel = cardio ? t("timerIdleSublabelCardio") : t("timerIdleSublabelStrength");

  (document.getElementById("timer-title") as HTMLElement).textContent = title;
  (document.getElementById("timer-ring") as HTMLDivElement).style.background = "conic-gradient(#322b27 0turn 1turn)";
  (document.getElementById("timer-time") as HTMLSpanElement).textContent = "—:—";
  (document.getElementById("timer-label") as HTMLSpanElement).textContent = label;
  (document.getElementById("timer-sublabel") as HTMLSpanElement).textContent = sublabel;
}

function startTimer(seconds: number, title: string, label: string, sublabel: string, doneText: string) {
  if (timerInterval !== undefined) {
    window.clearInterval(timerInterval);
  }

  const ring = document.getElementById("timer-ring") as HTMLDivElement;
  const timeEl = document.getElementById("timer-time") as HTMLSpanElement;
  const titleEl = document.getElementById("timer-title") as HTMLElement;
  const labelEl = document.getElementById("timer-label") as HTMLSpanElement;
  const sublabelEl = document.getElementById("timer-sublabel") as HTMLSpanElement;

  titleEl.textContent = title;
  labelEl.textContent = label;
  sublabelEl.textContent = sublabel;

  const total = Math.max(1, seconds);
  let remaining = seconds;

  function paint() {
    const frac = Math.max(0, remaining / total);
    ring.style.background = `conic-gradient(#c67139 0turn ${frac}turn, #322b27 ${frac}turn 1turn)`;
    const clamped = Math.max(0, remaining);
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    timeEl.textContent = `${m}:${String(s).padStart(2, "0")}`;
  }

  paint();
  timerInterval = window.setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      paint();
      window.clearInterval(timerInterval);
      timerInterval = undefined;
      sublabelEl.textContent = doneText;
      if (settings.sound) playBeep();
      return;
    }
    paint();
  }, 1000);
}

function resetTimerDisplay() {
  if (timerInterval !== undefined) {
    window.clearInterval(timerInterval);
    timerInterval = undefined;
  }
  paintIdleTimer();
}

(document.getElementById("timer-reset") as HTMLButtonElement).addEventListener("click", resetTimerDisplay);

(document.getElementById("mode-strength") as HTMLInputElement).addEventListener("change", () => {
  if (timerInterval === undefined) paintIdleTimer();
});
(document.getElementById("mode-cardio") as HTMLInputElement).addEventListener("change", () => {
  if (timerInterval === undefined) paintIdleTimer();
});

// ---- stats / calendar / week chart / personal records ----

function renderStats() {
  const today = getToday();
  const workout = findWorkout(today);

  let streak = 0;
  const cursor = new Date();
  if (!hasActivity(workout)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (hasActivity(findWorkout(dateToStr(cursor)))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  let volumeKg = 0;
  workout?.exercises.forEach((ex) => ex.sets.forEach((s) => { volumeKg += s.weight * s.reps; }));

  let durationText = "—";
  if (workout?.startedAt) {
    const end = workout.updatedAt ?? workout.startedAt;
    const minutes = Math.max(0, Math.round((end - workout.startedAt) / 60000));
    durationText = `${minutes}′`;
  }

  (document.getElementById("stat-streak") as HTMLSpanElement).textContent = String(streak);
  (document.getElementById("stat-volume") as HTMLSpanElement).textContent = formatVolume(volumeKg);
  (document.getElementById("stat-duration") as HTMLSpanElement).textContent = durationText;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function sessionsLabel(n: number): string {
  if (settings.lang === "en") return `${n} session${n === 1 ? "" : "s"}`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  let word = "занятий";
  if (mod10 === 1 && mod100 !== 11) word = "занятие";
  else if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) word = "занятия";
  return `${n} ${word}`;
}

function renderWeekdayHeader() {
  const el = document.getElementById("calendar-weekdays") as HTMLDivElement;
  el.innerHTML = (WEEKDAY_SHORT[settings.lang] ?? []).map((d) => `<span>${d}</span>`).join("");
}

function renderCalendar() {
  const grid = document.getElementById("calendar-grid") as HTMLDivElement;
  grid.innerHTML = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = daysInMonth(year, month);
  const today = getToday();

  const offset = mondayIndex(new Date(year, month, 1));
  for (let i = 0; i < offset; i++) {
    grid.innerHTML += "<span></span>";
  }

  let sessions = 0;

  for (let day = 1; day <= days; day++) {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const workout = findWorkout(dateStr);
    const hasStrength = !!workout && workout.exercises.length > 0;
    const hasCardio = !!workout && workout.cardio.length > 0;
    const isToday = dateStr === today;

    if (hasStrength || hasCardio) sessions++;

    let cls = "day";
    if (isToday && (hasStrength || hasCardio)) {
      cls += hasStrength ? " day-today-active-strength" : " day-today-active-cardio";
    } else if (isToday) {
      cls += " day-today";
    } else if (hasStrength) {
      cls += " day-strength";
    } else if (hasCardio) {
      cls += " day-cardio";
    }

    const badge = hasStrength && hasCardio;

    grid.innerHTML += `<span class="day-cell"><span class="${cls}">${day}</span>${badge ? '<span class="day-badge"></span>' : ""}</span>`;
  }

  (document.getElementById("calendar-title") as HTMLElement).textContent =
    `${MONTH_NAMES[settings.lang]?.[month] ?? ""} ${year}`;
  (document.getElementById("calendar-sessions") as HTMLElement).textContent = sessionsLabel(sessions);
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - mondayIndex(d));
  return d;
}

function renderWeekChart() {
  const container = document.getElementById("week-chart") as HTMLDivElement;
  container.innerHTML = "";

  const today = getToday();
  const monday = startOfWeek(new Date());
  const shortLabels = WEEKDAY_SHORT[settings.lang] ?? [];

  const dayInfos = shortLabels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const ds = dateToStr(d);
    const workout = findWorkout(ds);
    let vol = 0;
    workout?.exercises.forEach((ex) => ex.sets.forEach((s) => { vol += s.weight * s.reps; }));
    let cardioMin = 0;
    workout?.cardio.forEach((c) => { cardioMin += c.minutes; });
    return { label, vol, cardioMin, isToday: ds === today };
  });

  const maxVol = Math.max(1, ...dayInfos.map((d) => d.vol));
  const maxCardio = Math.max(1, ...dayInfos.map((d) => d.cardioMin));

  dayInfos.forEach((info) => {
    const hasStrength = info.vol > 0;
    const hasCardio = info.cardioMin > 0;

    let barClass = "week-bar";
    let heightPx = 12;

    if (info.isToday && (hasStrength || hasCardio)) {
      barClass += " week-bar-today";
      heightPx = Math.max(12, Math.round(70 * Math.max(info.vol / maxVol, info.cardioMin / maxCardio)));
    } else if (hasStrength) {
      barClass += " week-bar-strength";
      heightPx = Math.max(12, Math.round(70 * (info.vol / maxVol)));
    } else if (hasCardio) {
      barClass += " week-bar-cardio";
      heightPx = Math.max(12, Math.round(70 * (info.cardioMin / maxCardio)));
    }

    const labelClass = info.isToday ? "week-day-label week-day-label-today" : "week-day-label";

    container.innerHTML += `<div class="week-bar-col">
      <div class="${barClass}" style="width:100%;height:${heightPx}px"></div>
      <span class="${labelClass}">${info.label}</span>
    </div>`;
  });
}

function renderPR() {
  const container = document.getElementById("pr-list") as HTMLDivElement;
  container.innerHTML = "";

  const best = new Map<string, { display: string; weight: number }>();
  workouts.forEach((w) => w.exercises.forEach((ex) => {
    const key = ex.name.trim().toLowerCase();
    if (!key) return;
    ex.sets.forEach((s) => {
      const existing = best.get(key);
      if (!existing || s.weight > existing.weight) {
        best.set(key, { display: ex.name.trim(), weight: s.weight });
      }
    });
  }));

  const entries = Array.from(best.values()).sort((a, b) => b.weight - a.weight).slice(0, 5);

  if (entries.length === 0) {
    container.innerHTML = `<div class="pr-empty">${t("prEmpty")}</div>`;
    return;
  }

  entries.forEach((e) => {
    container.innerHTML += `<div class="pr-row">
      <span class="pr-name">${e.display}</span>
      <span class="pr-value">${formatWeight(e.weight)}</span>
    </div>`;
  });
}

function refreshAll() {
  render();
  renderWeekdayHeader();
  renderCalendar();
  renderStats();
  renderWeekChart();
  renderPR();
  save();
}

// ---- header (weekday · week number) ----

function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const diff = d.getTime() - firstThursday.getTime();
  return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
}

function renderTodayLabel() {
  const now = new Date();
  const weekday = WEEKDAY_FULL[settings.lang]?.[now.getDay()] ?? "";
  (document.getElementById("today-label") as HTMLElement).textContent =
    `${weekday} · ${t("weekWord")} ${isoWeekNumber(now)}`;
}

// ---- translations ----

function applyTranslations() {
  document.title = t("appTitle");

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });

  document.querySelectorAll<HTMLInputElement>("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = t(key);
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key) el.title = t(key);
  });

  const weightLabel = document.getElementById("weight-label");
  if (weightLabel) weightLabel.textContent = `${t("fieldWeight")}, ${unitLabel()}`;

  if (timerInterval === undefined) paintIdleTimer();
}

// ---- strength form ----

const addSetBtn = document.getElementById("add-set") as HTMLButtonElement;

addSetBtn.addEventListener("click", () => {
  const nameInput = document.getElementById("exercise-name") as HTMLInputElement;
  const weightInput = document.getElementById("weight") as HTMLInputElement;
  const repsInput = document.getElementById("reps") as HTMLInputElement;
  const restInput = document.getElementById("rest") as HTMLInputElement;

  const name = nameInput.value;
  const enteredWeight = parseFloat(weightInput.value);
  const reps = parseInt(repsInput.value);
  const rest = parseInt(restInput.value);

  if (isNaN(enteredWeight) || isNaN(reps) || isNaN(rest)) {
    alert(t("alertNumbers"));
    return;
  }

  if (name.trim() === "") {
    alert(t("alertName"));
    return;
  }

  const weight = displayToKg(enteredWeight);
  const workoutSet: WorkoutSet = { weight, reps, rest };

  const today = getToday();

  let workout = findWorkout(today);

  if (!workout) {
    workout = { date: today, exercises: [], cardio: [], startedAt: Date.now() };
    workouts.push(workout);
  }
  workout.updatedAt = Date.now();

  const existing = workout.exercises.find(
    (ex) => ex.name.toLowerCase() === name.toLowerCase(),
  );

  let setsCount: number;
  if (existing) {
    existing.sets.push(workoutSet);
    setsCount = existing.sets.length;
  } else {
    const newExercise: Exercise = { name, sets: [workoutSet] };
    workout.exercises.push(newExercise);
    setsCount = 1;
  }

  refreshAll();
  startTimer(rest, t("timerTitleRest"), name.trim(), `${t("timerSetWord")} ${setsCount}`, t("timerDoneRest"));

  weightInput.value = "";
  repsInput.value = "";
  restInput.value = String(settings.defaultRest);
});

// ---- cardio form ----

const addCardioBtn = document.getElementById("add-cardio") as HTMLButtonElement;

addCardioBtn.addEventListener("click", () => {
  const minutesInput = document.getElementById("cardio-minutes") as HTMLInputElement;
  const minutes = parseInt(minutesInput.value);

  if (isNaN(minutes) || minutes <= 0) {
    alert(t("alertCardio"));
    return;
  }

  const today = getToday();
  let workout = findWorkout(today);

  if (!workout) {
    workout = { date: today, exercises: [], cardio: [], startedAt: Date.now() };
    workouts.push(workout);
  }
  workout.updatedAt = Date.now();
  workout.cardio.push({ minutes });

  refreshAll();
  startTimer(minutes * 60, t("timerTitleCardio"), t("legendCardio"), t("timerRunning"), t("timerDoneCardio"));

  minutesInput.value = "";
});

// ---- delete handlers ----

function pruneIfEmpty(workout: Workout) {
  if (workout.exercises.length === 0 && workout.cardio.length === 0) {
    const wIndex = workouts.indexOf(workout);
    if (wIndex !== -1) workouts.splice(wIndex, 1);
  }
}

const list = document.getElementById("workout-list") as HTMLDivElement;

list.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest("button") as HTMLElement | null;
  if (!target) return;

  if (target.classList.contains("del-set")) {
    const exIndex = parseInt(target.dataset.ex as string);
    const setIndex = parseInt(target.dataset.set as string);

    const workout = findWorkout(getToday());
    const exercise = workout?.exercises[exIndex];
    if (exercise) {
      exercise.sets.splice(setIndex, 1);
    }
    if (workout) pruneIfEmpty(workout);

    refreshAll();
  }

  if (target.classList.contains("del-exercise")) {
    const exIndex = parseInt(target.dataset.ex as string);

    const workout = findWorkout(getToday());
    if (workout) {
      workout.exercises.splice(exIndex, 1);
      pruneIfEmpty(workout);
    }

    refreshAll();
  }

  if (target.classList.contains("del-cardio")) {
    const cIndex = parseInt(target.dataset.cardio as string);

    const workout = findWorkout(getToday());
    if (workout) {
      workout.cardio.splice(cIndex, 1);
      pruneIfEmpty(workout);
    }

    refreshAll();
  }
});

// ---- settings ----

function initSettingsUI() {
  const soundToggle = document.getElementById("sound-toggle") as HTMLInputElement;
  soundToggle.checked = settings.sound;
  soundToggle.addEventListener("change", () => {
    settings.sound = soundToggle.checked;
    saveSettings();
  });

  const restValueEl = document.getElementById("rest-default-value") as HTMLSpanElement;
  function paintRestValue() {
    restValueEl.textContent = `${settings.defaultRest}${t("secUnit")}`;
  }
  paintRestValue();

  (document.getElementById("rest-default-minus") as HTMLButtonElement).addEventListener("click", () => {
    settings.defaultRest = Math.max(0, settings.defaultRest - 5);
    paintRestValue();
    saveSettings();
    const restInput = document.getElementById("rest") as HTMLInputElement;
    if (restInput.value === "") restInput.value = String(settings.defaultRest);
  });
  (document.getElementById("rest-default-plus") as HTMLButtonElement).addEventListener("click", () => {
    settings.defaultRest = Math.min(600, settings.defaultRest + 5);
    paintRestValue();
    saveSettings();
    const restInput = document.getElementById("rest") as HTMLInputElement;
    if (restInput.value === "") restInput.value = String(settings.defaultRest);
  });

  const unitButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("#unit-toggle .mini-toggle-btn"));
  function paintUnitButtons() {
    unitButtons.forEach((b) => b.classList.toggle("active", b.dataset.unit === settings.unit));
  }
  paintUnitButtons();
  unitButtons.forEach((b) => b.addEventListener("click", () => {
    settings.unit = b.dataset.unit === "lb" ? "lb" : "kg";
    saveSettings();
    paintUnitButtons();
    applyTranslations();
    refreshAll();
  }));

  const langButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("#lang-toggle .mini-toggle-btn"));
  function paintLangButtons() {
    langButtons.forEach((b) => b.classList.toggle("active", b.dataset.lang === settings.lang));
  }
  paintLangButtons();
  langButtons.forEach((b) => b.addEventListener("click", () => {
    settings.lang = b.dataset.lang === "ru" ? "ru" : "en";
    saveSettings();
    paintLangButtons();
    applyTranslations();
    paintRestValue();
    renderTodayLabel();
    refreshAll();
  }));
}

// ---- boot ----

loadSettings();
load();
applyTranslations();
initSettingsUI();
renderTodayLabel();
refreshAll();

(document.getElementById("rest") as HTMLInputElement).value = String(settings.defaultRest);
