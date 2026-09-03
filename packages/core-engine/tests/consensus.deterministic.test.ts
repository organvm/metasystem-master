import { describe, expect, it } from 'vitest';
import {
  analyzeCluster,
  applyOverride,
  calculateSpatialWeight,
  computeConsensus,
  removeOutliers,
  smoothValue,
  weightInputs,
  weightedMean,
} from '../src/consensus/weighted-voting.js';
import {
  ConsensusMode,
  DEFAULT_WEIGHTING_CONFIG,
  type AudienceInput,
  type PerformerOverride,
} from '../src/types/index.js';

const STAGE = { x: 50, y: 0 };
const NOW = 1_800_000_000_000;

function input(index: number, value: number, x = 50, y = 0): AudienceInput {
  return {
    id: `input-${index}`,
    clientId: `client-${index}`,
    sessionId: 'deterministic-test',
    timestamp: NOW - index,
    parameter: 'intensity',
    value,
    location: { x, y },
  };
}

describe('deterministic consensus invariants', () => {
  it('gives an input at the stage greater spatial weight than a distant input', () => {
    const near = calculateSpatialWeight(STAGE, STAGE, DEFAULT_WEIGHTING_CONFIG);
    const far = calculateSpatialWeight({ x: 50, y: 100 }, STAGE, DEFAULT_WEIGHTING_CONFIG);
    expect(near).toBeGreaterThan(far);
  });

  it('preserves the mean for symmetric equally located values', () => {
    const inputs = [input(0, 0.2), input(1, 0.8)];
    const weighted = weightInputs(inputs, STAGE);
    expect(weightedMean(weighted)).toBeCloseTo(0.5, 6);
  });

  it('detects separated input clusters as bimodal', () => {
    const inputs = [0.1, 0.1, 0.1, 0.9, 0.9, 0.9].map((value, index) => input(index, value));
    const analysis = analyzeCluster(weightInputs(inputs, STAGE));
    expect(analysis.clusters).toHaveLength(2);
    expect(analysis.bimodality).toBe(true);
  });

  it('removes a sufficiently isolated outlier', () => {
    const inputs = [0.5, 0.5, 0.5, 0.5, 0.95].map((value, index) => input(index, value));
    const weighted = weightInputs(inputs, STAGE);
    expect(removeOutliers(weighted).length).toBeLessThan(weighted.length);
  });

  it('applies blend override without erasing audience consensus', () => {
    const override: PerformerOverride = {
      performerId: 'performer-1',
      parameter: 'intensity',
      value: 1,
      mode: 'blend',
      blendFactor: 0.25,
    };
    expect(applyOverride(0.2, override)).toBeCloseTo(0.4, 8);
  });

  it('computes a finite result for a deterministic 1,000-input cohort without asserting latency', () => {
    const inputs = Array.from({ length: 1_000 }, (_, index) =>
      input(index, (index % 101) / 100, index % 100, (index * 7) % 100),
    );
    const result = computeConsensus(
      'intensity',
      inputs,
      STAGE,
      DEFAULT_WEIGHTING_CONFIG,
      undefined,
      ConsensusMode.WEIGHTED_AVERAGE,
    );
    expect(result.inputCount).toBe(1_000);
    expect(Number.isFinite(result.value)).toBe(true);
    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.value).toBeLessThanOrEqual(1);
  });

  it('smooths toward the new value by the configured fraction', () => {
    expect(smoothValue(1, 0, 0.3)).toBeCloseTo(0.3, 8);
  });
});
