import connectToDatabase from "./db";

export async function getTotalMiles(lastDate: string): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const db = await connectToDatabase(process.env.MONGODB_URI);

      const collection = await db.collection("workouts");

      const totalMiles = await collection.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date("2021-04-01T00:00:00.000Z"),
              $lt: new Date(lastDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            numberOfMiles: { $sum: "$workoutMetrics.distance.value" },
          },
        },
      ]);

      for await (const miles of totalMiles) {
        resolve(miles.numberOfMiles);
      }
    } catch (err) {
      reject(err);
    }
  });
}
