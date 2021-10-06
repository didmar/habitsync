import {AxiosResponse} from "axios";

const axios = require('axios').default;
// axios.defaults.baseURL = 'http://192.168.0.28:3000';
axios.defaults.baseURL = 'http://127.0.0.1:3000';

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

export async function getHabits(): Promise<Habit[]> {
  return axios
      .get("/api/habits")
      .then((response: AxiosResponse<Array<any>>) => {
        return response.data.map((c: { id: string; description: string; checked: boolean; }) => {
          return new Habit(c.id, c.description, c.checked);
        });
      }).catch((error: any) => {
        console.log(error)
        return undefined
    });
}

export async function getHabit(id: string): Promise<Habit | undefined> {
  return undefined
}

export async function updateChecked(id: string, checked: boolean) {
    axios
        .put("/api/habits/" + id, {checked: checked})
        .catch((error: any) => {
            console.log(error)
        });
}
