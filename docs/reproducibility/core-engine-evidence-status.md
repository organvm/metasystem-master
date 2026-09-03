# Core-Engine Evidence Status and Claim Register

**Audit date:** 2026-09-03  
**Audited source baseline:** `7b5fbac49b50993878f6842e4e7648491a8a662c`  
**Repair branch:** `phd/omni-reproducibility-baseline-2026-09-03`  
**Interpretation:** this register distinguishes implemented code, deterministic checks, measured artifacts, design targets, deployment evidence, rehearsal evidence, and live-performance evidence.

## Current status

The branch contains:

- an explicit core-engine typecheck command;
- deterministic functional tests with an injectable evaluation clock;
- a seeded in-process benchmark over 10, 100, 250, 500, and 1,000 inputs;
- JSON artifact output carrying source revision, runtime, seed, cohort sizes, timing definition, scope, and summary statistics;
- a strict GitHub Actions workflow intended to preserve compiler, test, and benchmark output.

The first strict workflow attempt and the repository's other workflows were terminated before any runner step was recorded. The job contains no step records, no retrievable log, and no benchmark artifact. That event is classified as `infrastructure_execution_blocked`, not as a compiler, test, benchmark, or performance result.

No performance threshold is asserted by the current benchmark.

## Evidence vocabulary

| State | Meaning |
|---|---|
| `implemented_unexecuted` | Inspectable source exists, but the declared command has not produced preserved output at the audited head. |
| `checked_bounded` | A deterministic test or compiler check has completed and supports only the named property. |
| `measured_environmental` | A preserved artifact records a measurement in one fully declared environment. |
| `repeated_environmental` | Comparable artifacts exist across repeated runs and declared environments. |
| `deployed_observed` | Instrumentation from an identified deployment supports a bounded operational claim. |
| `rehearsal_observed` | A declared rehearsal with participants and protocol supports a bounded use claim. |
| `performance_observed` | A declared live performance with methods and evidence supports a bounded outcome claim. |
| `target_only` | A desired engineering target is stated without evidence that it has been met. |
| `unsupported_active_claim` | An active surface presents an unpreserved or mismatched result as established. |
| `historical_source_claim` | A preserved historical document contains a claim that must not be inherited as current evidence. |

## Current admissible claims

At the current branch head, it is admissible to say:

1. The repository contains an inspectable weighted-consensus implementation combining spatial, temporal, and agreement terms.
2. The repository contains declared performer-override modes and code paths for applying them.
3. The branch defines deterministic functional tests and a seeded, artifact-producing in-process benchmark.
4. The benchmark is designed to measure per-call wall-clock duration for `computeConsensus` only.
5. Runner execution remains blocked before any strict compiler, test, or benchmark step is recorded.

It is not yet admissible to say that the branch has passed typecheck or tests, achieved a latency value, met a latency target, sustained a participant count, delivered messages at a stated rate, produced a stated error rate, operated in rehearsal, operated in live performance, or is production ready.

## Benchmark boundary

The current benchmark includes:

- deterministic pseudo-random inputs from a recorded seed;
- a fixed evaluation timestamp and fixed input timestamps;
- 10 warm-up calls and 50 measured calls per cohort;
- cohorts of 10, 100, 250, 500, and 1,000 inputs;
- minimum, mean, p50, p95, maximum, and operations per second;
- an equality check requiring identical consensus output across all calls;
- runtime, platform, architecture, CI state, source revision, and timer definition;
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
- delivery rate and error rate;
- rehearsal conditions;
- live-performance behavior and reception.

A future numerical result from this benchmark must be named as **in-process consensus compute time in the recorded environment**, not as end-to-end system latency.

## Active claim register

| Surface | Earlier claim form | Classification at audit | Repair status | Required evidence before reinstatement |
|---|---|---|---|---|
| `packages/core-engine/src/consensus/weighted-voting.ts` | `Validated: P95 latency <5ms for 1000 inputs` | `unsupported_active_claim` | Removed; replaced by benchmark pointer and no-threshold boundary | Preserved, repeated benchmark artifacts for the exact implementation; wording must remain in-process only |
| `packages/core-engine/tests/consensus.test.ts` | randomized single-run `<10ms` assertion | invalid performance test | Removed; file now contains deterministic functional assertions only | Performance remains in benchmark lane, never a unit-test pass/fail threshold without an environmental contract |
| `packages/core-engine/README.md` | `Proof-of-concept validated (P95 latency: 2ms)` | `unsupported_active_claim` | Removed; current evidence state and commands documented | Completed strict workflow plus preserved repeated artifacts; scope-specific wording |
| `examples/generative-music/README.md` | `2ms`, `100%` delivery, `0%` error presented as actual | `unsupported_active_claim` | Removed; standalone-example boundary documented | Versioned end-to-end workload, synchronized timing method, delivery/error accounting, repeated raw artifacts |
| `examples/generative-music/src/server/index.js` | startup banner and header declare validated `2ms` | `unsupported_active_claim` | Removed; startup states no validation | Same as standalone example above |
| root `README.md` | sub-second negotiation, latency validation path, and `current P95 <2ms target` language | mixed implementation description, target, and unsupported implication | Open claim debt | Rewrite active status, benchmark path, and performance language after exact section audit |
| `infra/web/index.html` | `2ms`, `100%`, zero errors, `50+`, production-ready, working demo/performance assertions | `unsupported_active_claim` | Open claim debt; public surface must not be treated as evidence | Exact deployment identity, instrumented results, participant protocol, media provenance, and reproducible records |
| `CLAUDE.md` | `<2ms` target adjacent to architecture description | `target_only` but easily misread as achieved | Open wording repair | Label explicitly as unvalidated historical target or remove |
| `docs/business/GRANT_MATERIALS/ars-electronica-narrative-DRAFT.md` | quantitative validation language | `unsupported_active_claim` in a draft application surface | Open claim debt | Source every result to preserved artifact and state environment/scope; otherwise remove |
| `docs/README.md`, `docs/QUICK_REFERENCE.md`, `docs/guides/QUICK_REFERENCE.md` | latency and capacity values in target/alert tables | `target_only` where clearly labeled | Retain only as declared targets; audit context | Targets require rationale; no language may imply they were achieved |
| `docs/reference/omnidramanon-cold-storage/**` | inherited historical metrics and completion claims | `historical_source_claim` | Preserve as cold storage; do not silently rewrite | Add or retain historical-status boundary; never cite as current runtime evidence |

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
- preserve checkout, install, compiler, test, and benchmark logs;
- preserve `consensus-baseline.json` as an artifact;
- record exact head SHA and dependency lock state.

### Gate B - deterministic correctness

- typecheck passes at the exact head;
- deterministic and functional tests pass at the exact head;
- benchmark output equality check passes;
- any failures are preserved rather than summarized away.

### Gate C - repeated in-process measurement

- run at least five repetitions per declared environment;
- preserve every raw JSON artifact, including slow and failed runs;
- report distributions across runs rather than selecting the best result;
- compare Node/runtime and hardware environments without combining them.

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
- compiler and test results are classified at the exact head;
- the first JSON benchmark artifact is preserved;
- the remaining active unsupported claims are removed or explicitly reduced to targets/history;
- the claim register links to the observed artifacts;
- no review language converts unexecuted code into successful evidence.
