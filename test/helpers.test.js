const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const { indexDirectory } = require('../src/core/directory')
const { createMemoryStore } = require('../src/core/memory')
const { getCacheDirectory, resolveCacheFile, getProjectRoot } = require('../src/platform/paths')
const { getProcessSnapshot, readEnvFlag, readEnvNumber } = require('../src/platform/process')
const { getHardwareSnapshot, getMemoryGiB } = require('../src/platform/hardware')

test('indexDirectory returns file metadata and skips ignored folders', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'openmantis-dir-'))
  fs.mkdirSync(path.join(root, 'nested'))
  fs.mkdirSync(path.join(root, 'node_modules'))
  fs.writeFileSync(path.join(root, 'alpha.txt'), 'alpha')
  fs.writeFileSync(path.join(root, 'nested', 'beta.txt'), 'beta')
  fs.writeFileSync(path.join(root, 'node_modules', 'ignored.txt'), 'ignored')

  const entries = indexDirectory(root)

  assert.equal(entries.some(entry => entry.path.includes('ignored.txt')), false)
  assert.equal(entries.some(entry => entry.path.endsWith('alpha.txt')), true)
  assert.equal(entries.some(entry => entry.path.endsWith('beta.txt')), true)
})

test('createMemoryStore persists values on disk', () => {
  const filePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'openmantis-memory-')), 'memory.json')
  const memory = createMemoryStore({ filePath })

  assert.equal(memory.has('note'), false)
  memory.set('note', { text: 'remember this' })
  assert.equal(memory.has('note'), true)
  assert.deepEqual(memory.get('note'), { text: 'remember this' })
  assert.deepEqual(memory.list(), ['note'])
})

test('platform path helpers resolve defaults', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'openmantis-root-'))
  fs.writeFileSync(path.join(root, 'package.json'), '{}')

  assert.equal(getProjectRoot(root), root)
  assert.equal(getCacheDirectory({ OPENMANTIS_CACHE_DIR: 'custom/cache' }, root), path.resolve(root, 'custom/cache'))
  assert.equal(resolveCacheFile('state.json', { OPENMANTIS_CACHE_DIR: 'custom/cache' }, root), path.join(path.resolve(root, 'custom/cache'), 'state.json'))
})

test('platform process helpers read snapshots and env values', () => {
  const snapshot = getProcessSnapshot()

  assert.equal(typeof snapshot.pid, 'number')
  assert.equal(readEnvFlag('OPENMANTIS_TEST_FLAG', false, { OPENMANTIS_TEST_FLAG: 'yes' }), true)
  assert.equal(readEnvFlag('OPENMANTIS_TEST_FLAG', true, {}), true)
  assert.equal(readEnvNumber('OPENMANTIS_TEST_NUMBER', 7, { OPENMANTIS_TEST_NUMBER: '42' }), 42)
  assert.equal(readEnvNumber('OPENMANTIS_TEST_NUMBER', 7, {}), 7)
})

test('hardware helpers expose a snapshot and memory conversion', () => {
  const snapshot = getHardwareSnapshot()

  assert.equal(typeof snapshot.cpuCount, 'number')
  assert.equal(getMemoryGiB(1024 ** 3), 1)
})