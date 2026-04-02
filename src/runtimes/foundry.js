function createFoundryRuntime(options = {}) {
	const baseUrl = options.baseUrl || process.env.OPENMANTIS_RUNTIME_FOUNDRY_URL || 'http://localhost:3000'
	const fetchImpl = options.fetch || global.fetch

	return {
		async chat(request) {
			if (typeof fetchImpl !== 'function') {
				throw new Error('fetch is not available')
			}

			const response = await fetchImpl(`${baseUrl}/v1/chat/completions`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					model: request.model,
					messages: request.messages,
					max_tokens: request.maxOutputTokens,
					stream: false,
				}),
			})

			if (!response.ok) {
				throw new Error(`Foundry request failed with status ${response.status}`)
			}

			const data = await response.json()
			return {
				content: data?.choices?.[0]?.message?.content || '',
				raw: data,
			}
		},
	}
}

module.exports = {
	createFoundryRuntime,
}
