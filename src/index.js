const { createCache } = require('./core/cache')
const { createMemoryStore } = require('./core/memory')
const { indexDirectory } = require('./core/directory')
const { createRouter } = require('./core/router')
const { createOllamaRuntime, createFoundryRuntime } = require('./runtimes')
const { getProjectRoot, getCacheDirectory, resolveCacheFile } = require('./platform/paths')
const { getProcessSnapshot, readEnvFlag, readEnvNumber } = require('./platform/process')
const { getHardwareSnapshot, getMemoryGiB } = require('./platform/hardware')

function createOpenMantis(options = {}) {
	const cache = options.cache || createCache(options.cacheOptions)
	const runtimes = options.runtimes || {
		ollama: createOllamaRuntime(options.ollamaOptions),
		foundry: createFoundryRuntime(options.foundryOptions),
	}

	const router = options.router || createRouter({
		cache,
		runtimes,
		tokenizer: options.tokenizer,
		defaultRuntime: options.defaultRuntime,
		maxContextTokens: options.maxContextTokens,
		maxOutputTokens: options.maxOutputTokens,
	})

	return {
		cache,
		memory: options.memory || createMemoryStore(options.memoryOptions),
		router,
		chat(request) {
			return router.chat(request)
		},
	}
}

module.exports = {
	createOpenMantis,
	createCache,
	createMemoryStore,
	indexDirectory,
	createRouter,
	createOllamaRuntime,
	createFoundryRuntime,
	getProjectRoot,
	getCacheDirectory,
	resolveCacheFile,
	getProcessSnapshot,
	readEnvFlag,
	readEnvNumber,
	getHardwareSnapshot,
	getMemoryGiB,
}
