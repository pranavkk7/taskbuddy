// Pure task logic. Every function returns a new array and never changes its input,
// which keeps React state updates predictable and makes this file easy to test.

export const FILTERS = ['all', 'active', 'done']
export const MAX_TITLE_LENGTH = 120

/** A unique id. `crypto.randomUUID` only exists on secure pages, so there is a fallback. */
function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Adds a task to the top of the list. Blank titles are ignored. */
export function addTask(tasks, title) {
  const clean = title.trim().slice(0, MAX_TITLE_LENGTH)
  if (!clean) return tasks
  return [{ id: newId(), title: clean, done: false, createdAt: Date.now() }, ...tasks]
}

const SAMPLES = [
  { title: 'Tick me off to watch the progress ring fill up', done: false },
  { title: 'Review pull request for the login page', done: false },
  { title: 'Prepare slides for Monday stand-up', done: false },
  { title: 'Pay electricity bill', done: true },
  { title: '30 minute evening walk', done: true },
]

/** A few example tasks for a first visit, so the app is not empty the first time it opens. */
export function sampleTasks() {
  const now = Date.now()
  return SAMPLES.map((sample, index) => ({ id: newId(), ...sample, createdAt: now - index }))
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id)
}

export function clearDone(tasks) {
  return tasks.filter((task) => !task.done)
}

export function filterTasks(tasks, filter) {
  if (filter === 'active') return tasks.filter((task) => !task.done)
  if (filter === 'done') return tasks.filter((task) => task.done)
  return tasks
}

/** Counts for the progress ring and the filter tabs. */
export function getStats(tasks) {
  const total = tasks.length
  const done = tasks.filter((task) => task.done).length
  return { total, done, active: total - done, percent: total === 0 ? 0 : Math.round((done / total) * 100) }
}

/**
 * Reads tasks saved in localStorage. Anything that is not a valid task is dropped,
 * so corrupted or hand-edited data can never crash the app.
 */
export function parseStoredTasks(raw) {
  try {
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data
      .filter((item) => item && typeof item.id === 'string' && typeof item.title === 'string' && item.title.trim())
      .map((item) => ({
        id: item.id,
        title: item.title,
        done: Boolean(item.done),
        createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
      }))
  } catch {
    return []
  }
}
