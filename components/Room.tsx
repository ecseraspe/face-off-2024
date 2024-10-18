"use client";
import { Presence, useMyPresence } from "@/liveblocks.config";
import { useAuth } from "@clerk/nextjs";
import { useRoom, useStorage } from "@liveblocks/react";
import { useIsInsideRoom, useOthers } from "@liveblocks/react/suspense";
import { useEffect, useRef, useState } from "react";
import styles from "./Room.module.css";
import { A } from "@liveblocks/react/dist/suspense-fYGGJ3D9";
import Game from "./Game/Game";

const COUNTDOWN_DURATION = 3; // 3 seconds countdown before the game starts
const GAME_DURATION = 60; // 2 minutes game duration

export default function Room() {
  const [token, setToken] = useState<string | null>(null);
  const roomId = "liveblocks-tutorial-uGsBXuwY-c0_1ouo_TGBa";
  const room = useRoom();
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameTimer, setGameTimer] = useState<number | null>(null);
  const count = others.length;
  const timerInterval = useRef<NodeJS.Timer | null>(null);
  const startTime = useStorage((root) => root.startTime); // Track the start time in storage
  const [isHost, setIsHost] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    async function fetchToken() {
      const response = await fetch("/api/liveblocks-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });

      if (response.ok) {
        const { token } = await response.json();
        console.log("Token:", token);
        setToken(token);
        // Use this token to join the room
      } else {
        console.error("Failed to authorize pagkatotoy", await response.json());
      }
    }
    fetchToken();
  }, []);

  useEffect(() => {
    if (count === 0) {
      setIsHost(true);
    }
  }, [count]);

  // Set initial presence when joining the room
  useEffect(() => {
    if (!token) return;
    updateMyPresence({ isReady: false });
  }, [updateMyPresence, token]);

  // Handle 3-2-1 countdown
  useEffect(() => {
    if (countdown === null) return;

    if (countdown < 1) setCountdown(null);
    const interval = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : 0));
    }, 1000);

    if (countdown === 0) {
      setGameTimer(GAME_DURATION);
      setStartGame(true);
      setCountdown(null);
      // Start the game timer when countdown ends
    }

    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    if (!ready) {
      room.getStorage().then((storage) => {
        storage.root.set("startTime", null);
      });
    }
  }, [ready]);

  useEffect(() => {
    if (startTime) {
      const now = Date.now();
      const elapsedTime = Math.floor((now - Number(startTime)) / 1000);
      const remainingCountdown = COUNTDOWN_DURATION - elapsedTime;

      if (remainingCountdown > 0) {
        setCountdown(remainingCountdown);
      } else {
        setCountdown(null);
        const remainingGameTime =
          GAME_DURATION - elapsedTime + COUNTDOWN_DURATION;
        setGameTimer(remainingGameTime > 0 ? remainingGameTime : null);
      }
    }
  }, [startTime]);

  // Handle 2-minute game timer
  useEffect(() => {
    if (gameTimer === null) return;

    const interval = setInterval(() => {
      setGameTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (gameTimer === 0) {
      clearInterval(timerInterval.current!);
      alert("Game Over!");
      setGameTimer(null);
      setCountdown(null);
      setGameOver(true);
      setStartGame(false);
      updateMyPresence({ isReady: false });
    }

    return () => clearInterval(interval);
  }, [gameTimer]);

  const startCountdown = () => {
    const now = Date.now();
    room.getStorage().then((storage) => {
      storage.root.set("startTime", now);
    });
  };

  const toggleReady = () => {
    setReady(!ready);
    updateMyPresence({ isReady: true });
  };

  const isButtonEnabled = count + 1 >= 1; // At least 2 players needed

  if (!token) return <div>Please signin to join.</div>;

  const isNotReady = () => {
    if (ready) {
      return (
        others.filter((user) => user.presence?.isReady === false).length > 0
      );
    } else {
      return (
        others.filter((user) => user.presence?.isReady === false).length + 1 > 0
      );
    }
  };
  return (
    <div style={{ textAlign: "center" }} className="w-full pt-5 pb-5">
      {startGame ? (
        <>
          <Game />
        </>
      ) : (
        <>
          <p className="mb-8">Players: {count + 1}</p>
          <ul>
            {others.map((user) => (
              <li key={user.connectionId}>
                {user.info?.name} :{" "}
                {user.presence?.isReady ? "Ready" : "Not Ready"}
              </li>
            ))}
            <li key={myPresence.name}>
              {"You"} : {myPresence?.isReady ? "Ready" : "Not Ready"}
            </li>
          </ul>

          <div className="mt-48">
            {count < 3 && isNotReady() && (
              <button
                onClick={toggleReady}
                disabled={!isButtonEnabled || ready}
                className={`${
                  isButtonEnabled && !ready
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-gray-500 cursor-not-allowed"
                } text-white font-bold py-2 px-4 rounded mb-4`}
              >
                {ready ? "Waiting for others..." : "Get Ready"}
              </button>
            )}
          </div>
        </>
      )}

      {countdown !== null && !gameTimer && <h2>Starting in: {countdown}</h2>}
      {gameTimer !== null && <h2>Time Left: {gameTimer} seconds</h2>}

      {isHost &&
        !countdown &&
        !gameTimer &&
        ready &&
        others.every((user) => user.presence.isReady) && (
          <button
            onClick={startCountdown}
            style={{ padding: "10px 20px" }}
            className="px-4 py-2 text-white rounded bg-blue-500"
          >
            Start Game
          </button>
        )}
    </div>
  );
}
