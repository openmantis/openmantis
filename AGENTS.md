# AGENTS.md

This file provides coding-agent context for working on OpenMantis.

## Project overview

OpenMantis is a Node.js tool/SDK that acts as an optimization layer between an app and local model runtimes (for example Ollama and Foundry Local) using caching, context directory indexing, and prompt tokenization.

## Setup commands

- Install deps: `npm install`
- Run tests: `npm test`

## Development commands (when available)

- Dev server / CLI testing: `node bin/openmantis.js`

## Code style

- JavaScript/TypeScript preferred over dynamic scripting.
- Use single quotes, no semicolons.
- Prefer small functional helpers over large imperative blocks.
- Keep modules focused: `src/cli`, `src/core`, `src/runtimes`, `src/platform`.

## Testing instructions

- Add or update tests in `test/` for any behavior change.
- Keep tests deterministic (avoid network calls in unit tests; mock runtime adapters where possible).

## Security considerations

- Never execute untrusted code returned by a model.
- Treat runtime responses and user prompts as untrusted input.
- Do not log secrets (API keys, auth tokens, full prompt contents if they may include sensitive data).

## Repo locations (agent quick reference)

- CLI entrypoint: `bin/openmantis.js`
- Runtime adapters: `src/runtimes/`
- Shared core utilities: `src/core/`
- Skills (agent runbooks): `skills/`
- Skill docs: `docs/` and `docs/skills/` (if present)

