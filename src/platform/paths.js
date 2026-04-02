const fs = require('fs')
const path = require('path')

function getProjectRoot(startDirectory = process.cwd()) {
	let currentDirectory = path.resolve(startDirectory)

	while (true) {
		if (fs.existsSync(path.join(currentDirectory, 'package.json'))) {
			return currentDirectory
		}

		const parentDirectory = path.dirname(currentDirectory)
		if (parentDirectory === currentDirectory) {
			return path.resolve(startDirectory)
		}

		currentDirectory = parentDirectory
	}
}

function getCacheDirectory(env = process.env, startDirectory = process.cwd()) {
	return path.resolve(startDirectory, env.OPENMANTIS_CACHE_DIR || '.openmantis/cache')
}

function resolveCacheFile(fileName = 'cache.json', env = process.env, startDirectory = process.cwd()) {
	return path.join(getCacheDirectory(env, startDirectory), fileName)
}

module.exports = {
	getProjectRoot,
	getCacheDirectory,
	resolveCacheFile,
}
