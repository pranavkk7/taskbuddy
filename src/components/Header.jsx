import { useState } from 'react'
import { Logo, MoonIcon, SunIcon } from './icons.jsx'

const dateFormat = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

export default function Header({ theme, onToggleTheme }) {
  // Read the clock once when the header first appears, not on every render.
  const [today] = useState(() => new Date())
  const goingDark = theme !== 'dark'
  return (
    <header className="header">
      <div className="brand">
        <Logo />
        <div>
          <h1>TaskBuddy</h1>
          <p className="date">{dateFormat.format(today)}</p>
        </div>
      </div>
      <button
        type="button"
        className="icon-button"
        onClick={onToggleTheme}
        aria-label={goingDark ? 'Switch to dark theme' : 'Switch to light theme'}
        title={goingDark ? 'Dark theme' : 'Light theme'}
      >
        {goingDark ? <MoonIcon /> : <SunIcon />}
      </button>
    </header>
  )
}
