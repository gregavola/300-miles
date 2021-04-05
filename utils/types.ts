export interface FrontPage {
  workouts?: WorkoutEvent[];
  metrics?: CampaignMetrics;
  mostRecentWorkouts: Workout[];
  dontations?: DonationMetrics;
}

export interface WorkoutEvent {
  dayOfMonth?: number;
  date?: string;
  items?: Workout[];
}

export interface DonationMetrics {
  total?: number;
  lastUpdated?: string;
}

export interface CampaignMetrics {
  totalMiles?: number;
  totalWorkouts?: number;
  totalCal?: number;
  lastUpdated?: string;
}
export interface Metric {
  value: number;
  display_name: string;
  display_unit: string;
}

export interface GraphMetrics {
  value: number;
  display_name: string;
  display_unit: string;
  max_value: number;
  values: Array<number>;
  average_value: number;
}

export interface Workout {
  workoutId: string;
  instructor: Instructor;
  createdAt: string;
  endTime: string;
  startTime: string;
  className: string;
  workOutput: number;
  totalMiles: number;
  metrics?: GraphMetrics[];
  workoutMetrics?: {
    totalOutput: Metric;
    distance: Metric;
    calories: Metric;
  };
  status: string;
}

export interface Instructor {
  instructorId: string;
  name: string;
  imageUrl: string;
}
