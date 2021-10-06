import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc
} from 'firebase/firestore';
import firebaseApp from "../Firebase";

const db = getFirestore(firebaseApp)

export class Habit {
  id: string;
  description: string;

  constructor (id: string, description: string) {
    this.id = id;
    this.description = description;
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
  const habitsList = habitsSnapshot.docs.map(doc => {
    const data = doc.data();
    return new Habit(doc.id, data.description);
  });
  return habitsList;
}

export async function getHabit(id: string): Promise<Habit | undefined> {
  const docRef = doc(db, "habits", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return new Habit(id, data.description);
  } else {
    return undefined;
  }
}

export async function updateChecked(measure: Measure, checked: boolean) {
  console.log("Updating habit " + measure.habitId + " to: " +checked)
  const measureRef = doc(db, 'habits', measure.habitId, 'measures', measure.day);
  const value = checked ? 1 : 0
  setDoc(measureRef, {day: measure.day, value: value}, { merge: true });
}

export async function getMeasure(habitId: string, date: Date): Promise<Measure> {
  const strDay = formatDate(date)
  const measureRef = doc(db, 'habits', habitId, 'measures', strDay);
  const measureSnap = await getDoc(measureRef)
  if (measureSnap.exists()) {
    const measureData = measureSnap.data()
    console.log("Get measure with value:")
    console.log(measureData.value)
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