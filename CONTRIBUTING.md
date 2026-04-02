# Contributing

Thank you for contributing to OpenMantis!

## How to Contribute

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Add or update tests when behavior changes.
5. Open a pull request.

## Development Notes

- The project is organized into:
  - `src/cli` (command-line interface)
  - `src/core` (core utilities like caching, routing, tokenization)
  - `src/runtimes` (adapters for local runtimes like Ollama / Foundry Local)
  - `src/platform` (platform-specific helpers)
- Keep public APIs consistent and prefer small, focused changes.

## Testing

Run `npm test` once tests are implemented for the relevant modules.

## Code Style

- Follow existing code patterns in the repository.
- Use clear naming and keep modules cohesive.

## Code of Conduct

By participating, you agree to follow the `CODE_OF_CONDUCT.md`.
