import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import firebaseApp from "../Firebase";

const db = getFirestore(firebaseApp)

export enum MeasureKind {
  binary = "binary",
  quanti = "quanti",
}

export class MeasureType {
  kind: MeasureKind;
  unit: string | undefined;

  constructor (kind: MeasureKind, unit: string | undefined) {
    this.kind = kind;
    this.unit = unit;
  }
  toJSON() {
    if (this.kind === MeasureKind.binary) {
      return {
        kind: this.kind
      }
    } else {
      return {
        kind: this.kind,
        unit: this.unit,
      }
    }
  }
}

interface UnitDef {
  name: string;
  suffix: string | undefined;
}

export const units: UnitDef[] = [
  {
    "name": "seconds",
    "suffix": "s",
  },
  {
    "name": "minutes",
    "suffix": "m",
  },
  {
    "name": "meters",
    "suffix": "m",
  },
  {
    "name": "kilometers",
    "suffix": "km",
  },
  {
    "name": "other",
    "suffix": undefined,
  },
]

export class Habit {
  id: string;
  description: string;
  measureType: MeasureType;

  constructor (id: string, description: string, measureType: MeasureType) {
    this.id = id;
    this.description = description;
    this.measureType = measureType;
  }
}

export class Measure {
  habitId: string;
  day: string;
  value: number | undefined;

  constructor (habitId: string, day: string, value: number | undefined) {
    this.habitId = habitId;
    this.day = day;
    this.value = value;
  }
}

const habitsCol = collection(db, 'habits');

export async function getHabits(): Promise<Habit[]> {
  const habitsSnapshot = await getDocs(habitsCol);
  return habitsSnapshot.docs.map(doc => {
    const data = doc.data();
    return new Habit(doc.id, data.description, data.measureType);
  });
}

export async function getHabit(id: string): Promise<Habit | undefined> {
  const docRef = doc(db, "habits", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return new Habit(id, data.description, data.measureType);
  } else {
    return undefined;
  }
}

export async function addHabit(habit: Habit): Promise<Habit> {
  const docId = await addDoc(collection(db, "habits"), {
    description: habit.description,
    measureType: habit.measureType.toJSON(),
  }).then(docRef => docRef.id)
  return new Habit(docId, habit.description, habit.measureType)
}

export async function deleteHabit(habitId: string): Promise<void> {
  return deleteDoc(doc(db, "habits", habitId))
}

export async function updateMeasureValue(measure: Measure, value: number) {
  console.log("Updating habit " + measure.habitId + " to: " + value)
  const measureRef = doc(db, 'habits', measure.habitId, 'measures', measure.day);
  setDoc(measureRef, {day: measure.day, value: value}, { merge: true });
}

export async function getMeasure(habitId: string, date: Date): Promise<Measure> {
  const strDay = formatDate(date)
  const measureRef = doc(db, 'habits', habitId, 'measures', strDay);
  const measureSnap = await getDoc(measureRef)
  if (measureSnap.exists()) {
    const measureData = measureSnap.data()
    return new Measure(habitId, measureData.day, measureData.value)
  } else {
    return new Measure(habitId, strDay, undefined)
  }
}

export async function getMeasures(habitId: string, dates: Date[]): Promise<Measure[]> {
  return Promise.all(dates.map(d => getMeasure(habitId, d)))
}

export const formatDate = (d: Date): string => {
  let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}