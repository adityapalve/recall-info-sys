import { useEffect } from 'react'
import { AVATAR_IDS, type AvatarId } from '@recall/engine'

interface Props {
  selected: AvatarId
  onSelect: (avatar: AvatarId) => void
  onClose: () => void
}

export function AvatarPicker({ selected, onSelect, onClose }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-title"
        className="w-full max-w-lg rounded-3xl border border-zinc-700 bg-zinc-950 p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 id="avatar-title" className="text-lg font-bold">
              Pick an avatar
            </h2>
            <p className="mt-1 text-sm text-zinc-400">A little study companion, just for you.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close avatar picker"
            className="rounded-full p-2 text-xl text-zinc-400 hover:text-white"
          >
            ×
          </button>
        </div>
        <div className="mt-5 grid grid-cols-5 gap-3">
          {AVATAR_IDS.map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => onSelect(avatar)}
              aria-label={`${avatar} avatar`}
              aria-pressed={avatar === selected}
              className={`relative rounded-full p-0.5 transition-transform active:scale-95 ${
                avatar === selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-zinc-950' : ''
              }`}
            >
              <img
                src={`/avatars/${avatar}.svg`}
                alt=""
                className="aspect-square w-full rounded-full"
              />
              {avatar === selected ? (
                <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-xs text-white">
                  ✓
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
