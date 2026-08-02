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
    <section aria-labelledby="stopwatch-title" className="instrument-panel">
      <h1 className="sr-only" id="stopwatch-title">
        Cronômetro
      </h1>
      <div className="display-bezel">
        <div className="display-status">
          <span aria-hidden="true" className="display-status__marker" />
          <span>
            {isRunning
              ? 'Tempo decorrido'
              : stopwatch.status === 'paused'
                ? 'Cronômetro pausado'
                : 'Pronto para começar'}
          </span>
        </div>
        <TimeDisplay compact label="Cronômetro" value={displayValue} />
        <p aria-hidden="true" className="display-units">
          MM&nbsp;&nbsp;&nbsp;SS&nbsp;&nbsp;&nbsp;CS
        </p>
      </div>

      <div className="control-deck">
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

      <div className="lap-register">
        <div className="lap-register__header">
          <h2 className="panel-legend">Voltas</h2>
          <span className="lap-register__count">
            MEM {stopwatch.laps.length.toString().padStart(2, '0')}
          </span>
        </div>

        {stopwatch.laps.length === 0 ? (
          <p className="lap-register__empty">
            As voltas registradas aparecerão aqui.
          </p>
        ) : (
          <div
            className="lap-register__scroll"
            role="region"
            aria-label="Lista de voltas"
            tabIndex={0}
          >
            <table className="lap-table">
              <thead>
                <tr>
                  <th className="lap-table__heading" scope="col">
                    Volta
                  </th>
                  <th className="lap-table__heading text-right" scope="col">
                    Parcial
                  </th>
                  <th className="lap-table__heading text-right" scope="col">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {stopwatch.laps.toReversed().map((lap) => (
                  <tr className="lap-table__row" key={lap.number}>
                    <th
                      className="lap-table__cell lap-table__cell--index"
                      scope="row"
                    >
                      {lap.number.toString().padStart(2, '0')}
                    </th>
                    <td className="lap-table__cell text-right text-[var(--text-secondary)]">
                      +{formatStopwatchDuration(lap.splitMs)}
                    </td>
                    <td className="lap-table__cell text-right font-bold">
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
