const fs = require('fs')
const path = require('path')

function createMemoryStore(options = {}) {
	const filePath = options.filePath || path.join(process.cwd(), '.openmantis', 'memory.json')
	ensureParentDirectory(filePath)

	return {
		get(key) {
			const state = readState(filePath)
			return Object.prototype.hasOwnProperty.call(state.entries, key) ? state.entries[key] : null
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
		list() {
			const state = readState(filePath)
			return Object.keys(state.entries)
		},
		clear() {
			writeState(filePath, { entries: {} })
		},
	}
}

function ensureParentDirectory(filePath) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true })
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
	createMemoryStore,
}
