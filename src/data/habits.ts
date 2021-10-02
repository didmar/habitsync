export interface Habit {
  description: string;
  checked: boolean;
  id: number;
}

const habits: Habit[] = [
  {
    description: 'Meditate 10 min',
    checked: false,
    id: 0
  },
  {
    description: 'Run 30 min',
    checked: true,
    id: 1
  }
];

export const getHabits = () => habits;

export const getHabit = (id: number) => habits.find(m => m.id === id);
