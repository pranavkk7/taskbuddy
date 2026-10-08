import { CheckIcon, TrashIcon } from './icons.jsx'

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.done ? 'task done' : 'task'}>
      <label className="task-main">
        <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
        <span className="checkbox" aria-hidden="true">
          <CheckIcon width={14} height={14} />
        </span>
        <span className="task-title">{task.title}</span>
      </label>
      <button type="button" className="delete" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} title="Delete">
        <TrashIcon width={18} height={18} />
      </button>
    </li>
  )
}

const EMPTY = {
  all: { title: 'Nothing here yet', text: 'Add a task above and it will show up here.' },
  active: { title: 'All caught up', text: 'No active tasks. Enjoy the free time.' },
  done: { title: 'Nothing completed yet', text: 'Tick a task off and it will move here.' },
}

function EmptyState({ filter }) {
  const { title, text } = EMPTY[filter]
  return (
    <li className="empty">
      <svg width="96" height="80" viewBox="0 0 96 80" aria-hidden="true">
        <rect x="14" y="10" width="68" height="60" rx="12" className="empty-card" />
        <rect x="26" y="26" width="14" height="14" rx="4.5" className="empty-box" />
        <path d="M29 33l3 3 6-6.5" className="empty-check" />
        <rect x="46" y="29" width="26" height="6" rx="3" className="empty-line" />
        <rect x="26" y="48" width="14" height="14" rx="4.5" className="empty-box muted" />
        <rect x="46" y="51" width="18" height="6" rx="3" className="empty-line" />
      </svg>
      <p className="empty-title">{title}</p>
      <p className="empty-text">{text}</p>
    </li>
  )
}

export default function TaskList({ tasks, filter, onToggle, onDelete }) {
  return (
    <ul className="list" aria-label="Tasks">
      {tasks.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />)
      )}
    </ul>
  )
}
