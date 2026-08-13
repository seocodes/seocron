import type { DisplayScale } from '../features/display/display-scale'

export interface DisplayControlsProps {
  scale: DisplayScale
  isFocusMode: boolean
  isFullscreen: boolean
  isFullscreenSupported: boolean
  onDecrease: () => void
  onIncrease: () => void
  onToggleFocus: () => void
  onToggleFullscreen: () => void
}

export function DisplayControls({
  scale,
  isFocusMode,
  isFullscreen,
  isFullscreenSupported,
  onDecrease,
  onIncrease,
  onToggleFocus,
  onToggleFullscreen,
}: DisplayControlsProps) {
  return (
    <div aria-label="Controles de visualização" className="display-toolbar">
      <div className="display-toolbar__group">
        <button
          aria-label="Diminuir mostrador"
          className="display-tool-key"
          disabled={scale === 80}
          onClick={onDecrease}
          type="button"
        >
          <span aria-hidden="true">−</span>
        </button>
        <span
          aria-label={`Tamanho do mostrador: ${scale}%`}
          className="display-scale"
        >
          {scale}%
        </span>
        <button
          aria-label="Aumentar mostrador"
          className="display-tool-key"
          disabled={scale === 140}
          onClick={onIncrease}
          type="button"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <div className="display-toolbar__group">
        <button
          aria-label={isFocusMode ? 'Sair do modo foco' : 'Ativar modo foco'}
          aria-pressed={isFocusMode}
          className="display-tool-key display-tool-key--text"
          onClick={onToggleFocus}
          type="button"
        >
          Foco
        </button>
        <button
          aria-label={
            isFullscreenSupported
              ? isFullscreen
                ? 'Sair da tela cheia'
                : 'Entrar em tela cheia'
              : 'Tela cheia indisponível neste navegador'
          }
          aria-pressed={isFullscreen}
          className="display-tool-key display-tool-key--text"
          disabled={!isFullscreenSupported}
          onClick={onToggleFullscreen}
          title={
            isFullscreenSupported
              ? undefined
              : 'Tela cheia indisponível neste navegador'
          }
          type="button"
        >
          Tela
        </button>
      </div>
    </div>
  )
}
