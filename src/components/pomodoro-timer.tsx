import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

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
    } else if (isActive && time === 0) {
      setIsActive(false);
      alert('ポモドーロセッションが終了しました！');
      resetTimer();
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => {
    if (duration > 0) {
      const newState = !isActive;
      setIsActive(newState);
      onTimerStateChange(newState);
    }
  };

  const resetTimer = () => {
    setTime(duration * 60);
    setIsActive(false);
    onTimerStateChange(false);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      setDuration(0);
      setTime(0);
    } else {
      const newDuration = Math.max(1, parseInt(inputValue, 10));
      setDuration(newDuration);
      setTime(newDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-lg p-6 shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-pink-300 hover:bg-pink-400 text-white rounded-full p-1 transition-colors duration-200 z-10"
        >
          <X size={20} />
        </button>
        <div className="text-6xl font-bold mb-4 text-center text-foreground">{formatTime(time)}</div>
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={toggleTimer}
            className={`y2k-button py-3 ${duration === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={duration === 0}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={resetTimer}
            className="y2k-button bg-gray-500 hover:bg-gray-600"
          >
            <RotateCcw size={24} />
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block text-sm font-medium text-foreground mb-1">
            タイマー時間 (分):
          </label>
          <input
            type="number"
            id="duration"
            value={duration || ''}
            onChange={handleDurationChange}
            min="1"
            max="60"
            className="w-full px-3 py-2 bg-white bg-opacity-70 border-2 border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-foreground"
          />
        </div>
      </div>
    </div>
  );
}
