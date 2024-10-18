"use client";
import { useCallback, useState } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import SpeechRecognitionComponent from "../SpeechRecognition/SpeechRecognition";

export default function Game() {
  const startLine = 0; // Starting position
  const max = 100; // Finish line position (pixels)
  const [progress, setProgress] = useState<number>(startLine);
  const [isMax, setIsMax] = useState<boolean>(false);

  const incrementProgress = useCallback(() => {
    setProgress((prev) => prev + 10);
    setIsMax(progress >= max);
  }, [progress]);

  return (
    <div>
      <ProgressBar value={progress} />

      <SpeechRecognitionComponent
        incrementProgress={incrementProgress}
        isMax={isMax}
      />
    </div>
  );
}
