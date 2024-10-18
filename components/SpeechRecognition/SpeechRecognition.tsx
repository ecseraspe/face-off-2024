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
    {
      filipino: "pagtataya",
      english: "evaluation",
      difficulty: 2,
    },
    {
      filipino: "tamang asal",
      english: "proper conduct",
      difficulty: 2,
    },
    {
      filipino: "pagsisikap",
      english: "endeavor",
      difficulty: 2,
    },
    {
      filipino: "labanan",
      english: "to fight",
      difficulty: 1,
    },
    {
      filipino: "panawagan",
      english: "call",
      difficulty: 2,
    },
    {
      filipino: "iwasan",
      english: "to avoid",
      difficulty: 1,
    },
    {
      filipino: "sili",
      english: "chili",
      difficulty: 1,
    },
    {
      filipino: "timbang",
      english: "weight",
      difficulty: 2,
    },
    {
      filipino: "pagsasama",
      english: "togetherness",
      difficulty: 1,
    },
    {
      filipino: "ako",
      english: "I",
      difficulty: 1,
    },
    {
      filipino: "pancit canton",
      english: "egg noodles",
      difficulty: 1,
    },
    {
      filipino: "responsibilidad",
      english: "responsibility",
      difficulty: 2,
    },
    {
      filipino: "bunga",
      english: "fruit",
      difficulty: 1,
    },
    {
      filipino: "matalino",
      english: "smart",
      difficulty: 1,
    },
    {
      filipino: "kuwento",
      english: "story",
      difficulty: 1,
    },
    {
      filipino: "kalayaan",
      english: "autonomy",
      difficulty: 3,
    },
    {
      filipino: "pagtatayo",
      english: "construction",
      difficulty: 2,
    },
    {
      filipino: "pakikipag ugnayan",
      english: "interaction",
      difficulty: 2,
    },
    {
      filipino: "paghahanda",
      english: "preparation",
      difficulty: 2,
    },
    {
      filipino: "katapatan",
      english: "integrity",
      difficulty: 2,
    },
    {
      filipino: "pagpapahayag",
      english: "expression",
      difficulty: 2,
    },
    {
      filipino: "kasunduan",
      english: "treaty",
      difficulty: 3,
    },
    {
      filipino: "luna",
      english: "moon",
      difficulty: 1,
    },
    {
      filipino: "kaganapan",
      english: "event",
      difficulty: 1,
    },
    {
      filipino: "sapatos",
      english: "shoes",
      difficulty: 1,
    },
    {
      filipino: "pagkakaisa",
      english: "unity",
      difficulty: 2,
    },
    {
      filipino: "pagbuo",
      english: "formation",
      difficulty: 2,
    },
    {
      filipino: "gulay",
      english: "vegetable",
      difficulty: 1,
    },
    {
      filipino: "pag uunawa",
      english: "understanding",
      difficulty: 2,
    },
    {
      filipino: "magsanay",
      english: "to train",
      difficulty: 1,
    },
    {
      filipino: "diskriminasyon",
      english: "discrimination",
      difficulty: 3,
    },
    {
      filipino: "magsimula",
      english: "to start",
      difficulty: 1,
    },
    {
      filipino: "kare kare",
      english: "oxtail stew",
      difficulty: 1,
    },
    {
      filipino: "nakakapagpabagabag",
      english: "unsettling",
      difficulty: 1,
    },
    {
      filipino: "pagbasa",
      english: "reading",
      difficulty: 1,
    },
    {
      filipino: "aliw",
      english: "entertainment",
      difficulty: 1,
    },
    {
      filipino: "maamong",
      english: "gentle",
      difficulty: 1,
    },
    {
      filipino: "umibig",
      english: "to love",
      difficulty: 1,
    },
    {
      filipino: "nanay",
      english: "mother",
      difficulty: 1,
    },
    {
      filipino: "malakas",
      english: "strong",
      difficulty: 1,
    },
    {
      filipino: "saan",
      english: "where",
      difficulty: 1,
    },
  ];
  const [currentWord, setCurrentWord] = useState<string>();
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenWord, setSpokenWord] = useState<string>(""); // New state for spoken word
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [myPresence, updateMyPresence] = useMyPresence();
  const audioRefSuccess = useRef<HTMLAudioElement | null>(null);
  const audioRefError = useRef<HTMLAudioElement | null>(null);

  const speakText = () => {
    setIsListening(false);
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY!,
      process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION!
    );

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
      },
      (error) => {
        console.error(error);
        setIsSpeaking(false);
        synthesizer.close();
      }
    );
  };

  const nextWord = () => {
    const randomWord = tagalogWords[wordIndex].filipino;
    console.log("@@@@6", randomWord, wordIndex);
    setCurrentWord(randomWord);
    setWordIndex(wordIndex + 1);
    setSpokenWord("");
  };

  const skipWord = () => {
    nextWord();
    setIsListening(false);
  };

  useEffect(() => {
    nextWord();
  }, []);

  const startListening = (wordToMatch: string) => {
    if (!wordToMatch) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "tl-PH"; // Tagalog language
    recognition.continuous = true; // Enable continuous listening
    recognition.interimResults = false; // You can set this to true to get real-time results
    recognition.start();
    setIsListening(true);

    recognition.onresult = async (event: any) => {
      if (!isListening) return;
      const spokenWord = event.results[0][0].transcript.toLowerCase();
      console.log("@@@@2", spokenWord);
      setSpokenWord(spokenWord); // Update the spoken word

      if (spokenWord === wordToMatch.toLowerCase()) {
        audioRefSuccess.current?.play();
        incrementProgress(); // Move the progress bar

        nextWord(); // Show the next word
        setIsListening(false);
      } else {
        // alert("Incorrect pronunciation. Try again!");
        audioRefError.current?.play();
        startListening(wordToMatch); // Restart the recognition
      }
    };

    recognition.onspeechend = () => {
      recognition.stop(); // Stop listening after the speech ends
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
    };
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

      <p className="bg-gray-200 p-3 text-gray-500">
        Translation : {tagalogWords[wordIndex].english}
      </p>

      {spokenWord && (
        <div className="mt-4">
          <h3>You said:</h3>
          <p className="spoken-word text-lg text-green-500">{spokenWord}</p>
        </div>
      )}

      <button
        className={`mt-4 pt-4 pb-4 w-full rounded-lg bg-blue-500 text-white ${
          isListening ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => startListening(currentWord || "")}
        disabled={isListening}
      >
        {isListening ? "Listening..." : "Start Speaking"}
      </button>
      <button onClick={incrementProgress}>Increment</button>

      <button
        onClick={() => skipWord()}
        style={{ padding: "10px 20px" }}
        className="px-4 mt-2 py-2 text-white rounded bg-teal-300 w-full"
      >
        Skip
      </button>
      <audio ref={audioRefSuccess} src="/audio/success_word.mp3" preload="auto" />
      <audio ref={audioRefError} src="/audio/error_word.mp3" preload="auto" />
    </div>
  );
};

export default SpeechRecognitionComponent;
