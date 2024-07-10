'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic } from "lucide-react"

type AddTodoProps = {
  onAdd: (title: string) => void
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('')
  const [isListening, setIsListening] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim())
      setTitle('')
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
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-blue-300 p-4 shadow-lg">
      <div className="container mx-auto flex gap-2">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力"
          className="flex-grow"
        />
        <Button type="button" onClick={startListening} disabled={isListening}>
          <Mic className={isListening ? 'animate-pulse' : ''} />
        </Button>
        <Button type="submit">追加</Button>
      </div>
    </form>
  )
}
