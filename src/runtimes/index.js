const { createOllamaRuntime } = require('./ollama')
const { createFoundryRuntime } = require('./foundry')

module.exports = {
	createOllamaRuntime,
	createFoundryRuntime,
}
