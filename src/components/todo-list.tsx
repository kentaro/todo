import { Todo } from '@/types'
import { TodoItem } from './todo-item'

type TodoListProps = {
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
