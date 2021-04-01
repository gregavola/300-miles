import { getFrontPage } from "../../utils/getFrontPage";

export default async (req, res) => {
  const workouts = await getFrontPage();
  res.json(workouts);
};
