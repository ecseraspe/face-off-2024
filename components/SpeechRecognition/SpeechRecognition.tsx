"use client"; // Ensures this component runs on the client side

import React, { useCallback, useEffect, useRef, useState } from "react";
import SpeechSynthesizer from "./SpeechSynthesizer";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useMyPresence, useStorage, useUpdateMyPresence } from "@liveblocks/react";

type IProps = {
  incrementProgress: () => void;
  isMax: boolean;
};

const SpeechRecognitionComponent = ({ incrementProgress, isMax }: IProps) => {
  const tagalogWords = [
    "kamusta",
    "salamat",
    "pagkain",
    "bahay",
    "kaibigan",
    "maganda",
    "tao",
    "araw",
    "gabi",
    "lalaki",
  ];
  const [currentWord, setCurrentWord] = useState<string>();
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenWord, setSpokenWord] = useState<string>(""); // New state for spoken word
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [myPresence, updateMyPresence] = useMyPresence();
  const audioRefSuccess = useRef<HTMLAudioElement | null>(null);
  const speakText = () => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY!,
      process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION!
    );

    setIsListening(false);

    speechConfig.speechSynthesisVoiceName = "fil-PH-BlessicaNeural";
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    setIsSpeaking(true);
    synthesizer.speakTextAsync(
      currentWord || "",
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Speech synthesis completed.");
        } else {
          console.error("Speech synthesis failed:", result.errorDetails);
        }
        setIsSpeaking(false);
        synthesizer.close();
        setIsListening(true);
      },
      (error) => {
        console.error(error);
        setIsSpeaking(false);
        synthesizer.close();
      }
    );
  };

  const startListening = (wordToMatch: string, wIndex: number) => {
    console.log("@@@@1", wordToMatch);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "tl-PH"; // Tagalog language
    recognition.start();
    recognition.continuous = true; // Enable continuous listening
    recognition.interimResults = false; // You can set this to true to get real-time results
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const spokenWord = event.results[0][0].transcript.toLowerCase();
      console.log("@@@@2", spokenWord);
      setSpokenWord(spokenWord); // Update the spoken word

      if (spokenWord === wordToMatch.toLowerCase()) {
        recognition.stop(); // Stop listening after the speech ends
        incrementProgress(); // Move the progress bar
        nextWord(wordToMatch, wIndex + 1); // Show the next word
        audioRefSuccess.current?.play();

        console.log("@@@@3");
      } else {
        // alert("Incorrect pronunciation. Try again!");
        recognition.stop(); // Stop listening after the speech ends
        startListening(wordToMatch, wIndex); // Restart the recognition
        console.log("@@@@4");
      }
    };

    recognition.onspeechend = () => {
      recognition.stop(); // Stop listening after the speech ends
      startListening(wordToMatch, wIndex); // Restart the recognition
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
    };
  };

  const nextWord = useCallback(
    (cWord: string | undefined, indx: number) => {
      let newIndex = 0;
      if (cWord) {
        newIndex = indx;
      }

      const randomWord = tagalogWords[newIndex];
      setCurrentWord(randomWord);
      setWordIndex(newIndex);
      setSpokenWord("");

      if (!isListening) {
        setIsListening(true);
        startListening(randomWord, newIndex); // Automatically restart the recognition
      }
    },
    [currentWord, wordIndex]
  );

  useEffect(() => {
    nextWord(undefined, 0);
  }, []);

  const skipWord = () => {
    nextWord(currentWord, wordIndex + 1);
  };

  // useEffect(() => {
  //   if (isMax) {
  //     alert("Congratulations! You have completed the Tagalog pronunciation exercise.");
  //     setIsListening(false);
  //   }
  // }, [isMax]);

  return (
    <div className="speech-container pt-4 pb-4 text-center w-full">
      <h2>Pronounce the following word:</h2>
      <div className="w-full relative">
        <p className="current-word text-3xl pb-12 pt-5">{currentWord}</p>
        <button
          onClick={speakText}
          className="w-5 h-5 absolute"
          style={{ top: "69px", left: "151px" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
            <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
      </div>

      <p className="bg-gray-200 p-3 text-gray-500">Translation : Test Person</p>

      {spokenWord && (
        <div className="mt-4">
          <h3>You said:</h3>
          <p className="spoken-word text-lg text-green-500">{spokenWord}</p>
        </div>
      )}

      <button
        onClick={() => skipWord()}
        style={{ padding: "10px 20px" }}
        className="px-4 py-2 text-white rounded bg-teal-300 w-full"
      >
        Skip
      </button>
      <audio ref={audioRefSuccess} src="../../../assets/pickup_word.wav" preload="auto" />
    </div>
  );
};

export default SpeechRecognitionComponent;
