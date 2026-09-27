/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MuscleGroupId =
  | 'chest'
  | 'deltoid_anterior'
  | 'deltoid_lateral'
  | 'deltoid_posterior'
  | 'biceps'
  | 'triceps'
  | 'latissimus_dorsi'
  | 'trapezius'
  | 'abdominals'
  | 'obliques'
  | 'glutes'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves';

export interface MuscleGroupData {
  id: string;
  name: string;
  latinName: string;
  category: string;
  side: 'front' | 'back' | 'both';
  description: string;
  functionInfo: string;
  trainingTips: string[];
  meshRegionIds: string[];
}

export type MuscleSide = 'left' | 'right' | 'bilateral';

export interface MuscleRegion {
  id: string;
  groupId: MuscleGroupId;
  name: string;
  latinName: string;
  side: MuscleSide;
  function: string;
  description: string;
  techniqueTip: string;
}
