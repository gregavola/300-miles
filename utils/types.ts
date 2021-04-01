export interface FrontPage {
  workouts?: WorkoutEvent[];
  metrics?: CampaignMetrics;
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

export interface Workout {
  workoutId: string;
  instructor: Instructor;
  createdAt: string;
  endTime: string;
  startTime: string;
  className: string;
  workOutput: number;
  status: string;
}

export interface Instructor {
  instructorId: string;
  name: string;
  imageUrl: string;
}
