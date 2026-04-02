const os = require('os')

function getHardwareSnapshot() {
	return {
		cpuCount: os.cpus().length,
		totalMemoryBytes: os.totalmem(),
		freeMemoryBytes: os.freemem(),
		platform: os.platform(),
		architecture: os.arch(),
	}
}

function getMemoryGiB(bytes) {
	return Math.round((bytes / (1024 ** 3)) * 100) / 100
}

module.exports = {
	getHardwareSnapshot,
	getMemoryGiB,
}
