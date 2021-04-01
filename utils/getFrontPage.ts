// Import Dependencies
import { addDays, parseISO, format } from "date-fns";
import connectToDatabase from "./db";
import { FrontPage } from "./types";

export async function getFrontPage(): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const db = await connectToDatabase(process.env.MONGODB_URI);

      const collection = await db.collection("workouts");
      const collectionDonations = await db.collection("donation");

      const cursor = await collection.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date("2021-04-01T00:00:00.000Z"),
              $lt: new Date("2021-05-01T00:00:00.000Z"),
            },
          },
        },
        {
          $project: {
            workoutId: "$workoutId",
            month: {
              $dateToString: {
                timezone: "America/New_York",
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
          },
        },
        {
          $group: {
            _id: { createdAt: "$month" },
            numberOfWorkOuts: { $sum: 1 },
          },
        },
        {
          $addFields: {
            createdAt: "$_id.createdAt",
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
        {
          $project: {
            _id: false,
          },
        },
      ]);

      const countWorkouts = await collection.countDocuments({
        createdAt: {
          $gte: new Date("2021-03-01T00:00:00.000Z"),
          $lt: new Date("2021-04-01T00:00:00.000Z"),
        },
      });

      const donationData = await collectionDonations.findOne({ id: 1 });

      const totalMiles = await collection.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date("2021-04-01T00:00:00.000Z"),
              $lt: new Date("2021-05-01T00:00:00.000Z"),
            },
          },
        },
        {
          $group: {
            _id: null,
            numberOfMiles: { $sum: "$workoutMetrics.distance.value" },
            numberOfCals: { $sum: "$workoutMetrics.calories.value" },
          },
        },
      ]);

      const fontPage: FrontPage = {
        metrics: {},
        dontations: {},
        workouts: [],
      };

      fontPage.metrics.totalWorkouts = countWorkouts;

      for await (const miles of totalMiles) {
        fontPage.metrics.totalMiles = miles.numberOfMiles;
        fontPage.metrics.totalCal = miles.numberOfCals;
      }

      fontPage.dontations = {
        total: donationData.total,
        lastUpdated: donationData.lastUpdated.toISOString(),
      };

      for await (const doc of cursor) {
        const date = doc.createdAt;

        let workoutItem = {
          dayOfMonth: parseInt(format(parseISO(date), "d")),
          date,
          items: [],
        };

        const results = await collection
          .find({
            createdAt: {
              $gte: parseISO(date),
              $lt: addDays(parseISO(date), 1),
            },
          })
          .sort({ createdAt: -1 });

        for await (const workout of results) {
          workoutItem.items.push({
            workoutId: workout.workoutId,
            instructor: workout.instructors,
            createdAt: workout.createdAt.toISOString(),
            endTime: workout.endTime.toISOString(),
            startTime: workout.startTime.toISOString(),
            className: workout.className,
            workOutput: workout.workOutput,
            status: workout.status,
          });

          fontPage.metrics.lastUpdated = workout.startTime.toISOString();
        }

        fontPage.workouts.push(workoutItem);
      }

      resolve(fontPage);
    } catch (exc) {
      reject(exc);
    }
  });
}
