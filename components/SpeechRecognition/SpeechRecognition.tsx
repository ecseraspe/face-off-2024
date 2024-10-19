"use client"; // Ensures this component runs on the client side

import React, { useCallback, useEffect, useRef, useState } from "react";
import SpeechSynthesizer from "./SpeechSynthesizer";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useMyPresence, useStorage, useUpdateMyPresence } from "@liveblocks/react";

type IProps = {
  incrementProgress: () => void;
  isMax: boolean;
};

interface IWords {
  filipino: string;
  english: string;
  difficulty: number;
}

const SpeechRecognitionComponent = ({ incrementProgress, isMax }: IProps) => {
  const [randomizeWords, setRandomizeWords] = useState<IWords[]>([]);

  const tagalogWords = [
    {
      filipino: "panahon",
      english: "weather",
      difficulty: 1,
    },
    {
      filipino: "buhay",
      english: "life",
      difficulty: 1,
    },
    {
      filipino: "kolehiyo",
      english: "college",
      difficulty: 1,
    },
    {
      filipino: "umiyak",
      english: "to cry",
      difficulty: 1,
    },
    {
      filipino: "tanungin",
      english: "to ask",
      difficulty: 1,
    },
    {
      filipino: "tagumpay",
      english: "success",
      difficulty: 2,
    },
    {
      filipino: "kapayapaan",
      english: "peace",
      difficulty: 2,
    },
    {
      filipino: "radyo",
      english: "radio",
      difficulty: 1,
    },
    {
      filipino: "malungkot",
      english: "sad",
      difficulty: 1,
    },
    {
      filipino: "may",
      english: "have",
      difficulty: 1,
    },
    {
      filipino: "matanda",
      english: "old person",
      difficulty: 1,
    },
    {
      filipino: "kalinangan",
      english: "culture",
      difficulty: 3,
    },
    {
      filipino: "kasanayan",
      english: "expertise",
      difficulty: 3,
    },
    {
      filipino: "pagsusuri",
      english: "review",
      difficulty: 2,
    },
    {
      filipino: "araw",
      english: "day",
      difficulty: 1,
    },
    {
      filipino: "mga tanong",
      english: "questions",
      difficulty: 1,
    },
    {
      filipino: "lechon",
      english: "roast pig",
      difficulty: 1,
    },
    {
      filipino: "katibayan",
      english: "evidence",
      difficulty: 3,
    },
    {
      filipino: "lolo",
      english: "grandfather",
      difficulty: 1,
    },
    {
      filipino: "pananampalataya",
      english: "faith",
      difficulty: 2,
    },
    {
      filipino: "tag init",
      english: "summer",
      difficulty: 1,
    },
    {
      filipino: "kare kare",
      english: "oxtail stew",
      difficulty: 1,
    },
    {
      filipino: "pagbuo",
      english: "formation",
      difficulty: 2,
    },
    {
      filipino: "pagtutulungan",
      english: "collaboration",
      difficulty: 2,
    },
    {
      filipino: "magpasa",
      english: "to submit",
      difficulty: 1,
    },
    {
      filipino: "pagsasamahan",
      english: "collaboration",
      difficulty: 2,
    },
    {
      filipino: "malungkot",
      english: "sad",
      difficulty: 1,
    },
    {
      filipino: "magsanay",
      english: "to practice",
      difficulty: 1,
    },
    {
      filipino: "kapasidad",
      english: "capacity",
      difficulty: 3,
    },
    {
      filipino: "dilim",
      english: "darkness",
      difficulty: 1,
    },
    {
      filipino: "katayuan",
      english: "status",
      difficulty: 2,
    },
    {
      filipino: "tindahan",
      english: "store",
      difficulty: 2,
    },
    {
      filipino: "ipanganak",
      english: "to be born",
      difficulty: 1,
    },
    {
      filipino: "pagsusuri",
      english: "scrutiny",
      difficulty: 2,
    },
    {
      filipino: "pagsisikap",
      english: "endeavor",
      difficulty: 2,
    },
    {
      filipino: "tagapagsalita",
      english: "spokesperson",
      difficulty: 2,
    },
    {
      filipino: "matamis",
      english: "sweet",
      difficulty: 1,
    },
    {
      filipino: "pag aaral",
      english: "study",
      difficulty: 1,
    },
    {
      filipino: "gulay",
      english: "vegetable",
      difficulty: 1,
    },
    {
      filipino: "makatawid",
      english: "to pass",
      difficulty: 1,
    },
    {
      filipino: "pagsubok",
      english: "assessment",
      difficulty: 3,
    },
    {
      filipino: "ng",
      english: "of",
      difficulty: 1,
    },
    {
      filipino: "analisis",
      english: "analysis",
      difficulty: 2,
    },
    {
      filipino: "makita",
      english: "to see",
      difficulty: 1,
    },
    {
      filipino: "matahimik",
      english: "quiet",
      difficulty: 1,
    },
    {
      filipino: "kapatid",
      english: "sibling",
      difficulty: 1,
    },
    {
      filipino: "katapatan",
      english: "loyalty",
      difficulty: 2,
    },
    {
      filipino: "aso",
      english: "dog",
      difficulty: 1,
    },
    {
      filipino: "magsalita",
      english: "to speak",
      difficulty: 1,
    },
    {
      filipino: "sangkot",
      english: "involve",
      difficulty: 2,
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
  const [loading, setLoading] = useState(true);

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
    const randomWord = randomizeWords[wordIndex].filipino;
    console.log("@@@@6", randomWord, wordIndex);
    setCurrentWord(randomWord);
    setWordIndex(wordIndex + 1);
    setSpokenWord("");
  };

  const skipWord = () => {
    nextWord();
    setIsListening(false);
  };

  const getTranslation = (currentWord: string | undefined) => {
    if (currentWord) {
      const word = randomizeWords.find((f) => f.filipino === currentWord);
      return word?.english;
    }
    return null;
  };

  useEffect(() => {
    if (randomizeWords.length > 0) nextWord();
  }, [randomizeWords]);

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
      // if (!isListening) return;
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

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(
          "https://api-poc-douligo-test-adfuf0dshhgrcwdf.centralus-01.azurewebsites.net/lingua/randomizewords"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setRandomizeWords(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  // if (loading) return <p>Loading...</p>;

  return (
    <div className="speech-container pt-4 pb-4 text-center w-full">
      <h2>Pronounce the following word:</h2>
      <div className="w-full relative pb-2">
        <p className="current-word text-3xl pb-10 pt-5">{currentWord}</p>

        <button
          onClick={speakText}
          className="w-5 h-5 "
          // style={{ top: "69px", left: "151px" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
            <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
      </div>

      <p className="bg-gray-200 p-3 text-gray-500">Translation : {getTranslation(currentWord)}</p>

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
      {/* <button onClick={incrementProgress}>Increment</button> */}

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
