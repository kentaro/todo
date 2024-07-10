'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic } from "lucide-react"

type AddTodoProps = {
  onAdd: (title: string, dueDate?: Date) => void
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isListening, setIsListening] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      const dueDateObj = dueDate ? new Date(dueDate) : undefined
      onAdd(title.trim(), dueDateObj)
      setTitle('')
      setDueDate('')
    }
  }

  const startListening = useCallback(() => {
    setIsListening(true)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ja-JP'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.start()

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript
      setTitle(speechResult)
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('音声認識エラー:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4">
      <div className="flex items-center gap-2">
        <div className="flex-grow flex items-center gap-2">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="新しいタスクを入力"
            className="flex-grow"
          />
          <div className="relative">
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-auto appearance-none"
              id="dueDateInput"
            />
            <Button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
              variant="ghost"
              onClick={() => document.getElementById('dueDateInput')?.showPicker()}
            >
            </Button>
          </div>
        </div>
        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
          追加
        </Button>
        <Button type="button" onClick={startListening} disabled={isListening} className="bg-blue-500 hover:bg-blue-600 text-white">
          <Mic className={isListening ? 'animate-pulse' : ''} />
        </Button>
      </div>
    </form>
  )
}
