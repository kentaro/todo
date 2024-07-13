import { useState, useRef, useEffect } from "react";
import { Todo } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Check, X, Menu } from "lucide-react";
import { useReward } from 'react-rewards';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newTitle: string, newDueDate?: Date) => void;
  rewardId: string;
};

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  rewardId,
}: TodoItemProps) {
  const { reward } = useReward(rewardId, 'confetti', {
    angle: 60,
    elementSize: 10,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : ""
  );
  const [editDueTime, setEditDueTime] = useState(
    todo.dueDate
      ? new Date(todo.dueDate).toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : ""
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleUpdate = () => {
    const newDueDate =
      editDueDate && editDueTime
        ? new Date(`${editDueDate}T${editDueTime}:00`)
        : undefined;
    onUpdate(todo.id, editTitle, newDueDate);
    setIsEditing(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleToggle = () => {
    if (!todo.completed) {
      reward();
    }
    onToggle(todo.id);
  };

  if (isEditing) {
    return (
      <div className="y2k-card flex flex-col gap-2 p-4 mb-4">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="y2k-input text-lg p-3 pr-12 border-b-2 border-secondary focus:border-primary"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="y2k-input flex-grow text-lg p-3 border-b-2 border-secondary focus:border-primary"
          />
          <Input
            type="time"
            value={editDueTime}
            onChange={(e) => setEditDueTime(e.target.value)}
            className="y2k-input flex-grow text-lg p-3 border-b-2 border-secondary focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpdate} className="y2k-button flex-grow">
            <Check className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setIsEditing(false)}
            className="y2k-button flex-grow"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`y2k-card flex items-center gap-2 p-3 mb-2 todo-item ${
        todo.completed ? "bg-opacity-50" : ""
      }`}
    >
      <div className="relative inline-block">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          id={`todo-${todo.id}`}
          className="border-2 border-primary w-5 h-5 z-10 relative"
        />
        <span id={rewardId} className="absolute inset-0 pointer-events-none" />
      </div>
      <div className="flex-grow overflow-hidden">
        <p
          className={`text-base font-semibold overflow-hidden text-ellipsis break-words ${
            todo.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {todo.title}
        </p>
        {todo.dueDate && (
          <p className="text-sm text-gray-600">
            {formatDate(todo.dueDate)}
          </p>
        )}
      </div>
      <div className="relative" ref={menuRef}>
        <Menu onClick={toggleMenu} className="w-5 h-5" />
        {isMenuOpen && (
          <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10">
            <Button
              onClick={() => {
                setIsEditing(true);
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100"
            >
              編集
            </Button>
            <Button
              onClick={() => {
                onDelete(todo.id);
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 text-red-500"
            >
              削除
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
