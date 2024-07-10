import { Todo } from '@/types'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

type TodoItemProps = {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex items-center gap-2 py-2 px-4 mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-lg shadow-md">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        id={`todo-${todo.id}`}
        className="border-2 border-white"
      />
      <div className="flex-grow">
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-white text-xl ${todo.completed ? 'line-through opacity-50' : ''}`}
        >
          {todo.title}
        </label>
        {todo.dueDate && (
          <p className="text-xs text-white opacity-75">
            期限: {formatDate(todo.dueDate)}
          </p>
        )}
      </div>
      <Button variant="destructive" size="sm" onClick={() => onDelete(todo.id)} className="bg-yellow-300 text-purple-800 hover:bg-yellow-400">
        削除
      </Button>
    </div>
  )
}
