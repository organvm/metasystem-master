# Core-Engine Evidence Status and Claim Register

**Audit date:** 2026-09-03  
**Audited source baseline:** `7b5fbac49b50993878f6842e4e7648491a8a662c`  
**Repair branch:** `phd/omni-reproducibility-baseline-2026-09-03`  
**Implementation head immediately before this register update:** `b42bac5eb8ff444aa5b6baa02eb36b30faf6ad9e`  
**Interpretation:** this register distinguishes implemented code, deterministic checks, measured artifacts, design targets, deployment evidence, rehearsal evidence, and live-performance evidence.

## Current status

The branch now contains:

- an explicit core-engine typecheck command;
- deterministic functional tests with an injectable evaluation clock;
- future-timestamp normalization that prevents temporal components above one;
- a seeded in-process benchmark over 10, 100, 250, 500, and 1,000 inputs;
- JSON artifact output carrying source revision, runtime, seed, fixed clock, cohort sizes, timing definition, scope, output value, and summary statistics;
- an equality guard requiring identical consensus output across every warm-up and measured call in one process;
- a strict GitHub Actions workflow intended to preserve claim-gate, compiler, test, and benchmark output;
- an executable claim-boundary check over ten active source, documentation, web, and proposal surfaces;
- repaired package, example, root, agent, public-web, and grant narratives.

Every strict workflow attempt observed during this tranche, along with the repository's other workflows on the same heads, terminated before any runner step was recorded. The jobs expose a failure conclusion but no executed-step records, runner identity, retrievable log, or benchmark artifact. That event remains classified as `infrastructure_execution_blocked`, not as a claim-gate, compiler, test, benchmark, or performance result.

A separate execution container could not resolve GitHub and therefore could not clone or install the exact dependency graph. That is also an infrastructure boundary, not substitute execution evidence.

No performance threshold or numerical result is asserted by the current benchmark.

## Evidence vocabulary

| State | Meaning |
|---|---|
| `implemented_unexecuted` | Inspectable source exists, but the declared command has not produced preserved output at the audited head. |
| `checked_bounded` | A deterministic test, compiler check, or static gate has completed and supports only the named property. |
| `measured_environmental` | A preserved artifact records a measurement in one fully declared environment. |
| `repeated_environmental` | Comparable artifacts exist across repeated runs and declared environments. |
| `deployed_observed` | Instrumentation from an identified deployment supports a bounded operational claim. |
| `rehearsal_observed` | A declared rehearsal with participants and protocol supports a bounded use claim. |
| `performance_observed` | A declared live performance with methods and evidence supports a bounded outcome claim. |
| `target_only` | A desired engineering target is stated without evidence that it has been met. |
| `unsupported_active_claim` | An active surface presents an unpreserved or mismatched result as established. |
| `historical_source_claim` | A preserved historical document contains a claim that must not be inherited as current evidence. |

## Current admissible claims

At the current repair branch, it is admissible to say:

1. The repository contains an inspectable weighted-consensus implementation combining spatial, temporal, and agreement terms.
2. The repository contains declared performer-override modes and code paths for applying them.
3. The branch defines deterministic functional tests and a seeded, artifact-producing in-process benchmark.
4. A fixed evaluation clock now controls temporal weighting and consensus result timestamps in deterministic paths.
5. Future-dated input is treated as age zero, preventing the temporal component from exceeding one under clock skew.
6. The current agreement calculation compares each input with the cohort and therefore gives the consensus call `Theta(n^2)` dominant time and `O(n)` auxiliary space.
7. The known active surfaces no longer present the earlier 2 ms, `<5ms`, perfect-delivery, zero-error, stadium-capacity, or production-readiness language as achieved results.
8. Runner execution remains blocked before any strict claim-gate, compiler, test, or benchmark step is recorded.

It is not yet admissible to say that the branch has passed its claim gate, typecheck, or tests; achieved a latency value; met a latency target; sustained a participant count; delivered messages at a stated rate; produced a stated error rate; operated in rehearsal; operated in live performance; or is production ready.

## Correctness repairs discovered during this tranche

