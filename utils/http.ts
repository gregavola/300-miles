import axios from "axios";

export function getWorkouts(): Promise<any> {
  return axios.get(`/api/workouts`).then((response) => {
    return response.data;
  });
}
