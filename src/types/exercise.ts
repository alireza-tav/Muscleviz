/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivationRole = 'primary' | 'secondary' | 'stabilizer';

export interface ExercisePhase {
  name: string;
  startTime: number;
  endTime: number;
  type?: 'setup' | 'lowering' | 'hold' | 'lifting';
}

export interface ExerciseMuscleTarget {
  muscleId: string;
  role: ActivationRole;
  label: string;
}

export interface InvolvementKeyframe {
  phaseProgress: number; // 0.0 to 1.0
  relativeInvolvement: number; // 0.0 to 1.0
}

export interface MuscleInvolvementCurve {
  muscleId: string;
  source: string;
  reviewStatus: string;
  keyframes: InvolvementKeyframe[];
}

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  englishName?: string;
  description: string;
  equipment: string;
  difficulty: string;
  category: string;
  animationId?: string;
  durationSeconds: number;
  phases: ExercisePhase[];
  setup: string;
  execution: string;
  breathing: string;
  commonMistakes: string[];
  targetMuscles: ExerciseMuscleTarget[];
  involvementCurves?: MuscleInvolvementCurve[];
}
