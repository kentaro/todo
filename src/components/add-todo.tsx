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
  const [dueTime, setDueTime] = useState('')
  const [isListening, setIsListening] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      const dueDateTimeString = dueDate && dueTime ? `${dueDate}T${dueTime}` : undefined
      const dueDateObj = dueDateTimeString ? new Date(dueDateTimeString) : undefined
      onAdd(title.trim(), dueDateObj)
      setTitle('')
      setDueDate('')
      setDueTime('')
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
    <form onSubmit={handleSubmit} className="y2k-card p-6 bg-[var(--card-bg)] max-w-3xl mx-auto">
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力"
          className="y2k-input text-lg p-3"
        />
        <div className="flex gap-4">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="y2k-input flex-grow"
          />
          <Input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="y2k-input flex-grow"
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit" className="y2k-button flex-grow text-lg py-3">
            追加
          </Button>
          <Button type="button" onClick={startListening} disabled={isListening} className="y2k-button flex-grow text-lg py-3">
            <Mic className={`w-6 h-6 ${isListening ? 'text-accent animate-pulse' : 'text-primary'}`} />
          </Button>
        </div>
      </div>
    </form>
  )
}
