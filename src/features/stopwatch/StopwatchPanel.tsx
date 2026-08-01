import { ControlButton } from '../../components/ControlButton'
import { TimeDisplay } from '../../components/TimeDisplay'
import { formatStopwatchDuration } from '../../lib/time/formatDuration'
import type { StopwatchController } from './useStopwatch'

interface StopwatchPanelProps {
  stopwatch: StopwatchController
  announce: (message: string) => void
}

export function StopwatchPanel({ stopwatch, announce }: StopwatchPanelProps) {
  const isRunning = stopwatch.status === 'running'
  const displayValue = formatStopwatchDuration(stopwatch.elapsedMs)

  const toggleStopwatch = () => {
    if (isRunning) {
      stopwatch.pause()
      announce('Cronômetro pausado')
      return
    }

    stopwatch.start()
    announce(
      stopwatch.status === 'paused'
        ? 'Cronômetro retomado'
        : 'Cronômetro iniciado',
    )
  }

  const recordLap = () => {
    const nextLapNumber = stopwatch.laps.length + 1
    stopwatch.recordLap()
    announce(`Volta ${nextLapNumber} registrada`)
  }

  const resetStopwatch = () => {
    stopwatch.reset()
    announce('Cronômetro resetado')
  }

  const primaryLabel = isRunning
    ? 'Pausar'
    : stopwatch.status === 'paused'
      ? 'Continuar'
      : 'Iniciar'

  return (
    <section
      aria-labelledby="stopwatch-title"
      className="flex w-full flex-col items-center"
    >
      <h1 className="sr-only" id="stopwatch-title">
        Cronômetro
      </h1>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        {isRunning ? 'Tempo decorrido' : 'Pronto para começar'}
      </p>

      <TimeDisplay compact label="Cronômetro" value={displayValue} />

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <ControlButton
          aria-label={`${primaryLabel} Cronômetro`}
          intent="primary"
          onClick={toggleStopwatch}
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
          aria-label="Registrar volta"
          disabled={!isRunning}
          onClick={recordLap}
        >
          Volta
        </ControlButton>
        <ControlButton
          aria-label="Resetar Cronômetro"
          disabled={stopwatch.status === 'idle'}
          onClick={resetStopwatch}
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

      <div className="mt-12 w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
          <h2 className="text-xs font-bold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
            Voltas
          </h2>
          <span className="text-xs text-[var(--text-secondary)]">
            {stopwatch.laps.length}
          </span>
        </div>

        {stopwatch.laps.length === 0 ? (
          <p className="px-5 py-8 text-sm text-[var(--text-secondary)]">
            As voltas registradas aparecerão aqui.
          </p>
        ) : (
          <div
            className="max-h-64 overflow-y-auto"
            role="region"
            aria-label="Lista de voltas"
            tabIndex={0}
          >
            <table className="w-full border-collapse text-sm tabular-nums">
              <thead className="sr-only">
                <tr>
                  <th scope="col">Volta</th>
                  <th scope="col">Parcial</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {stopwatch.laps.toReversed().map((lap) => (
                  <tr
                    className="border-b border-[var(--border)] last:border-b-0"
                    key={lap.number}
                  >
                    <th
                      className="px-5 py-4 text-left font-bold sm:px-6"
                      scope="row"
                    >
                      {lap.number.toString().padStart(2, '0')}
                    </th>
                    <td className="px-3 py-4 text-right text-[var(--text-secondary)]">
                      +{formatStopwatchDuration(lap.splitMs)}
                    </td>
                    <td className="px-5 py-4 text-right font-bold sm:px-6">
                      {formatStopwatchDuration(lap.elapsedMs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