| Finding | Earlier condition | Repair | Current evidence state |
|---|---|---|---|
| Live-clock benchmark dependency | Benchmark fixed input timestamps while temporal weighting used `Date.now()` | Injected `evaluationTime` through `weightInputs`, `computeConsensus`, result timestamps, tests, and benchmark | `implemented_unexecuted` |
| Timing assertion in unit tests | One randomized run asserted `<10ms` | Removed timing pass/fail from unit tests; retained deterministic functional checks; moved measurement to benchmark lane | `implemented_unexecuted` |
| Compile-risk in benchmark output | `number | null` expected output was serialized without an explicit post-loop guard | Added a null guard before result construction | `implemented_unexecuted` |
| Duplicate test identity | Symmetric fixture reused one identifier | Restored unique identities while holding timestamp and location symmetry constant | `implemented_unexecuted` |
| Future timestamp amplification | Negative age could make the temporal exponential greater than one | Normalized age with `max(0, t - tau)` and added an explicit test | `implemented_unexecuted` |

These are preserved as corrections. They are not evidence that every remaining correctness issue has been found.

## Known mathematical and specification limits

- The input and override Zod schemas can enforce several value bounds, but direct TypeScript callers can bypass schema validation.
- `WeightingConfig` requires runtime validation for assumptions such as positive temporal window and bounded smoothing factor.
- Agreement excludes peers by identifier; cohort-level identifier uniqueness is a semantic precondition not proven by a per-item schema.
- The cluster `bimodality` predicate checks the first two value-sorted clusters, not necessarily the two densest clusters.
- Outlier removal may suppress a coherent minority even when the numerical procedure is implemented as specified.
- Same-process deterministic equality does not establish bit-identical floating-point output across all runtimes, architectures, or input orderings.
- A sorted sliding-window or binary-search method could reduce exact threshold-neighbor counting from `Theta(n^2)` to `O(n log n)`, but equivalence has not been implemented or proved in this PR.

## Benchmark boundary

The current benchmark includes:

- deterministic pseudo-random inputs from a recorded seed;
- a fixed evaluation timestamp and fixed input timestamps;
- 10 warm-up calls and 50 measured calls per cohort;
- cohorts of 10, 100, 250, 500, and 1,000 inputs;
- minimum, mean, p50, p95, maximum, and operations per second;
- an equality check requiring identical consensus output across all calls;
- runtime, platform, architecture, CI state, source revision, timer, percentile definition, and output value;
- JSON output intended for workflow preservation.

It excludes:

- network transport and clock synchronization;
- serialization and deserialization;
- Socket.IO and browser behavior;
- Redis or other persistence;
- OSC routing;
- rendering and audio synthesis;
- audience-device latency;
- concurrent connection capacity;
- delivery, duplication, ordering, and error rates;
- rehearsal conditions;
- live-performance behavior and reception.

A future numerical result from this benchmark must be named as **in-process consensus compute time in the recorded environment**, not as end-to-end system latency.

## Active claim register

| Surface | Earlier claim form | Classification at audit | Repair status | Required evidence before reinstatement |
|---|---|---|---|---|
| `packages/core-engine/src/consensus/weighted-voting.ts` | `Validated: P95 latency <5ms for 1000 inputs` | `unsupported_active_claim` | **Repaired:** removed; source points to benchmark and asserts no threshold | Preserved repeated artifacts for the exact implementation; wording must remain in-process only |
| `packages/core-engine/tests/consensus.test.ts` | randomized single-run `<10ms` assertion | invalid performance test | **Repaired:** deterministic functional assertions only | Performance remains in benchmark lane, never a unit-test threshold without an environmental contract |
| `packages/core-engine/README.md` | `Proof-of-concept validated (P95 latency: 2ms)` | `unsupported_active_claim` | **Repaired:** current evidence state, scope, and commands documented | Completed strict workflow plus repeated artifacts; scope-specific wording |
| `examples/generative-music/README.md` | `2ms`, `100%` delivery, `0%` error presented as actual | `unsupported_active_claim` | **Repaired:** standalone-example boundary and measurement gate documented | Versioned end-to-end workload, synchronized timing, delivery/error accounting, repeated raw artifacts |
| `examples/generative-music/src/server/index.js` | startup banner and header declared validated `2ms` | `unsupported_active_claim` | **Repaired:** startup explicitly states no validation | Same as standalone example above |
| root `README.md` | sub-second negotiation, validation path, capacity, deployment, and active-result implications | mixed implementation, target, and unsupported implication | **Repaired:** replaced with evidence-bounded reader mode | Exact artifacts for any future measured/deployed/rehearsed claim |
| `infra/web/index.html` | `2ms`, `100%`, zero errors, `50+`, production-ready, demo/performance assertions | `unsupported_active_claim` | **Repaired:** replaced with accessible evidence-status interface | Exact deployment, instrumentation, participant protocol, media provenance, and reproducible records |
| `CLAUDE.md` | `<2ms` target adjacent to architecture as though operationally meaningful | `target_only` but easily misread as achieved | **Repaired:** targets explicitly unvalidated; coding agents routed through evidence register | Preserved measurement before result wording |
| `docs/business/GRANT_MATERIALS/ars-electronica-narrative-DRAFT.md` | quantitative validation, scale, partnership, fallback, and future-event implications | `unsupported_active_claim` in proposal surface | **Repaired:** evidence-bounded research proposal with submission gates | Official call verification, partner status, exact evidence, rights, budget, and application-specific review |
| `docs/README.md`, `docs/QUICK_REFERENCE.md`, `docs/guides/QUICK_REFERENCE.md` | latency and capacity values in target/alert tables | `target_only` where clearly labeled | Retained as declared targets; not inherited as results | Target rationale and clear labels; achieved wording requires artifacts |
| `docs/reference/omnidramanon-cold-storage/**` | inherited historical metrics and completion claims | `historical_source_claim` | Preserved as cold storage; excluded from active claim gate | Never cite as current runtime evidence without independent recovery and verification |

