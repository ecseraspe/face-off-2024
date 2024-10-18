"use client";
import { useCallback, useState } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import SpeechRecognitionComponent from "../SpeechRecognition/SpeechRecognition";
import { useMyPresence } from "@/liveblocks.config";

export default function Game() {
  const startLine = 0; // Starting position
  const max = 100; // Finish line position (pixels)
  const [progress, setProgress] = useState<number>(startLine);
  const [isMax, setIsMax] = useState<boolean>(false);
  const [myPresence, updateMyPresence] = useMyPresence();

  const incrementProgress = useCallback(() => {
    setProgress((prev) => prev + 5);
    setIsMax(progress >= max);
    updateMyPresence({ ...myPresence, score: progress + 10 });
  }, [progress]);

  return (
    <div>
      <ProgressBar value={progress} />

      <SpeechRecognitionComponent incrementProgress={incrementProgress} isMax={isMax} />
    </div>
  );
}
