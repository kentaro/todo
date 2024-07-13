import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onTimerStateChange: (isActive: boolean) => void;
}

export function PomodoroTimer({ isOpen, onClose, onTimerStateChange }: PomodoroTimerProps) {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(25);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      alert('ポモドーロセッションが終了しました！');
      resetTimer();
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => {
    const newState = !isActive;
    setIsActive(newState);
    onTimerStateChange(newState);
  };

  const resetTimer = () => {
    setTime(duration * 60);
    setIsActive(false);
    onTimerStateChange(false);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(e.target.value, 10);
    setDuration(newDuration);
    setTime(newDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-foreground hover:text-accent transition-colors duration-200"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-accent text-center">ポモドーロタイマー</h2>
        <div className="text-6xl font-bold mb-4 text-center text-foreground">{formatTime(time)}</div>
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={toggleTimer}
            className={`px-6 py-2 rounded-full ${
              isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white font-bold transition-colors duration-200`}
          >
            {isActive ? '一時停止' : 'スタート'}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold transition-colors duration-200"
          >
            リセット
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block text-sm font-medium text-foreground mb-1">
            タイマー時間 (分):
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={handleDurationChange}
            min="1"
            max="60"
            className="w-full px-3 py-2 bg-background border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
          />
        </div>
      </div>
    </div>
  );
}
