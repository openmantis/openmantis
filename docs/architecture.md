---
title: Architecture
---

# Architecture

OpenMantis is built around a small request pipeline:

1. The CLI or library entrypoint creates an OpenMantis instance.
2. The router normalizes the request and checks token budget constraints.
3. The router generates a cache key from the runtime, model, messages, and output budget.
4. If a cached response exists, it is returned immediately.
5. Otherwise, the selected runtime adapter sends the request to a local model server.
6. The response is stored in the disk-backed cache and returned to the caller.

## Core Modules

- [src/index.js](../src/index.js) wires together the cache, memory store, router, runtimes, and platform helpers.
- [src/core/cache.js](../src/core/cache.js) stores cached responses in JSON on disk.
- [src/core/router.js](../src/core/router.js) selects the runtime, enforces prompt budgets, and handles cache hits.
- [src/core/tokenizer.js](../src/core/tokenizer.js) estimates token usage for messages and other values.
- [src/core/directory.js](../src/core/directory.js) indexes files for context reuse.
- [src/core/memory.js](../src/core/memory.js) persists lightweight keyed memory.
- [src/runtimes/ollama.js](../src/runtimes/ollama.js) and [src/runtimes/foundry.js](../src/runtimes/foundry.js) adapt local runtime APIs into a common `chat()` contract.

## Extension Points

- Add a new runtime by implementing the same `chat(request)` shape and exporting it from [src/runtimes/index.js](../src/runtimes/index.js).
- Add new routing behavior in [src/core/router.js](../src/core/router.js) so the CLI and library entrypoints stay thin.
- Keep cache and memory storage deterministic so tests can run without network access.

## Configuration

- `OPENMANTIS_CACHE_DIR` controls the on-disk cache location.
- `OPENMANTIS_RUNTIME_OLLAMA_URL` controls the Ollama endpoint.
- `OPENMANTIS_RUNTIME_FOUNDRY_URL` controls the Foundry Local endpoint.
- `OPENMANTIS_MAX_CONTEXT_TOKENS` and `OPENMANTIS_MAX_OUTPUT_TOKENS` bound request size.

