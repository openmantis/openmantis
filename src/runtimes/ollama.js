function createOllamaRuntime(options = {}) {
	const baseUrl = options.baseUrl || process.env.OPENMANTIS_RUNTIME_OLLAMA_URL || 'http://localhost:11434'
	const fetchImpl = options.fetch || global.fetch

	return {
		async chat(request) {
			if (typeof fetchImpl !== 'function') {
				throw new Error('fetch is not available')
			}

			const response = await fetchImpl(`${baseUrl}/api/chat`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					model: request.model,
					messages: request.messages,
					stream: false,
				}),
			})

			if (!response.ok) {
				throw new Error(`Ollama request failed with status ${response.status}`)
			}

			const data = await response.json()
			return {
				content: data?.message?.content || '',
				raw: data,
			}
		},
	}
}

module.exports = {
	createOllamaRuntime,
}
