import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

// Every test starts with an empty browser: no saved tasks, no saved theme.
beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

afterEach(cleanup)
