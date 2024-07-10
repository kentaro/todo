import { Todo } from '@/types'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

type TodoItemProps = {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2 py-2 px-4 mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-lg shadow-md">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        id={`todo-${todo.id}`}
        className="border-2 border-white"
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`flex-grow text-white text-lg ${todo.completed ? 'line-through opacity-50' : ''}`}
      >
        {todo.title}
      </label>
      <Button variant="destructive" size="sm" onClick={() => onDelete(todo.id)} className="bg-yellow-300 text-purple-800 hover:bg-yellow-400">
        削除
      </Button>
    </div>
  )
}
