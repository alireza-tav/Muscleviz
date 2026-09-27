export interface SetEntry {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number;
  weight: number; // always stored in user's active unit
  rpe?: number; // 6-10 Rate of Perceived Exertion
  isCompleted: boolean;
}

export interface WorkoutExercisePlan {
  exerciseId: string;
  targetSets: number;
  targetReps: string;
  targetWeight?: number;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  splitName: string;
  description: string;
  exercises: WorkoutExercisePlan[];
  createdAt: string;
}

export interface WorkoutSessionLog {
  id: string;
  planId?: string;
  title: string;
  startedAt: string;
  completedAt?: string;
  durationMinutes: number;
  exerciseLogs: Array<{
    exerciseId: string;
    sets: SetEntry[];
    notes?: string;
  }>;
  totalVolume: number; // sum of (weight * reps)
  notes?: string;
}

export interface CoachClient {
  id: string;
  name: string;
  avatarUrl?: string;
  status: 'active' | 'pending';
  assignedPlanId?: string;
  lastSessionDate?: string;
  goal: string;
  coachNotes?: string;
}
