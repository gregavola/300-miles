// Import Dependencies
import { addDays, parseISO, format } from "date-fns";
import connectToDatabase from "./db";
import { FrontPage } from "./types";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";

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

      let mostRecentActivity = null;

      const fontPage: FrontPage = {
        metrics: {
          totalMiles: 0,
          lastUpdated: new Date().toISOString(),
        },
        mostRecentWorkouts: [],
        dontations: {},
        workouts: [],
      };

      const countWorkouts = await collection.countDocuments({
        createdAt: {
          $gte: new Date("2021-04-01T00:00:00.000Z"),
          $lt: new Date("2021-05-01T00:00:00.000Z"),
        },
      });

      const lastWorkoutDate = await collection
        .find({
          createdAt: {
            $gte: new Date("2021-04-01T00:00:00.000Z"),
            $lt: new Date("2021-05-01T00:00:00.000Z"),
          },
        })
        .sort({
          createdAt: -1,
        })
        .limit(1);

      if (lastWorkoutDate) {
        for await (const allValues of lastWorkoutDate) {
          mostRecentActivity = await collection
            .find({
              createdAt: {
                $gte: startOfDay(allValues.createdAt),
                $lte: endOfDay(allValues.createdAt),
              },
            })
            .sort({
              createdAt: -1,
            });
        }

        if (mostRecentActivity) {
          for await (const recentWorkout of mostRecentActivity) {
            fontPage.mostRecentWorkouts.push({
              workoutId: recentWorkout.workoutId,
              instructor: recentWorkout.instructors,
              createdAt: recentWorkout.createdAt.toISOString(),
              endTime: recentWorkout.endTime
                ? recentWorkout.endTime.toISOString()
                : null,
              startTime: recentWorkout.startTime
                ? recentWorkout.startTime.toISOString()
                : null,
              className: recentWorkout.className,
              workOutput: recentWorkout.workOutput,
              totalMiles: recentWorkout.workoutMetrics.distance.value,
              status: recentWorkout.status,
            });
          }
        }
      }

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
            endTime: workout.endTime ? workout.endTime.toISOString() : null,
            startTime: workout.startTime
              ? workout.startTime.toISOString()
              : null,
            className: workout.className,
            workOutput: workout.workOutput,
            totalMiles: workout.workoutMetrics.distance.value,
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
