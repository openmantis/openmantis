const os = require('os')

function getProcessSnapshot() {
	return {
		pid: process.pid,
		ppid: process.ppid,
		platform: process.platform,
		arch: process.arch,
		cwd: process.cwd(),
		nodeVersion: process.version,
		uptimeSeconds: Math.floor(process.uptime()),
		availableMemoryBytes: os.freemem(),
	}
}

function readEnvFlag(name, fallback = false, env = process.env) {
	const value = env[name]
	if (value === undefined) {
		return fallback
	}

	return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase())
}

function readEnvNumber(name, fallback = 0, env = process.env) {
	const value = env[name]
	if (value === undefined || value === '') {
		return fallback
	}

	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : fallback
}

module.exports = {
	getProcessSnapshot,
	readEnvFlag,
	readEnvNumber,
}