## Executable claim-boundary gate

`tools/check-core-claim-boundaries.mjs` reads ten active surfaces and rejects exact forms of the previously unsupported claims, including:

- `proof-of-concept validated`;
- validated P95 phrasing;
- 2 ms and `<5ms` result forms;
- perfect delivery and zero-error forms;
- production-ready status badges;
- unsupported concurrency, stadium-scale, and 1.5-second load language.

The strict workflow runs this gate before dependency installation. Historical cold storage and clearly labeled target tables remain outside the narrow active-surface gate. The gate itself is `implemented_unexecuted` until a runner preserves its output.

## Claim-repair rule

A number may appear on an active surface only when it is one of the following:

1. a **design target**, explicitly labeled as unvalidated;
2. a **measured result**, linked to a preserved artifact and exact source revision;
3. a **deployment observation**, linked to instrumentation and a named environment;
4. a **rehearsal or performance observation**, linked to a protocol, participant context, date, and source record.

A passing test does not prove deployment. A benchmark does not prove network latency. Source code does not prove rehearsal. A web page does not prove a live performance. A historical draft does not prove current status.

## Execution gates

### Gate A - runner execution

- obtain a GitHub-hosted or declared self-hosted runner assignment;
- preserve checkout and claim-boundary output;
- preserve locked installation, compiler, test, and benchmark logs;
- preserve `consensus-baseline.json` as an artifact;
- record exact head SHA and dependency lock state.

### Gate B - deterministic correctness

- claim-boundary gate passes at the exact head;
- typecheck passes at the exact head;
- deterministic and functional tests pass at the exact head;
- benchmark output equality guard passes;
- any failures are preserved rather than summarized away.

### Gate C - repeated in-process measurement

- run at least five repetitions per declared environment;
- preserve every raw JSON artifact, including slow and failed runs;
- report distributions across runs rather than selecting the best result;
- compare runtime and hardware environments without combining them.

### Gate D - end-to-end system measurement

- define client, server, network, clocks, serialization, connection count, event rate, and failure handling;
- instrument event lifecycle rather than inferring latency from acknowledgements alone;
- preserve delivery, duplication, ordering, disconnect, and error records;
- distinguish local simulation from deployed network behavior.

### Gate E - rehearsal and live-performance evidence

- identify date, venue/context, participant count, hardware, software revision, and protocol;
- preserve logs and source media with rights and credits;
- record performer override use, failures, dropouts, and audience behavior;
- separate technical operation from artistic or experiential evaluation.

## Draft-PR exit criteria

PR #70 should remain draft until:

- a runner executes all strict steps and exposes complete logs;
- the claim-boundary gate, compiler, and tests are classified at the exact head;
- the first JSON benchmark artifact is preserved;
- the register links to the observed artifacts;
- no review language converts unexecuted code into successful evidence.

The known active narrative claim debt identified in this audit is repaired on the branch. Execution evidence remains the principal external gate.
