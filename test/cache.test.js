const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const { createCache, createCacheKey } = require('../src/core/cache')

test('createCache stores and retrieves values on disk', () => {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'openmantis-cache-'))
	const cache = createCache({ directory })
	const key = createCacheKey({ hello: 'world' })

	assert.equal(cache.has(key), false)

	cache.set(key, { content: 'cached response' })

	assert.equal(cache.has(key), true)
	assert.deepEqual(cache.get(key), { content: 'cached response' })
	assert.equal(cache.stats().entries, 1)
})
