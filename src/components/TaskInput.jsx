import { useRef, useState } from 'react'
import { MAX_TITLE_LENGTH } from '../lib/tasks.js'
import { PlusIcon } from './icons.jsx'

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)
  const canAdd = text.trim().length > 0

  const submit = (event) => {
    event.preventDefault()
    if (!canAdd) return
    onAdd(text)
    setText('')
    inputRef.current?.focus() // ready for the next task straight away
  }

  return (
    <form className="add" onSubmit={submit}>
      <input
        ref={inputRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs doing?"
        aria-label="New task"
        maxLength={MAX_TITLE_LENGTH}
        autoComplete="off"
        enterKeyHint="done"
      />
      <button type="submit" className="add-button" disabled={!canAdd} aria-label="Add task">
        <PlusIcon />
        <span>Add</span>
      </button>
    </form>
  )
}
