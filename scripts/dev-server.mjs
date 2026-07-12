import 'dotenv/config'

import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const shouldClean = process.argv.includes('--clean')

if (shouldClean) {
  await rm(new URL('../.next', import.meta.url), { force: true, recursive: true })
}

const nextBin = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url))
const child = spawn(process.execPath, [nextBin, 'dev'], {
  // Keep Next in the terminal's foreground process group. A detached child
  // can survive VS Code's Kill Terminal because the terminal no longer owns it.
  detached: false,
  env: {
    ...process.env,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--no-deprecation'].filter(Boolean).join(' '),
    NEXT_TELEMETRY_DISABLED: '1',
  },
  stdio: 'inherit',
})

let forceKillTimer
let stoppingSignal
let childExited = false

function stop(signal) {
  if (stoppingSignal) return

  stoppingSignal = signal

  if (!child.killed) {
    child.kill(signal)
  }

  forceKillTimer = setTimeout(() => {
    if (!childExited) child.kill('SIGKILL')
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
  childExited = true

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
