const test = require('node:test')
const assert = require('node:assert/strict')

const { createOllamaRuntime, createFoundryRuntime } = require('../src/runtimes')

test('ollama runtime posts the expected payload', async () => {
	let requestUrl = null
	let requestInit = null

	const runtime = createOllamaRuntime({
		baseUrl: 'http://example.test',
		fetch: async (url, init) => {
			requestUrl = url
			requestInit = init
			return {
				ok: true,
				async json() {
					return { message: { content: 'ollama reply' } }
				},
			}
		},
	})

	const response = await runtime.chat({
		model: 'llama3',
		messages: [{ role: 'user', content: 'hi' }],
	})

	assert.equal(requestUrl, 'http://example.test/api/chat')
	assert.equal(JSON.parse(requestInit.body).model, 'llama3')
	assert.equal(response.content, 'ollama reply')
})

test('foundry runtime posts the expected payload', async () => {
	let requestUrl = null
	let requestInit = null

	const runtime = createFoundryRuntime({
		baseUrl: 'http://example.test',
		fetch: async (url, init) => {
			requestUrl = url
			requestInit = init
			return {
				ok: true,
				async json() {
					return { choices: [{ message: { content: 'foundry reply' } }] }
				},
			}
		},
	})

	const response = await runtime.chat({
		model: 'phi-3.5-mini',
		messages: [{ role: 'user', content: 'hi' }],
		maxOutputTokens: 32,
	})

	assert.equal(requestUrl, 'http://example.test/v1/chat/completions')
	assert.equal(JSON.parse(requestInit.body).max_tokens, 32)
	assert.equal(response.content, 'foundry reply')
})
