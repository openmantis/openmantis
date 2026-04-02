# OpenMantis

OpenMantis is an open-source Node.js tool and SDK that lets developers run large AI models on low-spec devices by acting as a smart optimization layer between your app and local model runtimes like Ollama and Foundry Local.

It focuses on reducing memory and storage usage through caching, prompt tokenization, and context directory indexing.

## Features

- Runtime adapters for local model servers (e.g. Ollama, Foundry Local)
- Caching layer to avoid recomputation across sessions
- Tokenization and prompt budgeting utilities
- Context directory indexing to reuse relevant information efficiently

## Getting Started

The current slice includes a working CLI, disk-backed cache, request router, and local runtime adapters.

Try it with:

```bash
npm test
node bin/openmantis.js run "hello world"
```

The `run` command expects a reachable local runtime such as Ollama or Foundry Local.

You can also import OpenMantis as a library from `src/index.js`.

## Configuration

Copy `.env.example` to `.env.local` and update the values.

Common knobs:

- Cache directory locations
- Runtime endpoints (Ollama / Foundry Local)
- Token/context budgeting limits

## Development

- Use `npm test` to run the built-in test suite.
- Keep changes small and add coverage for core logic (router, cache, tokenization, and runtime adapters).

## Security

See `SECURITY.md` for reporting vulnerabilities and responsible disclosure guidance.

## License

MIT (see `LICENSE`).
