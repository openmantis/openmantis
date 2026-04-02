const fs = require('fs')
const path = require('path')

function indexDirectory(directory, options = {}) {
	const maxDepth = options.maxDepth === undefined ? Infinity : options.maxDepth
	const ignoreNames = new Set(options.ignoreNames || ['node_modules', '.git'])
	const entries = []

	walk(directory, 0)
	return entries

	function walk(currentDirectory, depth) {
		if (depth > maxDepth) {
			return
		}

		const stats = fs.statSync(currentDirectory)
		if (!stats.isDirectory()) {
			entries.push(makeEntry(currentDirectory, stats))
			return
		}

		for (const entryName of fs.readdirSync(currentDirectory)) {
			if (ignoreNames.has(entryName)) {
				continue
			}

			const fullPath = path.join(currentDirectory, entryName)
			const entryStats = fs.statSync(fullPath)

			if (entryStats.isDirectory()) {
				walk(fullPath, depth + 1)
				continue
			}

			entries.push(makeEntry(fullPath, entryStats))
		}
	}
}

function makeEntry(filePath, stats) {
	return {
		path: filePath,
		size: stats.size,
		modifiedTime: stats.mtime.toISOString(),
	}
}

module.exports = {
	indexDirectory,
}
