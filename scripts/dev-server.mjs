import 'dotenv/config'

import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const shouldClean = process.argv.includes('--clean')

if (shouldClean) {
  await rm(new URL('../.next', import.meta.url), { force: true, recursive: true })
}

const nextBin = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url))
const isWindows = process.platform === 'win32'
const child = spawn(process.execPath, [nextBin, 'dev'], {
  detached: !isWindows,
  env: {
    ...process.env,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--no-deprecation'].filter(Boolean).join(' '),
  },
  stdio: 'inherit',
})

let forceKillTimer
let stoppingSignal

function signalChildProcessGroup(signal) {
  try {
    if (isWindows) {
      child.kill(signal)
    } else {
      process.kill(-child.pid, signal)
    }
  } catch (error) {
    if (error?.code !== 'ESRCH') {
      throw error
    }
  }
}

function stop(signal) {
  if (stoppingSignal) return

  stoppingSignal = signal
  signalChildProcessGroup(signal)

  forceKillTimer = setTimeout(() => {
    signalChildProcessGroup('SIGKILL')
  }, 5_000)
  forceKillTimer.unref()
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.once(signal, () => stop(signal))
}

child.once('error', (error) => {
  console.error('Failed to start the Next.js development server:', error)
  process.exitCode = 1
})

child.once('exit', (code, signal) => {
  if (forceKillTimer) clearTimeout(forceKillTimer)

  if (stoppingSignal === 'SIGINT') {
    process.exitCode = 130
  } else if (stoppingSignal === 'SIGTERM') {
    process.exitCode = 143
  } else if (stoppingSignal === 'SIGHUP') {
    process.exitCode = 129
  } else {
    process.exitCode = code ?? (signal ? 1 : 0)
  }
})
