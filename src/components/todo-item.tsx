import { useState } from 'react'
import { Todo } from '@/types'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type TodoItemProps = {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, newTitle: string, newDueDate?: Date) => void
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '')
  const [editDueTime, setEditDueTime] = useState(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[1].substr(0, 5) : '')

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    return dateObj.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleUpdate = () => {
    const newDueDate = editDueDate && editDueTime
      ? new Date(`${editDueDate}T${editDueTime}`)
      : undefined
    onUpdate(todo.id, editTitle, newDueDate)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="y2k-card flex flex-col sm:flex-row items-center gap-2 p-4 mb-4">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="y2k-input flex-grow"
        />
        <Input
          type="date"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
          className="y2k-input w-auto"
        />
        <Input
          type="time"
          value={editDueTime}
          onChange={(e) => setEditDueTime(e.target.value)}
          className="y2k-input w-auto"
        />
        <Button onClick={handleUpdate} className="y2k-button">更新</Button>
        <Button onClick={() => setIsEditing(false)} className="y2k-button">キャンセル</Button>
      </div>
    )
  }

  return (
    <div className="y2k-card flex items-center gap-4 p-4 mb-4 todo-item">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        id={`todo-${todo.id}`}
        className="border-2 border-primary w-6 h-6"
      />
      <span className={`flex-grow text-lg ${todo.completed ? 'line-through text-gray-500' : ''}`}>{todo.title}</span>
      {todo.dueDate && (
        <span className="text-sm text-accent">{formatDate(todo.dueDate)}</span>
      )}
      <Button onClick={() => setIsEditing(true)} className="y2k-button">編集</Button>
      <Button onClick={() => onDelete(todo.id)} className="y2k-button bg-red-500 hover:bg-red-600">削除</Button>
    </div>
  )
}
