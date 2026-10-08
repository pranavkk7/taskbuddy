import { FILTERS } from '../lib/tasks.js'

const LABELS = { all: 'All', active: 'Active', done: 'Done' }

/** All / Active / Done switch. Each option shows how many tasks it holds. */
export default function FilterTabs({ filter, onChange, stats }) {
  const counts = { all: stats.total, active: stats.active, done: stats.done }
  return (
    <div className="filters" role="group" aria-label="Filter tasks">
      {FILTERS.map((name) => (
        <button
          key={name}
          type="button"
          className={name === filter ? 'filter active' : 'filter'}
          aria-pressed={name === filter}
          onClick={() => onChange(name)}
        >
          {LABELS[name]}
          <span className="count">{counts[name]}</span>
        </button>
      ))}
    </div>
  )
}
