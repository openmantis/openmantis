const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const { createRouter } = require('../src/core/router')
const { createCache } = require('../src/core/cache')

test('router selects runtime and caches responses', async () => {
	let calls = 0
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'openmantis-router-'))
	const cache = createCache({ directory })

	const router = createRouter({
		cache,
		runtimes: {
			ollama: {
				async chat(request) {
					calls += 1
					return {
						content: `reply:${request.messages[0].content}`,
					}
				},
			},
		},
	})

	const first = await router.chat({
		messages: [{ role: 'user', content: 'hello' }],
	})

	const second = await router.chat({
		messages: [{ role: 'user', content: 'hello' }],
	})

	assert.equal(calls, 1)
	assert.equal(first.cached, false)
	assert.equal(second.cached, true)
	assert.equal(second.content, 'reply:hello')
})

test('router rejects prompts over the token budget', async () => {
	const router = createRouter({
		cache: null,
		runtimes: {
			ollama: {
				async chat() {
					return { content: 'unused' }
				},
			},
		},
		maxContextTokens: 1,
	})

	await assert.rejects(() => {
		return router.chat({
			messages: [{ role: 'user', content: 'This is definitely too long' }],
		})
	}, /Prompt exceeds context budget/)
})
