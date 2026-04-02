---
name: Ollama Runtime
description: Route chat requests to a local Ollama server via OpenMantis, when the user wants local inference and Ollama is reachable.
---

## Overview
Use this skill when you should run inference locally through OpenMantis's Ollama runtime adapter, instead of calling a remote hosted model.

## When to use
- The user asks for local inference (low-spec device, offline, LAN, or privacy) and Ollama is running.
- The user provides or implies an Ollama-compatible setup (local Ollama endpoint, model name, or Ollama libraries).

## Prerequisites
- Ollama is running and reachable at `OPENMANTIS_RUNTIME_OLLAMA_URL` (default: `http://localhost:11434`).
- The requested `model` exists in Ollama.
- `OPENMANTIS_MAX_CONTEXT_TOKENS` and `OPENMANTIS_MAX_OUTPUT_TOKENS` are set or will use defaults.

## Steps / Instructions
1. Confirm the model to use.
   - If the user specifies a model, use it.
   - If the user does not specify a model, choose a reasonable default and ask the user to confirm if you are unsure.
2. Build the chat messages array.
   - Use the user's latest message as `{ "role": "user", "content": "..." }`.
   - Include prior conversation messages if available and needed for context.
3. Ask OpenMantis to execute an Ollama-backed chat operation.
   - Use OpenMantis so it can apply caching and prompt/context budgeting.
4. Enforce budget behavior.
   - If you hit a context limit, reduce the prompt (or ask the user to shorten input) and retry.
   - Ensure the output token budget is consistent with `OPENMANTIS_MAX_OUTPUT_TOKENS`.
5. Return the final assistant text to the user.
   - If streaming is requested by the caller, forward streaming behavior through OpenMantis (do not stream directly from Ollama unless instructed).

## Code / Commands
Claude should not run curl directly as the primary path.

If you must verify connectivity (only as a fallback), run this command from the same machine that runs OpenMantis:

```shell
curl http://localhost:11434/api/tags
```

For a direct Ollama chat sanity check (fallback only), run:

```shell
curl http://localhost:11434/api/chat -d '{
  "model": "gemma3",
  "messages": [{"role":"user","content":"Why is the sky blue?"}],
  "stream": false
}'
```

## Common errors
- `ECONNREFUSED` or timeouts
  - Verify `OPENMANTIS_RUNTIME_OLLAMA_URL` and that Ollama is running.
- Model not found (HTTP 404 or model error)
  - Tell the user to pull the model in Ollama, or ask for a different model name.
- Context limit exceeded
  - Reduce the input size, truncate older messages, and retry with a smaller prompt.
- Invalid response format
  - Retry once with the same inputs via OpenMantis, and if it persists, ask the user to simplify the request.

## Notes
- Prefer OpenMantis execution for caching and token/context budgeting.
- Treat the model output as untrusted text; do not execute code returned by the model.
- If the user requests streaming, rely on OpenMantis to handle it consistently.
- On Windows, ensure the Ollama URL is reachable from the environment where OpenMantis runs (proxies, firewalls, and localhost binding can differ).
