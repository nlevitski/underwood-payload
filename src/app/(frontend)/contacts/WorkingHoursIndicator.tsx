'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const TIME_ZONE = 'Europe/Minsk'
const MINUTES_IN_HOUR = 60

const workingHours: Partial<Record<number, { start: number; end: number }>> = {
  1: { start: 9 * MINUTES_IN_HOUR, end: 18 * MINUTES_IN_HOUR },
  2: { start: 9 * MINUTES_IN_HOUR, end: 18 * MINUTES_IN_HOUR },
  3: { start: 9 * MINUTES_IN_HOUR, end: 18 * MINUTES_IN_HOUR },
  4: { start: 9 * MINUTES_IN_HOUR, end: 18 * MINUTES_IN_HOUR },
  5: { start: 9 * MINUTES_IN_HOUR, end: 18 * MINUTES_IN_HOUR },
  6: { start: 9 * MINUTES_IN_HOUR, end: 17 * MINUTES_IN_HOUR },
}

const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  weekday: 'short',
})

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const weekdayByShortName: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

const weekdayLabels: Record<number, string> = {
  1: 'в понедельник',
  2: 'во вторник',
  3: 'в среду',
  4: 'в четверг',
  5: 'в пятницу',
  6: 'в субботу',
}

type WorkingStatus = {
  isOpen: boolean
  label: string
  detail: string
  currentTime: string
}

export function WorkingHoursIndicator() {
  const [status, setStatus] = useState<WorkingStatus | null>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const updateStatus = () => setStatus(getWorkingStatus(new Date()))

    updateStatus()

    const timer = window.setInterval(updateStatus, 60 * 1000)

    return () => window.clearInterval(timer)
  }, [])

  if (!status) {
    return null
  }

  const dotClassName = status.isOpen ? 'bg-forest-light' : 'bg-berry-light'
  const shellClassName = status.isOpen
    ? 'border-forest/20 bg-accent/75 text-forest'
    : 'border-berry/20 bg-berry/10 text-berry'
  const pulseDuration = status.isOpen ? 2.8 : 3.4

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2" aria-live="polite">
      <span
        className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${shellClassName}`}
      >
        <span className="relative flex size-2.5 shrink-0 items-center justify-center">
          {!shouldReduceMotion ? (
            <motion.span
              className={`absolute inset-0 rounded-full ${dotClassName}`}
              animate={{
                opacity: status.isOpen ? [0.18, 0.34, 0.18] : [0.16, 0.28, 0.16],
                scale: status.isOpen ? [1.15, 1.85, 1.15] : [1.08, 1.55, 1.08],
              }}
              transition={{
                duration: pulseDuration,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          ) : null}
          <motion.span
            className={`relative block size-2.5 rounded-full ${dotClassName}`}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: status.isOpen ? [0.9, 1, 0.9] : [0.82, 1, 0.82],
                    scale: status.isOpen ? [1, 1.1, 1] : [1, 1.06, 1],
                  }
            }
            transition={{
              duration: pulseDuration,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
        </span>
        <span>{status.label}</span>
      </span>
      <span className="text-sm text-muted-foreground">
        {status.detail} · Минск, {status.currentTime}
      </span>
    </div>
  )
}

function getWorkingStatus(date: Date): WorkingStatus {
  const weekday = getMinskWeekday(date)
  const currentTime = timeFormatter.format(date)
  const [hour, minute] = currentTime.split(':').map(Number)
  const currentMinutes = hour * MINUTES_IN_HOUR + minute
  const todayHours = workingHours[weekday]

  if (todayHours && currentMinutes >= todayHours.start && currentMinutes < todayHours.end) {
    return {
      isOpen: true,
      label: 'Открыто сейчас',
      detail: `Закроемся в ${formatMinutes(todayHours.end)}`,
      currentTime,
    }
  }

  return {
    isOpen: false,
    label: 'Закрыто сейчас',
    detail: getNextOpeningLabel(weekday, currentMinutes),
    currentTime,
  }
}

function getMinskWeekday(date: Date) {
  const weekday = weekdayFormatter.format(date)

  return weekdayByShortName[weekday] ?? 0
}

function getNextOpeningLabel(weekday: number, currentMinutes: number) {
  const todayHours = workingHours[weekday]

  if (todayHours && currentMinutes < todayHours.start) {
    return `Откроемся сегодня в ${formatMinutes(todayHours.start)}`
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextWeekday = (weekday + offset) % 7
    const nextHours = workingHours[nextWeekday]

    if (nextHours) {
      const dayLabel = offset === 1 ? 'завтра' : weekdayLabels[nextWeekday]

      return `Откроемся ${dayLabel} в ${formatMinutes(nextHours.start)}`
    }
  }

  return 'Уточните время визита по телефону'
}

function formatMinutes(minutes: number) {
  const hour = Math.floor(minutes / MINUTES_IN_HOUR)
  const minute = minutes % MINUTES_IN_HOUR

  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}
