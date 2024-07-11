import React from 'react';
import { Switch } from "@/components/ui/switch"
import { Volume2, VolumeX } from "lucide-react"

type SpeechToggleProps = {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
};

export function SpeechToggle({ isEnabled, onToggle }: SpeechToggleProps) {
  return (
    <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full shadow-md">
      <Switch
        id="speech-mode"
        checked={isEnabled}
        onCheckedChange={onToggle}
        className="hidden"
      />
      <label htmlFor="speech-mode" className="cursor-pointer">
        {isEnabled ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
      </label>
    </div>
  );
}
