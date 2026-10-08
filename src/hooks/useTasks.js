import { useCallback, useEffect, useState } from 'react'
import { addTask, clearDone, parseStoredTasks, removeTask, sampleTasks, toggleTask } from '../lib/tasks.js'

const STORAGE_KEY = 'taskbuddy.tasks'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    // Nothing saved means a first visit: start with examples. An emptied list is saved as "[]" and stays empty.
    return raw === null ? sampleTasks() : parseStoredTasks(raw)
  } catch {
    return [] // storage can be blocked (private mode); the app still works for the session
  }
}

/** The task list, saved to localStorage so it survives a refresh. */
export function useTasks() {
  const [tasks, setTasks] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // Nothing useful to do if saving fails; the tasks stay in memory.
    }
  }, [tasks])

  // Functional updates always start from the latest list, even when calls come in quickly.
  const add = useCallback((title) => setTasks((current) => addTask(current, title)), [])
  const toggle = useCallback((id) => setTasks((current) => toggleTask(current, id)), [])
  const remove = useCallback((id) => setTasks((current) => removeTask(current, id)), [])
  const clearCompleted = useCallback(() => setTasks((current) => clearDone(current)), [])

  return { tasks, add, toggle, remove, clearCompleted }
}
