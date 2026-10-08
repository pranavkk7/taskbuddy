import { describe, expect, it } from 'vitest'
import { MAX_TITLE_LENGTH, addTask, clearDone, filterTasks, getStats, parseStoredTasks, removeTask, sampleTasks, toggleTask } from './tasks.js'

const sample = [
  { id: 'a', title: 'Write report', done: false, createdAt: 1 },
  { id: 'b', title: 'Book tickets', done: true, createdAt: 2 },
  { id: 'c', title: 'Call mum', done: false, createdAt: 3 },
]

describe('addTask', () => {
  it('adds a trimmed task to the top of the list', () => {
    const result = addTask(sample, '  Buy milk  ')
    expect(result).toHaveLength(4)
    expect(result[0]).toMatchObject({ title: 'Buy milk', done: false })
    expect(typeof result[0].id).toBe('string')
  })

  it('ignores blank titles and returns the same list', () => {
    expect(addTask(sample, '   ')).toBe(sample)
    expect(addTask(sample, '')).toBe(sample)
  })

  it('cuts very long titles to the maximum length', () => {
    const [task] = addTask([], 'x'.repeat(500))
    expect(task.title).toHaveLength(MAX_TITLE_LENGTH)
  })

  it('gives every task a different id', () => {
    let tasks = []
    for (let i = 0; i < 50; i++) tasks = addTask(tasks, `Task ${i}`)
    expect(new Set(tasks.map((t) => t.id)).size).toBe(50)
  })

  it('does not change the list it was given', () => {
    const before = [...sample]
    addTask(sample, 'New')
    expect(sample).toEqual(before)
  })
})

describe('toggleTask, removeTask and clearDone', () => {
  it('toggles only the matching task', () => {
    const result = toggleTask(sample, 'a')
    expect(result.find((t) => t.id === 'a').done).toBe(true)
    expect(result.find((t) => t.id === 'b').done).toBe(true)
    expect(sample[0].done).toBe(false) // original untouched
  })

  it('removes a task by id and ignores unknown ids', () => {
    expect(removeTask(sample, 'b').map((t) => t.id)).toEqual(['a', 'c'])
    expect(removeTask(sample, 'zzz')).toHaveLength(3)
  })

  it('clears only completed tasks', () => {
    expect(clearDone(sample).map((t) => t.id)).toEqual(['a', 'c'])
  })
})

describe('filterTasks and getStats', () => {
  it('filters by state', () => {
    expect(filterTasks(sample, 'all')).toHaveLength(3)
    expect(filterTasks(sample, 'active').map((t) => t.id)).toEqual(['a', 'c'])
    expect(filterTasks(sample, 'done').map((t) => t.id)).toEqual(['b'])
  })

  it('counts tasks and rounds the percentage', () => {
    expect(getStats(sample)).toEqual({ total: 3, done: 1, active: 2, percent: 33 })
    expect(getStats([])).toEqual({ total: 0, done: 0, active: 0, percent: 0 })
    expect(getStats([{ id: 'x', title: 'x', done: true }]).percent).toBe(100)
  })
})

describe('parseStoredTasks', () => {
  it('reads valid saved tasks', () => {
    expect(parseStoredTasks(JSON.stringify(sample))).toEqual(sample)
  })

  it('returns an empty list for missing or broken data', () => {
    expect(parseStoredTasks(null)).toEqual([])
    expect(parseStoredTasks('not json')).toEqual([])
    expect(parseStoredTasks('{"a":1}')).toEqual([])
  })

  it('drops malformed entries and repairs missing fields', () => {
    const raw = JSON.stringify([{ id: 'ok', title: 'Fine' }, { title: 'no id' }, null, 42, { id: 'blank', title: '   ' }])
    const result = parseStoredTasks(raw)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ id: 'ok', title: 'Fine', done: false })
    expect(typeof result[0].createdAt).toBe('number')
  })
})

describe('sampleTasks', () => {
  it('returns valid tasks that survive a save and reload', () => {
    const tasks = sampleTasks()
    expect(tasks.length).toBeGreaterThan(0)
    expect(parseStoredTasks(JSON.stringify(tasks))).toEqual(tasks)
  })

  it('gives fresh ids on every call', () => {
    const first = sampleTasks().map((task) => task.id)
    const second = sampleTasks().map((task) => task.id)
    expect(new Set([...first, ...second]).size).toBe(first.length * 2)
  })
})
