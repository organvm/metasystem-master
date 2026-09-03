import { readFile } from 'node:fs/promises';

const ACTIVE_SURFACES = [
  'README.md',
  'CLAUDE.md',
  'packages/core-engine/README.md',
  'packages/core-engine/src/consensus/weighted-voting.ts',
  'packages/core-engine/tests/consensus.test.ts',
  'packages/core-engine/tests/consensus.deterministic.test.ts',
  'examples/generative-music/README.md',
  'examples/generative-music/src/server/index.js',
  'infra/web/index.html',
  'docs/business/GRANT_MATERIALS/ars-electronica-narrative-DRAFT.md',
];

const PROHIBITED = [
  {
    id: 'validated-poc',
    pattern: /proof-of-concept\s+validated/i,
    explanation: 'A proof-of-concept may not be described as validated without a named evidence object.',
  },
  {
    id: 'validated-p95',
    pattern: /validated\s*:\s*p95\s+latency/i,
    explanation: 'The earlier source-level P95 validation statement has no preserved matching artifact.',
  },
  {
    id: 'two-ms-result',
    pattern: /p95\s+latency\s*(?::|of)\s*(?:\*\*)?2\s*ms/i,
    explanation: 'The 2 ms result is not currently supported by a preserved artifact.',
  },
  {
    id: 'five-ms-result',
    pattern: /p95\s+latency\s*<\s*5\s*ms/i,
    explanation: 'The <5 ms source claim is not currently supported by a preserved artifact.',
  },
  {
    id: 'perfect-delivery',
    pattern: /100\s*%\s+(?:message\s+)?delivery/i,
    explanation: 'No current end-to-end delivery artifact supports a perfect-delivery statement.',
  },
  {
    id: 'zero-errors',
    pattern: /0\s*%\s+error(?:s|\s+rate)?/i,
    explanation: 'No current end-to-end error artifact supports a zero-error statement.',
  },
  {
    id: 'production-ready-badge',
    pattern: /status-badge[^\n>]*production[- ]ready/i,
    explanation: 'The active public surface may not label the project production ready.',
  },
  {
    id: 'concurrency-with-ease',
    pattern: /handles\s+websocket\s+concurrency\s+with\s+ease/i,
    explanation: 'Source presence is not capacity evidence.',
  },
  {
    id: 'stadium-capacity',
    pattern: /stadium-sized\s+crowds/i,
    explanation: 'No current load artifact supports stadium-scale language.',
  },
  {
    id: 'sub-one-five-load',
    pattern: /load(?:ing|s)?\s+in\s+under\s+1\.5\s+seconds/i,
    explanation: 'No preserved browser-load artifact supports this claim.',
  },
];

function lineNumber(source, offset) {
  return source.slice(0, offset).split('\n').length;
}

const failures = [];

for (const path of ACTIVE_SURFACES) {
  const source = await readFile(path, 'utf8');
  for (const rule of PROHIBITED) {
    const match = rule.pattern.exec(source);
    if (!match || match.index === undefined) continue;
    failures.push({
      path,
      line: lineNumber(source, match.index),
      id: rule.id,
      text: match[0],
      explanation: rule.explanation,
    });
  }
}

if (failures.length > 0) {
  console.error('Unsupported active claim language detected:\n');
  for (const failure of failures) {
    console.error(
      `${failure.path}:${failure.line} [${failure.id}] ${JSON.stringify(failure.text)}`,
    );
    console.error(`  ${failure.explanation}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Claim-boundary check passed for ${ACTIVE_SURFACES.length} active surfaces and ${PROHIBITED.length} prohibited patterns.`,
  );
  console.log('Historical cold storage and explicitly labeled target tables are outside this narrow gate.');
}
