'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Plus, QrCode, X } from "lucide-react"
import { useZxing } from "react-zxing";

type AddTodoProps = {
  onAdd: (title: string, dueDate?: Date) => void
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [isListening, setIsListening] = useState(false)
  const { ref } = useZxing({
    onDecodeResult(result) {
      setScanResult(result.getText());
    },
  });
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const toggleScanner = () => {
    setShowScanner(!showScanner);
  };

  const handleScanConfirm = () => {
    if (scanResult) {
      setTitle(scanResult);
      setScanResult(null);
      setShowScanner(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      const dueDateTimeString = dueDate && dueTime ? `${dueDate}T${dueTime}` : undefined
      const dueDateObj = dueDateTimeString ? new Date(dueDateTimeString) : undefined
      onAdd(title.trim(), dueDateObj)
      setTitle('')
      setDueDate('')
      setDueTime('')
      setShowScanner(false)
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

    let timeoutId: NodeJS.Timeout

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript
      setTitle(speechResult)
      setIsListening(false)
      recognition.stop()
      clearTimeout(timeoutId)
    }

    recognition.onerror = (event) => {
      console.error('音声認識エラー:', event.error)
      setIsListening(false)
      recognition.stop()
      clearTimeout(timeoutId)
    }

    recognition.onend = () => {
      setIsListening(false)
      clearTimeout(timeoutId)
    }

    // 10秒後にタイムアウトする
    timeoutId = setTimeout(() => {
      recognition.stop()
      setIsListening(false)
    }, 10000)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="y2k-card p-6 bg-[var(--card-bg)] max-w-3xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="新しいタスクを入力"
            className="y2k-input text-lg p-3 pr-24 border-b-2 border-secondary focus:border-primary"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <Button
              type="button"
              onClick={() => setShowScanner(true)}
              className="bg-transparent hover:bg-transparent p-1"
            >
              <QrCode className="w-5 h-5 text-primary" />
            </Button>
            <Button
              type="button"
              onClick={startListening}
              disabled={isListening}
              className="bg-transparent hover:bg-transparent p-1"
            >
              <Mic className={`w-5 h-5 ${isListening ? 'text-accent animate-pulse' : 'text-primary'}`} />
            </Button>
          </div>
        </div>
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
            <Plus className="w-6 h-6" />
            <span>追加</span>
          </Button>
        </div>
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-sm w-full">
              <div className="mb-4">
                <video ref={ref} className="w-full" />
              </div>
              {scanResult && (
                <div className="mb-4">
                  <p className="text-lg font-semibold">スキャン結果:</p>
                  <p className="break-all">{scanResult}</p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button onClick={() => {
                  setShowScanner(false);
                  setScanResult(null);
                }} className="y2k-button">
                  キャンセル
                </Button>
                <Button onClick={handleScanConfirm} className="y2k-button" disabled={!scanResult}>
                  OK
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
