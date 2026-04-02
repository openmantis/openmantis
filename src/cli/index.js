const { createOpenMantis } = require('..')

async function main(argv = []) {
	const [command, ...rest] = argv

	if (!command || command === 'run') {
		return runCommand(command === 'run' ? rest : argv)
	}

	if (command === 'status') {
		return statusCommand(rest)
	}

	if (command === 'cache') {
		return cacheCommand(rest)
	}

	throw new Error(`Unknown command: ${command}`)
}

async function runCommand(argv = []) {
	const prompt = argv.join(' ').trim()

	if (!prompt) {
		throw new Error('Provide a prompt to run')
	}

	const client = createOpenMantis()
	const response = await client.chat({
		messages: [{ role: 'user', content: prompt }],
	})

	process.stdout.write(`${response.content}\n`)
	return response
}

async function statusCommand() {
	const client = createOpenMantis()
	const stats = client.cache.stats()
	process.stdout.write(`${JSON.stringify(stats, null, 2)}\n`)
	return stats
}

async function cacheCommand() {
	const client = createOpenMantis()
	const stats = client.cache.stats()
	process.stdout.write(`${JSON.stringify(stats, null, 2)}\n`)
	return stats
}

module.exports = {
	main,
	runCommand,
	statusCommand,
	cacheCommand,
}
