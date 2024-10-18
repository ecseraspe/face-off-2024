"use client";
// components/Car.tsx
import React, { useEffect, useState } from "react";
import { TruckIcon } from "@heroicons/react/24/solid";
import { useMyPresence, useOthers } from "@liveblocks/react";

type IProps = {
  value: number;
};

const colors = [
  "bg-gray-500",
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-yellow-500",
  "bg-teal-500",
  "bg-lime-500",
  "bg-cyan-500",
  "bg-orange-500",
];
const ProgressBar: React.FC<IProps> = ({ value }) => {
  // const [speed, setSpeed] = useState(5);
  // const [isMoving, setIsMoving] = useState(false);
  const [progress, setProgress] = useState<number>();
  const others = useOthers();
  const [myPresence, updateMyPresence] = useMyPresence();

  const randomColor = () => {
    if (myPresence.color) {
      return myPresence.color;
    }
    let newIndex = Math.floor(Math.random() * colors.length);
    let selectedColor = colors[newIndex];
    if (others.some((user) => user.presence.color === selectedColor)) {
      randomColor();
      return;
    }
    updateMyPresence({ ...myPresence, color: colors[newIndex] });
    return colors[newIndex];
  };
  // const incrementProgress = () => {
  //   setIsMoving(true);
  // };
  // const resetProgress = () => {
  //   setProgress(startLine);
  //   setIsMoving(false);
  // };

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if (isMoving && progress < max) {
  //     interval = setInterval(() => {
  //       if (progress >= max) {
  //         clearInterval(interval);
  //         setIsMoving(false);
  //       } else {
  //         setProgress(progress + 20);
  //       }
  //     }, 100);
  //   }

  //   return () => {
  //     clearInterval(interval); // Clear interval on component unmount
  //   };
  // }, [isMoving, progress]);

  useEffect(() => {
    setProgress(value);
  }, [value]);

  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center ">
      {/* <div className="relative h-20 bg-gray-200" style={{ width: "550px" }}>
        <div
          className="absolute w-12 h-6 transition-transform"
          style={{ transform: `translateX(${carPosition}px)` }}
        >
          <CarIcon />
          Jai2x
        </div>
      </div> */}
      {/* Horizontal progress bar with avatar */}
      {/* <div className="relative w-full bg-gray-200 h-6 rounded-full mt-8"> */}
      <div
        className="relative bg- pt-3 pb-3 w-full"
        style={{ maxWidth: "550px" }}
      >
        {others.map((user) => {
          return (
            <div
              className={`shadow-md mt-2 ${user.presence.color} h-6 flex p-1 items-center relative`}
              style={{ width: `${progress}%` }}
            >
              <span className="p-1">{user.info?.name}</span>
              <div className="absolute top-1/2 -right-5 -translate-y-1/2 translate-x-1/2">
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
            </div>
          );
        })}

        <div
          className={`shadow-md mt-2 ${randomColor()} h-6 flex p-1 items-center relative`}
          style={{ width: `${progress}%` }}
        >
          <span className="p-1">You</span>
          <div className="absolute top-1/2 -right-5 -translate-y-1/2 translate-x-1/2">
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
        </div>
        {/* <div
          className={`shadow-md mt-2 ${randomColor()} h-6 flex p-1 items-center relative`}
          style={{ width: `${progress}%` }}
        >
          <span className="p-1">You</span>
          <div className="absolute top-1/2 -right-5 -translate-y-1/2 translate-x-1/2">
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
        </div> */}

        {/* Avatar */}
        {/* <div
          className="absolute top-0 left-0 h-full"
          style={{ transform: `translateX(${progress}%)` }}
        >
          <img
            src="/avatar.png" // Replace with actual avatar image URL
            alt="Avatar"
            className="h-full w-auto"
          />
        </div> */}
      </div>

      {/* <button
        onClick={progress >= max ? resetProgress : incrementProgress}
        disabled={isMoving && progress < max}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        {progress >= max ? "Reset" : "Go"}
      </button>
      {progress >= max && (
        <p className="text-xl text-green-500 mt-4">You reached the finish line!</p>
      )} */}
    </div>
  );
};

export default ProgressBar;
