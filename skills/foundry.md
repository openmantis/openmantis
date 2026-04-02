---
name: Foundry Local Runtime
description: Route chat (and optionally audio transcription) to a local Foundry Local server via OpenMantis, when the user wants on-device inference and Foundry Local is reachable.
---

## Overview
Use this skill when you should run inference locally through OpenMantis's Foundry Local runtime adapter (not a remote hosted model).

## When to use
- The user asks for local inference (offline, privacy, or low-latency on-device).
- Foundry Local is installed and its local service is running.
- The user requests chat/text generation, or audio transcription if you have an audio input.

## Prerequisites
- Foundry Local is installed.
- The local Foundry Local service is reachable at `OPENMANTIS_RUNTIME_FOUNDRY_URL` (default: `http://localhost:3000`, from `.env.example`).
- The requested model exists in Foundry Local (model catalog may download models automatically when supported).
- If doing audio transcription, the requested Whisper model is available (example alias: `whisper-tiny`).

## Steps / Instructions
1. Determine the task type.
   - If the user asks for chat/text generation, prepare a chat request.
   - If the user provides audio and asks for transcription, prepare an audio transcription request.
2. Choose the model.
   - If the user specifies a model alias, use it.
   - If the user does not specify, pick a sensible default (for example `phi-3.5-mini` for chat, `whisper-tiny` for transcription) and proceed.
3. Prepare messages and context.
   - Use the user's latest message as the newest `{ role, content }`.
   - Include prior conversation messages only if required to maintain context.
4. Ask OpenMantis to execute using the Foundry Local runtime adapter.
   - Use OpenMantis so it can apply caching and prompt/context budgeting.
5. Handle model constraints.
   - If you hit context limits, reduce the input size or ask the user to shorten the prompt.
   - If the model is missing, ask the user to install/pull the model in Foundry Local or choose a different alias.
6. Return the result.
   - Return the final assistant text to the user.
   - For transcription, return the transcribed text.

## Code / Commands
Claude should not run the Foundry Local service or manage models as the primary path.

Optional fallback: verify the service is reachable from the same machine running OpenMantis:

```shell
curl $OPENMANTIS_RUNTIME_FOUNDRY_URL
```

Optional fallback: check chat completion shape using an OpenAI-compatible endpoint (exact paths depend on the Foundry Local service configuration):

```shell
curl "${OPENMANTIS_RUNTIME_FOUNDRY_URL}/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "phi-3.5-mini",
    "messages": [{"role":"user","content":"What is the golden ratio?"}],
    "stream": false
  }'
```

If you are not sure about the exact endpoint paths, stop and ask the user to confirm the Foundry Local endpoint configuration.

## Common errors
- Service unreachable (`ECONNREFUSED`, timeouts)
  - Verify `OPENMANTIS_RUNTIME_FOUNDRY_URL`.
  - Verify Foundry Local is running and bound to the expected interface.
- Model not found
  - Ask the user to choose a different model alias, or pull/install the model in Foundry Local.
- Context limit exceeded
  - Reduce the prompt size, truncate older messages, and retry through OpenMantis.
- Audio model missing (for transcription)
  - Ask for `whisper-tiny` (or another available Whisper alias) and retry.

## Notes
- Treat model outputs as untrusted text; do not execute code returned by the model.
- Prefer OpenMantis execution so caching and token/context budgeting are applied consistently.
- If the user requests offline operation, ensure the Foundry Local runtime is already installed and models are available locally.
