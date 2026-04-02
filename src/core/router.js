const { createCacheKey } = require('./cache')
const { countMessageTokens } = require('./tokenizer')

function createRouter(options = {}) {
	const cache = options.cache
	const runtimes = options.runtimes || {}
	const defaultRuntime = options.defaultRuntime || 'ollama'
	const maxContextTokens = options.maxContextTokens || 4096
	const maxOutputTokens = options.maxOutputTokens || 1024

	return {
		async chat(request = {}) {
			const normalized = normalizeRequest(request, defaultRuntime, maxOutputTokens)
			const runtimeName = normalized.runtime
			const runtime = runtimes[runtimeName]

			if (!runtime || typeof runtime.chat !== 'function') {
				throw new Error(`Unknown runtime: ${runtimeName}`)
			}

			const tokens = countMessageTokens(normalized.messages)
			if (tokens > maxContextTokens) {
				throw new Error(`Prompt exceeds context budget: ${tokens} > ${maxContextTokens}`)
			}

			const cacheKey = createCacheKey({
				runtime: runtimeName,
				model: normalized.model,
				messages: normalized.messages,
				maxOutputTokens: normalized.maxOutputTokens,
			})

			if (cache && cache.has(cacheKey)) {
				return { ...cache.get(cacheKey), cached: true }
			}

			const response = await runtime.chat(normalized)
			const result = { ...response, cached: false, runtime: runtimeName }

			if (cache) {
				cache.set(cacheKey, result)
			}

			return result
		},
	}
}

function normalizeRequest(request, defaultRuntime, maxOutputTokens) {
	return {
		runtime: request.runtime || defaultRuntime,
		model: request.model || null,
		messages: Array.isArray(request.messages) ? request.messages.map(normalizeMessage) : [],
		maxOutputTokens: request.maxOutputTokens || maxOutputTokens,
	}
}

function normalizeMessage(message) {
	return {
		role: message.role,
		content: String(message.content || ''),
	}
}

module.exports = {
	createRouter,
}
