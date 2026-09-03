import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  ParameterBus,
  BusEvent,
  createBus,
} from '../src/bus/parameter-bus.js';
import {
  AudienceInputsHandler,
  createAudienceInputsHandler,
} from '../src/bus/audience-inputs.js';
import {
  PerformerSubscriptions,
  createPerformerSubscriptions,
} from '../src/bus/performer-subscriptions.js';
import {
  ConsensusMode,
  type AudienceInput,
  type ConsensusResult,
  type PerformerOverride,
} from '../src/types/index.js';

const NOW = 1_800_000_000_000;

function consensusResult(): ConsensusResult {
  return {
    parameter: 'mood',
    value: 0.6,
    confidence: 0.9,
    inputCount: 10,
    timestamp: NOW,
    mode: ConsensusMode.WEIGHTED_AVERAGE,
    rawMean: 0.6,
    weightedMean: 0.6,
    standardDeviation: 0.1,
    participationRate: 1,
  };
}

describe('ParameterBus', () => {
  let bus: ParameterBus;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    bus = createBus();
  });

  afterEach(() => {
    bus.dispose();
    vi.useRealTimers();
  });

  describe('event publishing', () => {
    it('emits audience input events', () => {
      const handler = vi.fn();
      bus.subscribe(BusEvent.AUDIENCE_INPUT, handler);

      const input: AudienceInput = {
        id: 'test-id',
        clientId: 'client-1',
        sessionId: 'session-1',
        timestamp: NOW,
        parameter: 'mood',
        value: 0.7,
      };

      bus.publishInput(input);

      expect(handler).toHaveBeenCalledWith(input);
    });

    it('emits consensus update events', () => {
      const handler = vi.fn();
      bus.subscribe(BusEvent.CONSENSUS_UPDATE, handler);
      const result = consensusResult();

      bus.publishConsensus(result);

      expect(handler).toHaveBeenCalledWith(result);
    });

    it('emits performer override events', () => {
      const handler = vi.fn();
      bus.subscribe(BusEvent.PERFORMER_OVERRIDE, handler);

      const override: PerformerOverride = {
        performerId: 'performer-1',
        parameter: 'mood',
        value: 0.8,
        mode: 'absolute',
      };

      bus.publishOverride(override);

      expect(handler).toHaveBeenCalledWith(override);
    });
  });

  describe('subscription management', () => {
    it('allows unsubscribing from events', () => {
      const handler = vi.fn();
      const unsubscribe = bus.subscribe(BusEvent.AUDIENCE_INPUT, handler);

      unsubscribe();
      bus.publishInput({
        id: 'test',
        clientId: 'client',
        sessionId: 'session',
        timestamp: NOW,
        parameter: 'mood',
        value: 0.5,
      });

      expect(handler).not.toHaveBeenCalled();
    });

    it('supports multiple subscribers', () => {
      const first = vi.fn();
      const second = vi.fn();
      bus.subscribe(BusEvent.CONSENSUS_UPDATE, first);
      bus.subscribe(BusEvent.CONSENSUS_UPDATE, second);

      bus.publishConsensus(consensusResult());

      expect(first).toHaveBeenCalledTimes(1);
      expect(second).toHaveBeenCalledTimes(1);
    });

    it('supports one-shot subscriptions', () => {
      const handler = vi.fn();
      bus.subscribeOnce(BusEvent.SESSION_START, handler);

      bus.publish(BusEvent.SESSION_START, { sessionId: 'test' });
      bus.publish(BusEvent.SESSION_START, { sessionId: 'test' });

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('removes listeners during disposal', () => {
      const handler = vi.fn();
      bus.subscribe(BusEvent.WARNING, handler);

      bus.dispose();
      bus.publish(BusEvent.WARNING, { code: 'test', message: 'test' });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('statistics', () => {
    it('collects input rates using the scheduled one-second window', () => {
      for (let index = 0; index < 10; index += 1) {
        bus.publishInput({
          id: `input-${index}`,
          clientId: 'client',
          sessionId: 'session',
          timestamp: NOW,
          parameter: 'mood',
          value: index / 10,
        });
      }

      vi.advanceTimersByTime(1_000);

      expect(bus.getStats().inputsPerSecond).toBeCloseTo(10, 8);
    });
  });
});

describe('AudienceInputsHandler', () => {
  let bus: ParameterBus;
  let handler: AudienceInputsHandler;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    bus = createBus();
    handler = createAudienceInputsHandler(
      bus,
      'test-session',
      ['mood', 'tempo', 'intensity'],
    );
  });

  afterEach(() => {
    handler.destroy();
    bus.dispose();
    vi.useRealTimers();
  });

  describe('input handling', () => {
    it('accepts valid input', () => {
      expect(handler.handleInput('client-1', 'mood', 0.5).accepted).toBe(true);
    });

    it('rejects invalid parameter', () => {
      const result = handler.handleInput('client-1', 'invalid', 0.5);
      expect(result).toEqual({ accepted: false, reason: 'invalid_parameter' });
    });

    it('rejects out-of-range and non-finite values', () => {
      expect(handler.handleInput('client-1', 'mood', -0.1).reason).toBe('invalid_value');
      expect(handler.handleInput('client-2', 'mood', 1.1).reason).toBe('invalid_value');
      expect(handler.handleInput('client-3', 'mood', Number.NaN).reason).toBe('invalid_value');
    });

    it('rate limits rapid inputs from one client', () => {
      handler.handleInput('client-1', 'mood', 0.5);
      const result = handler.handleInput('client-1', 'mood', 0.6);

      expect(result).toEqual({ accepted: false, reason: 'rate_limited' });
    });

    it('publishes a deterministic batch after the configured interval', () => {
      const batchHandler = vi.fn();
      bus.subscribe(BusEvent.AUDIENCE_INPUT_BATCH, batchHandler);
      handler.handleInput('client-1', 'mood', 0.5);

      vi.advanceTimersByTime(50);

      expect(batchHandler).toHaveBeenCalledTimes(1);
      expect(batchHandler.mock.calls[0]?.[0]).toHaveLength(1);
    });
  });

  describe('client management', () => {
    it('tracks client locations', () => {
      handler.handleInput('client-1', 'mood', 0.5);
      handler.updateClientLocation('client-1', { x: 50, y: 30 });

      expect(handler.getClientState('client-1')?.location).toEqual({ x: 50, y: 30 });
    });

    it('removes client state', () => {
      handler.handleInput('client-1', 'mood', 0.5);
      handler.removeClient('client-1');

      expect(handler.getClientState('client-1')).toBeUndefined();
    });

    it('blocks, unblocks, and then enforces the remaining rate-limit window', () => {
      handler.handleInput('client-1', 'mood', 0.5);
      handler.blockClient('client-1', 1_000);

      expect(handler.handleInput('client-1', 'mood', 0.6).reason).toBe('client_blocked');

      handler.unblockClient('client-1');
      expect(handler.handleInput('client-1', 'mood', 0.7).reason).toBe('rate_limited');

      vi.advanceTimersByTime(100);
      expect(handler.handleInput('client-1', 'mood', 0.7).accepted).toBe(true);
    });

    it('unblocks at the exact declared expiry time', () => {
      handler.handleInput('client-1', 'mood', 0.5);
      handler.blockClient('client-1', 1_000);
      vi.advanceTimersByTime(1_000);

      expect(handler.handleInput('client-1', 'mood', 0.6).accepted).toBe(true);
    });
  });

  describe('active client count', () => {
    it('counts distinct active clients without real-time sleeps', () => {
      handler.handleInput('client-1', 'mood', 0.5);
      handler.handleInput('client-2', 'tempo', 0.6);

      expect(handler.getActiveClientCount()).toBe(2);
    });
  });
});

describe('PerformerSubscriptions', () => {
  let bus: ParameterBus;
  let subscriptions: PerformerSubscriptions;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    bus = createBus();
    subscriptions = createPerformerSubscriptions(bus, 'test-session');
  });

  afterEach(() => {
    subscriptions.destroy();
    bus.dispose();
    vi.useRealTimers();
  });

  describe('authentication', () => {
    it('authenticates with the configured prototype secret', () => {
      expect(subscriptions.authenticate('performer-1', 'dev-secret-change-me')).toBe(true);
    });

    it('rejects an incorrect secret', () => {
      expect(subscriptions.authenticate('performer-1', 'wrong-secret')).toBe(false);
    });
  });

  describe('override handling', () => {
    beforeEach(() => {
      subscriptions.registerPerformer('performer-1', 'Test Performer', undefined, NOW);
      subscriptions.setAuthenticated('performer-1', true, NOW);
    });

    it('accepts override from an authenticated performer', () => {
      const result = subscriptions.requestOverride({
        performerId: 'performer-1',
        parameter: 'mood',
        value: 0.8,
        mode: 'absolute',
      }, NOW);

      expect(result.success).toBe(true);
      expect(result.override?.value).toBe(0.8);
    });

    it('rejects override from an unauthenticated performer', () => {
      subscriptions.setAuthenticated('performer-1', false, NOW);

      const result = subscriptions.requestOverride({
        performerId: 'performer-1',
        parameter: 'mood',
        value: 0.8,
        mode: 'absolute',
      }, NOW);

      expect(result).toEqual({ success: false, reason: 'not_authenticated' });
    });

    it('rejects non-finite values and invalid blend or duration fields', () => {
      expect(subscriptions.requestOverride({
        performerId: 'performer-1',
        parameter: 'mood',
        value: Number.NaN,
        mode: 'absolute',
      }, NOW).reason).toBe('invalid_value');

      expect(subscriptions.requestOverride({
        performerId: 'performer-1',
        parameter: 'mood',
        value: 0.5,
        mode: 'blend',
        blendFactor: 1.5,
      }, NOW).reason).toBe('invalid_blend_factor');

      expect(subscriptions.requestOverride({
        performerId: 'performer-1',
        parameter: 'mood',
        value: 0.5,
        mode: 'absolute',
        durationMs: 0,
      }, NOW).reason).toBe('invalid_duration');
    });

    it('clears overrides', () => {
      subscriptions.requestOverride({
        performerId: 'performer-1',
        parameter: 'mood',
        value: 0.8,
        mode: 'absolute',
      }, NOW);

      expect(subscriptions.clearOverride('performer-1', 'mood')).toBe(true);
      expect(subscriptions.getOverride('mood', NOW)).toBeNull();
    });

    it('expires timed overrides at the exact boundary', () => {
      subscriptions.requestOverride({
        performerId: 'performer-1',
        parameter: 'mood',
        value: 0.8,
        mode: 'absolute',
        durationMs: 100,
      }, NOW);

      expect(subscriptions.getOverride('mood', NOW + 99)).not.toBeNull();
      expect(subscriptions.getOverride('mood', NOW + 100)).toBeNull();
      expect(subscriptions.getPerformer('performer-1')?.activeOverrides).not.toContain('mood');
    });

    it('transfers override ownership without leaving a stale owner index', () => {
      subscriptions.registerPerformer('performer-2', 'Second Performer', undefined, NOW);
      subscriptions.setAuthenticated('performer-2', true, NOW);
      subscriptions.requestOverride({
        performerId: 'performer-1',
        parameter: 'mood',
        value: 0.4,
        mode: 'absolute',
      }, NOW);
      subscriptions.requestOverride({
        performerId: 'performer-2',
        parameter: 'mood',
        value: 0.8,
        mode: 'absolute',
      }, NOW);

      expect(subscriptions.getPerformer('performer-1')?.activeOverrides).not.toContain('mood');
      expect(subscriptions.getPerformer('performer-2')?.activeOverrides).toContain('mood');
      expect(subscriptions.getOverride('mood', NOW)?.performerId).toBe('performer-2');
    });
  });

  describe('performer management', () => {
    it('registers and retrieves performers at the supplied clock', () => {
      const session = subscriptions.registerPerformer(
        'performer-1',
        'Test Performer',
        undefined,
        NOW,
      );

      expect(session.performerId).toBe('performer-1');
      expect(session.connectedAt).toBe(NOW);
      expect(subscriptions.getPerformer('performer-1')).toBeDefined();
    });

    it('removes performers and their overrides even after deauthentication', () => {
      subscriptions.registerPerformer('performer-1', 'Test', undefined, NOW);
      subscriptions.setAuthenticated('performer-1', true, NOW);
      subscriptions.requestOverride({
        performerId: 'performer-1',
        parameter: 'mood',
        value: 0.8,
        mode: 'absolute',
      }, NOW);
      subscriptions.setAuthenticated('performer-1', false, NOW);

      subscriptions.removePerformer('performer-1');

      expect(subscriptions.getPerformer('performer-1')).toBeUndefined();
      expect(subscriptions.getOverride('mood', NOW)).toBeNull();
    });
  });
});
