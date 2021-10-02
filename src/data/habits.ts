import {collection, doc, getDoc, getDocs, getFirestore, setDoc} from 'firebase/firestore';
import firebaseApp from "../Firebase";

const db = getFirestore(firebaseApp)

export class Habit {
  id: string;
  description: string;
  checked: boolean;

  constructor (id: string, description: string, checked: boolean) {
    this.id = id;
    this.description = description;
    this.checked = checked;
  }
}

const habitsCol = collection(db, 'habits');

export async function getHabits(): Promise<Habit[]> {
  const habitsSnapshot = await getDocs(habitsCol);
  const habitsList = habitsSnapshot.docs.map(doc => {
    const data = doc.data();
    return new Habit(doc.id, data.description, data.checked);
  });
  return habitsList;

}

export async function getHabit(id: string): Promise<Habit | undefined> {
  const docRef = doc(db, "habits", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return new Habit(id, data.description, data.checked);
  } else {
    return undefined;
  }
}

export async function updateChecked(id: string, checked: boolean) {
  console.log("Updating habit " + id + " to: " +checked)
  const habitRef = doc(db, 'habits', id);
  setDoc(habitRef, { checked: checked }, { merge: true });
}
