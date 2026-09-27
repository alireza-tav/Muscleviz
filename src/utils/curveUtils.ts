/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export interface KeyframePoint {
  phaseProgress?: number;
  relativeInvolvement?: number;
  t?: number;
  value?: number;
}

/**
 * Deterministically evaluates a normalized curve at time progress in [0.0, 1.0].
 */
export function evaluateCurve(curve: KeyframePoint[] | undefined, progress: number): number {
  if (!curve || curve.length === 0) return 0;

  const clamped = Math.max(0, Math.min(1, progress));

  const getTime = (p: KeyframePoint) => (p.phaseProgress !== undefined ? p.phaseProgress : p.t ?? 0);
  const getVal = (p: KeyframePoint) => (p.relativeInvolvement !== undefined ? p.relativeInvolvement : p.value ?? 0);

  if (clamped <= getTime(curve[0])) return getVal(curve[0]);
  if (clamped >= getTime(curve[curve.length - 1])) return getVal(curve[curve.length - 1]);

  for (let i = 0; i < curve.length - 1; i++) {
    const p1 = curve[i];
    const p2 = curve[i + 1];
    const t1 = getTime(p1);
    const t2 = getTime(p2);

    if (clamped >= t1 && clamped <= t2) {
      const span = t2 - t1;
      if (span <= 0) return getVal(p1);
      const alpha = (clamped - t1) / span;
      return getVal(p1) + (getVal(p2) - getVal(p1)) * alpha;
    }
  }

  return getVal(curve[0]);
}

/**
 * Maps an estimated involvement intensity (0.0 to 1.0) to a Three.js Color and hex string.
 * Supports standard thermal gradient (charcoal -> amber -> deep crimson)
 * and colorblind-safe (viridis-style) palette.
 */
export function getMuscleInvolvementColor(
  intensity: number,
  isColorblind = false
): {
  color: THREE.Color;
  emissive: THREE.Color;
  emissiveIntensity: number;
  hex: string;
  label: string;
} {
  const norm = Math.max(0, Math.min(1, intensity));

  if (isColorblind) {
    let hex = '#242a38';
    let label = 'خفیف';
    let emiInt = 0.05;

    if (norm < 0.25) {
      hex = '#2a3b5c';
      label = 'درگیری ملایم';
      emiInt = 0.1;
    } else if (norm < 0.55) {
      hex = '#0284c7';
      label = 'درگیری متوسط';
      emiInt = 0.25;
    } else if (norm < 0.8) {
      hex = '#10b981';
      label = 'درگیری بالا';
      emiInt = 0.45;
    } else {
      hex = '#eab308';
      label = 'حداکثر انقباض';
      emiInt = 0.75;
    }

    const c = new THREE.Color(hex);
    return {
      color: c,
      emissive: c,
      emissiveIntensity: emiInt,
      hex,
      label,
    };
  }

  // Standard Bio-Thermal gradient: Charcoal -> Bronze -> Amber -> Fiery Crimson
  let hex = '#3e424c';
  let label = 'استراحت';
  let emiHex = '#000000';
  let emiInt = 0.0;

  if (norm < 0.25) {
    hex = '#4b5262';
    label = 'درگیری پایه‌ای';
    emiHex = '#000000';
    emiInt = 0.0;
  } else if (norm < 0.5) {
    hex = '#d97706'; // Amber-600
    label = 'درگیری متوسط';
    emiHex = '#b45309';
    emiInt = 0.35;
  } else if (norm < 0.75) {
    hex = '#f97316'; // Orange-500
    label = 'درگیری شدید';
    emiHex = '#ea580c';
    emiInt = 0.55;
  } else {
    hex = '#ef4444'; // Red-500 peak
    label = 'اوج انقباض';
    emiHex = '#dc2626';
    emiInt = 0.85;
  }

  return {
    color: new THREE.Color(hex),
    emissive: new THREE.Color(emiHex),
    emissiveIntensity: emiInt,
    hex,
    label,
  };
}
