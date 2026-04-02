const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

function createCache(options = {}) {
	const directory = options.directory || path.join(process.cwd(), '.openmantis', 'cache')
	const filePath = path.join(directory, 'cache.json')

	ensureDirectory(directory)

	return {
		get(key) {
			const state = readState(filePath)
			return state.entries[key] || null
		},
		set(key, value) {
			const state = readState(filePath)
			state.entries[key] = value
			writeState(filePath, state)
			return value
		},
		has(key) {
			const state = readState(filePath)
			return Object.prototype.hasOwnProperty.call(state.entries, key)
		},
		delete(key) {
			const state = readState(filePath)
			const existed = Object.prototype.hasOwnProperty.call(state.entries, key)
			delete state.entries[key]
			writeState(filePath, state)
			return existed
		},
		clear() {
			writeState(filePath, { entries: {} })
		},
		stats() {
			const state = readState(filePath)
			return {
				directory,
				entries: Object.keys(state.entries).length,
			}
		},
	}
}

function createCacheKey(payload) {
	return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex')
}

function ensureDirectory(directory) {
	fs.mkdirSync(directory, { recursive: true })
}

function readState(filePath) {
	if (!fs.existsSync(filePath)) {
		return { entries: {} }
	}

	const raw = fs.readFileSync(filePath, 'utf8')

	if (!raw.trim()) {
		return { entries: {} }
	}

	return JSON.parse(raw)
}

function writeState(filePath, state) {
	fs.writeFileSync(filePath, `${JSON.stringify(state, null, 2)}\n`)
}

module.exports = {
	createCache,
	createCacheKey,
}
