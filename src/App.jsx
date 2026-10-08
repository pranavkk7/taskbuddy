import { useState } from 'react'
import FilterTabs from './components/FilterTabs.jsx'
import Header from './components/Header.jsx'
import ProgressCard from './components/ProgressCard.jsx'
import TaskInput from './components/TaskInput.jsx'
import TaskList from './components/TaskList.jsx'
import { useTasks } from './hooks/useTasks.js'
import { useTheme } from './hooks/useTheme.js'
import { filterTasks, getStats } from './lib/tasks.js'

export default function App() {
  const { tasks, add, toggle, remove, clearCompleted } = useTasks()
  const { theme, toggleTheme } = useTheme()
  const [filter, setFilter] = useState('all')

  const stats = getStats(tasks)
  const visible = filterTasks(tasks, filter)

  return (
    <div className="page">
      <main className="app">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <ProgressCard stats={stats} />
        <TaskInput onAdd={add} />
        <FilterTabs filter={filter} onChange={setFilter} stats={stats} />
        <TaskList tasks={visible} filter={filter} onToggle={toggle} onDelete={remove} />
        <footer className="footer">
          <span aria-live="polite">
            {stats.active} task{stats.active === 1 ? '' : 's'} left
          </span>
          {stats.done > 0 && (
            <button type="button" className="link" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </footer>
      </main>
      <p className="hint">Your tasks are saved in this browser.</p>
    </div>
  )
}
