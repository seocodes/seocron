import { useState } from 'react'

import { ControlButton } from '../../components/ControlButton'
import { TimeDisplay } from '../../components/TimeDisplay'
import { durationPartsToMs } from '../../lib/time/duration'
import {
  formatTimerDuration,
  splitDurationMs,
} from '../../lib/time/formatDuration'
import { MINUTE_MS } from '../../lib/time/time.constants'
import type { TimerController } from './useTimer'

interface TimerPanelProps {
  timer: TimerController
  announce: (message: string) => void
}

const presets = [5, 10, 25]

function toInputFields(durationMs: number) {
  const parts = splitDurationMs(durationMs)

  return {
    hours: parts.hours.toString(),
    minutes: parts.minutes.toString(),
    seconds: parts.seconds.toString(),
  }
}

function parseInputField(value: string): number | null {
  return /^\d{1,2}$/.test(value) ? Number(value) : null
}

export function TimerPanel({ timer, announce }: TimerPanelProps) {
  const [fields, setFields] = useState(() =>
    toInputFields(timer.configuredDurationMs),
  )
  const [error, setError] = useState<string | null>(null)
  const isRunning = timer.status === 'running'
  const displayValue = formatTimerDuration(timer.remainingMs)

  const selectPreset = (minutes: number) => {
    const durationMs = minutes * MINUTE_MS
    timer.configure(durationMs)
    setFields(toInputFields(durationMs))
    setError(null)
    announce(`Timer definido para ${minutes} minutos`)
  }

  const applyManualDuration = () => {
    const hours = parseInputField(fields.hours)
    const minutes = parseInputField(fields.minutes)
    const seconds = parseInputField(fields.seconds)

    if (hours === null || minutes === null || seconds === null) {
      setError('Use apenas números inteiros nos três campos.')
      return
    }

    const durationMs = durationPartsToMs({ hours, minutes, seconds })

    if (durationMs === null) {
      setError('Informe entre 1 segundo e 99:59:59.')
      return
    }

    timer.configure(durationMs)
    setFields(toInputFields(durationMs))
    setError(null)
    announce(`Timer definido para ${formatTimerDuration(durationMs)}`)
  }

  const toggleTimer = () => {
    if (isRunning) {
      timer.pause()
      announce('Timer pausado')
      return
    }

    timer.start()
    announce(timer.status === 'paused' ? 'Timer retomado' : 'Timer iniciado')
  }

  const resetTimer = () => {
    timer.reset()
    announce('Timer resetado')
  }

  const primaryLabel = isRunning
    ? 'Pausar'
    : timer.status === 'completed'
      ? 'Reiniciar'
      : timer.status === 'paused'
        ? 'Continuar'
        : 'Iniciar'

  return (
    <section
      aria-labelledby="timer-title"
      className="flex w-full flex-col items-center"
    >
      <h1 className="sr-only" id="timer-title">
        Timer
      </h1>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        {timer.status === 'completed'
          ? 'Timer concluído'
          : isRunning
            ? 'Contagem regressiva'
            : 'Defina um tempo e comece'}
      </p>

      <TimeDisplay label="Timer" value={displayValue} />

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <ControlButton
          aria-label={`${primaryLabel} Timer`}
          intent="primary"
          onClick={toggleTimer}
        >
          {primaryLabel}
          <span
            aria-hidden="true"
            className="ml-2 hidden text-xs opacity-70 sm:inline"
          >
            Space
          </span>
        </ControlButton>
        <ControlButton
          aria-label="Resetar Timer"
          disabled={timer.status === 'idle'}
          onClick={resetTimer}
        >
          Resetar
          <span
            aria-hidden="true"
            className="ml-2 hidden text-xs opacity-70 sm:inline"
          >
            R
          </span>
        </ControlButton>
      </div>

      <div className="mt-12 w-full max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <fieldset className="min-w-0" disabled={isRunning}>
            <legend className="mb-3 text-left text-xs font-bold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
              Presets
            </legend>
            <div className="flex flex-wrap gap-2">
              {presets.map((minutes) => {
                const durationMs = minutes * MINUTE_MS

                return (
                  <button
                    aria-label={`Definir Timer para ${minutes} minutos`}
                    aria-pressed={timer.configuredDurationMs === durationMs}
                    className="min-h-11 rounded-full border border-[var(--border)] px-4 text-sm font-bold text-[var(--text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-45 aria-pressed:border-[var(--accent)] aria-pressed:bg-[var(--accent-soft)]"
                    key={minutes}
                    onClick={() => selectPreset(minutes)}
                    type="button"
                  >
                    {minutes} min
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="min-w-0" disabled={isRunning}>
            <legend className="mb-3 text-left text-xs font-bold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
              Manual
            </legend>
            <div className="flex flex-wrap items-end gap-2">
              {(
                [
                  ['hours', 'Horas', 99],
                  ['minutes', 'Minutos', 59],
                  ['seconds', 'Segundos', 59],
                ] as const
              ).map(([field, label, max], index) => (
                <div className="flex items-end gap-2" key={field}>
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="pb-2.5 text-[var(--text-secondary)]"
                    >
                      :
                    </span>
                  )}
                  <label className="flex flex-col gap-1.5 text-left text-[0.6875rem] text-[var(--text-secondary)]">
                    {label}
                    <input
                      aria-describedby={error ? 'timer-input-error' : undefined}
                      className="h-11 w-[4.25rem] rounded-xl border border-[var(--border)] bg-[var(--background)] px-2 text-center text-base text-[var(--text-primary)] tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-45"
                      inputMode="numeric"
                      max={max}
                      min={0}
                      onChange={(event) => {
                        setFields((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                        setError(null)
                      }}
                      type="number"
                      value={fields[field]}
                    />
                  </label>
                </div>
              ))}
              <button
                className="min-h-11 basis-full rounded-xl border border-[var(--border)] px-3 text-xs font-bold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-elevated)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-45 sm:basis-auto"
                onClick={applyManualDuration}
                type="button"
              >
                Aplicar
              </button>
            </div>
            <p
              className="mt-2 min-h-4 text-left text-xs text-[var(--danger)]"
              id="timer-input-error"
              role={error ? 'alert' : undefined}
            >
              {error}
            </p>
          </fieldset>
        </div>
      </div>
    </section>
  )
}
