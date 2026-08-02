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
    <section aria-labelledby="timer-title" className="instrument-panel">
      <h1 className="sr-only" id="timer-title">
        Timer
      </h1>
      <div className="display-bezel">
        <div className="display-status">
          <span aria-hidden="true" className="display-status__marker" />
          <span>
            {timer.status === 'completed'
              ? 'Timer concluído'
              : isRunning
                ? 'Contagem regressiva'
                : 'Defina um tempo e comece'}
          </span>
        </div>
        <TimeDisplay label="Timer" value={displayValue} />
        <p aria-hidden="true" className="display-units">
          HH&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;SS
        </p>
      </div>

      <div className="control-deck">
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

      <div className="configuration-bay">
        <div className="configuration-grid">
          <fieldset className="configuration-group" disabled={isRunning}>
            <legend className="panel-legend">Presets</legend>
            <div className="preset-bank">
              {presets.map((minutes) => {
                const durationMs = minutes * MINUTE_MS

                return (
                  <button
                    aria-label={`Definir Timer para ${minutes} minutos`}
                    aria-pressed={timer.configuredDurationMs === durationMs}
                    className="preset-key"
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

          <fieldset className="configuration-group" disabled={isRunning}>
            <legend className="panel-legend">Manual</legend>
            <div className="manual-control">
              {(
                [
                  ['hours', 'Horas', 99],
                  ['minutes', 'Minutos', 59],
                  ['seconds', 'Segundos', 59],
                ] as const
              ).map(([field, label, max], index) => (
                <div className="manual-field-group" key={field}>
                  {index > 0 && (
                    <span aria-hidden="true" className="manual-separator">
                      :
                    </span>
                  )}
                  <label className="manual-label">
                    {label}
                    <input
                      aria-describedby={error ? 'timer-input-error' : undefined}
                      className="manual-input"
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
                className="apply-key"
                onClick={applyManualDuration}
                type="button"
              >
                Aplicar
              </button>
            </div>
            <p
              className="input-error"
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
