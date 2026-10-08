import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'

async function addTask(user, title) {
  await user.type(screen.getByLabelText('New task'), `${title}{Enter}`)
}

const taskList = () => screen.getByRole('list', { name: 'Tasks' })

describe('TaskBuddy on a first visit', () => {
  it('shows sample tasks when nothing has been saved yet', () => {
    render(<App />)
    expect(within(taskList()).getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByRole('checkbox', { name: 'Pay electricity bill' })).toBeChecked()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
    expect(screen.getByText('3 tasks left')).toBeInTheDocument()
  })

  it('does not bring the samples back once the list has been emptied', async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    for (const button of screen.getAllByRole('button', { name: /^Delete / })) {
      await user.click(button)
    }
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
    first.unmount()

    render(<App />)
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })
})

describe('TaskBuddy', () => {
  // A returning visitor with an empty list, so each test starts from a blank slate.
  beforeEach(() => localStorage.setItem('taskbuddy.tasks', '[]'))

  it('starts with an empty state and a disabled add button', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'TaskBuddy' })).toBeInTheDocument()
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add task' })).toBeDisabled()
    expect(screen.getByText('0 tasks left')).toBeInTheDocument()
  })

  it('adds tasks with Enter or the button, newest first, and clears the input', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTask(user, 'Write report')
    await user.type(screen.getByLabelText('New task'), 'Book tickets')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    const items = within(taskList()).getAllByRole('listitem')
    expect(items.map((li) => li.textContent)).toEqual(['Book tickets', 'Write report'])
    expect(screen.getByLabelText('New task')).toHaveValue('')
    expect(screen.getByLabelText('New task')).toHaveFocus()
    expect(screen.getByText('2 tasks left')).toBeInTheDocument()
  })

  it('ignores blank input', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, '   ')
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })

  it('completing a task updates the progress and the counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Write report')
    await addTask(user, 'Book tickets')

    await user.click(screen.getByRole('checkbox', { name: 'Write report' }))

    expect(screen.getByRole('checkbox', { name: 'Write report' })).toBeChecked()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
    expect(screen.getByText('1 task left')).toBeInTheDocument()
    expect(screen.getByText('1 to go. Keep it up!')).toBeInTheDocument()
  })

  it('filters between all, active and done tasks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Write report')
    await addTask(user, 'Book tickets')
    await user.click(screen.getByRole('checkbox', { name: 'Write report' }))

    await user.click(screen.getByRole('button', { name: /^Active/ }))
    expect(within(taskList()).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Book tickets'])

    await user.click(screen.getByRole('button', { name: /^Done/ }))
    expect(within(taskList()).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Write report'])
    expect(screen.getByRole('button', { name: /^Done/ })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: /^All/ }))
    expect(within(taskList()).getAllByRole('listitem')).toHaveLength(2)
  })

  it('shows a matching empty message for an empty filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Write report')
    await user.click(screen.getByRole('button', { name: /^Done/ }))
    expect(screen.getByText('Nothing completed yet')).toBeInTheDocument()
  })

  it('deletes a task and clears completed ones', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Write report')
    await addTask(user, 'Book tickets')
    await addTask(user, 'Call mum')

    await user.click(screen.getByRole('button', { name: 'Delete Book tickets' }))
    expect(screen.queryByText('Book tickets')).not.toBeInTheDocument()

    expect(screen.queryByRole('button', { name: 'Clear completed' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: 'Call mum' }))
    await user.click(screen.getByRole('button', { name: 'Clear completed' }))

    expect(within(taskList()).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Write report'])
  })

  it('keeps tasks after a reload', async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    await addTask(user, 'Write report')
    await user.click(screen.getByRole('checkbox', { name: 'Write report' }))
    first.unmount()

    render(<App />)
    expect(screen.getByRole('checkbox', { name: 'Write report' })).toBeChecked()
  })

  it('survives corrupted saved data', () => {
    localStorage.setItem('taskbuddy.tasks', '{broken json')
    render(<App />)
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })

  it('switches between light and dark themes and remembers the choice', async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    expect(document.documentElement.dataset.theme).toBe('light')

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('taskbuddy.theme')).toBe('dark')
    first.unmount()

    render(<App />)
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })
})
