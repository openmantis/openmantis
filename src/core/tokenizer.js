function estimateTokens(value) {
	if (value === null || value === undefined) {
		return 0
	}

	if (Array.isArray(value)) {
		return value.reduce((total, item) => total + estimateTokens(item), 0)
	}

	if (typeof value === 'object') {
		return estimateTokens(JSON.stringify(value))
	}

	const text = String(value).trim()

	if (!text) {
		return 0
	}

	return Math.max(1, Math.ceil(text.length / 4))
}

function countMessageTokens(messages) {
	return messages.reduce((total, message) => {
		return total + estimateTokens(message.role) + estimateTokens(message.content)
	}, 0)
}

module.exports = {
	estimateTokens,
	countMessageTokens,
}
