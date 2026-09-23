import { FONT_IDS, THEME_IDS, type FontId, type Settings, type ThemeId } from '@recall/engine'

export const THEMES: {
  id: ThemeId
  name: string
  background: string
  surface: string
  accent: string
}[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    background: '#09090b',
    surface: '#18181b',
    accent: '#6366f1',
  },
  { id: 'ocean', name: 'Ocean', background: '#071820', surface: '#112a34', accent: '#147e9c' },
  { id: 'pine', name: 'Pine', background: '#0c1713', surface: '#192821', accent: '#367f53' },
  { id: 'plum', name: 'Plum', background: '#1a1120', surface: '#2b1b32', accent: '#8d53b4' },
  { id: 'ember', name: 'Ember', background: '#1d140e', surface: '#302118', accent: '#9b5b2e' },
  { id: 'berry', name: 'Berry', background: '#1d1119', surface: '#301d28', accent: '#ad3e72' },
]

export const FONTS: { id: FontId; name: string; stack: string }[] = [
  {
    id: 'system',
    name: 'System',
    stack: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    stack: 'ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif',
  },
  { id: 'serif', name: 'Serif', stack: 'ui-serif, Georgia, Cambria, serif' },
  { id: 'mono', name: 'Mono', stack: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' },
]

export function applyAppearance(settings: Settings) {
  const theme = THEME_IDS.includes(settings.theme ?? 'midnight')
    ? (settings.theme ?? 'midnight')
    : 'midnight'
  const font = FONT_IDS.includes(settings.font ?? 'system') ? (settings.font ?? 'system') : 'system'
  document.documentElement.dataset.theme = theme
  document.documentElement.dataset.font = font
  const color = THEMES.find((item) => item.id === theme)?.background ?? '#09090b'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
  try {
    localStorage.setItem('recall-theme', theme)
    localStorage.setItem('recall-font', font)
  } catch {
    // Appearance still works for this visit if storage is unavailable.
  }
}
