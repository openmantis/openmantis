# Contributing

Thank you for contributing to OpenMantis!

## How to Contribute

1. Open or link an issue before starting larger work.
2. Fork the repository or create a branch in the main repo.
3. Make the smallest change that solves the problem.
4. Add or update tests when behavior changes.
5. Open a pull request and describe the user-facing impact.

## Development Notes

- The project is organized into:
  - `src/cli` (command-line interface)
  - `src/core` (core utilities like caching, routing, tokenization)
  - `src/runtimes` (adapters for local runtimes like Ollama / Foundry Local)
  - `src/platform` (platform-specific helpers)
- Keep public APIs consistent and prefer small, focused changes.
- Avoid adding dependencies unless they materially reduce complexity or improve correctness.
- Prefer deterministic tests that do not require a live runtime unless explicitly marked as integration coverage.

## Testing

Run `npm test` before opening a PR.

If you add an integration test that depends on a local runtime, make it opt-in and keep the default suite offline.

## Code Style

- Follow the existing CommonJS and single-quote style used in the repository.
- Keep modules cohesive and avoid broad refactors in feature PRs.
- Update docs when you change behavior that users will see.

## Code of Conduct

By participating, you agree to follow the `CODE_OF_CONDUCT.md`.
