import connectToDatabase from "./db";

export async function getWorkout(id: string): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const db = await connectToDatabase(process.env.MONGODB_URI);

      const collection = await db.collection("workouts");

      const workout = await collection.findOne({ id });

      if (workout) {
        resolve({
          workoutId: workout.workoutId,
          instructor: workout.instructors,
          createdAt: workout.createdAt ? workout.createdAt.toISOString() : null,
          endTime: workout.endTime ? workout.endTime.toISOString() : null,
          startTime: workout.startTime ? workout.startTime.toISOString() : null,
          className: workout.className,
          workOutput: workout.workOutput,
          workoutMetrics: workout.workoutMetrics,
          metrics: workout.metrics,
          totalMiles: workout.workoutMetrics.distance.value,
          status: workout.status,
        });
      } else {
        reject(`${id} not found`);
      }
    } catch (exc) {
      reject(exc);
    }
  });
}
