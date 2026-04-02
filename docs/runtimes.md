---
title: Runtime Adapters
---

# Runtime Adapters

OpenMantis currently supports two local runtime adapters:

- Ollama via [src/runtimes/ollama.js](../src/runtimes/ollama.js)
- Foundry Local via [src/runtimes/foundry.js](../src/runtimes/foundry.js)

Both adapters expose the same async interface:

```js
runtime.chat({
	model: 'model-name',
	messages: [{ role: 'user', content: 'hello' }],
	maxOutputTokens: 1024,
})
```

## Ollama

- Default base URL: `http://localhost:11434`
- Request path: `/api/chat`
- Request body: `model`, `messages`, `stream: false`
- Response shape: `message.content`

## Foundry Local

- Default base URL: `http://localhost:3000`
- Request path: `/v1/chat/completions`
- Request body: `model`, `messages`, `max_tokens`, `stream: false`
- Response shape: `choices[0].message.content`

## Testing Guidance

- Unit tests should inject a mock `fetch` and assert the request payload.
- Integration tests should be opt-in and only run when a local runtime is reachable.
- Keep error handling explicit so users can distinguish network failures from invalid responses.

