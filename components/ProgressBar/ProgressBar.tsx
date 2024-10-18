"use client";
// components/Car.tsx
import React, { useEffect, useState } from "react";
import { useMyPresence, useOthers } from "@liveblocks/react";
import { useUser } from "@clerk/nextjs";

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
  const [progress, setProgress] = useState<number>();
  const [imageUrl, setImageUrl] = useState<string>();
  const others = useOthers();
  const [myPresence, updateMyPresence] = useMyPresence();
  const { user: login } = useUser();

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

  const getMyAvatar = (user: any = null) => {
    if (user && user.presence.avatarUrl) {
      return user.presence.avatarUrl.toString();
    }
    if (myPresence && myPresence.avatarUrl) return myPresence.avatarUrl.toString();

    return "";
  };
  console.log("@@@score", myPresence.score);
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center ">
      <div
        className="shadow-lg relative bg-gray-200 pt-3 pb-3 w-full"
        style={{ maxWidth: "550px" }}
      >
        {others.map((user) => {
          return (
            <div
              className={`shadow-md mt-2 ${user.presence.color} h-6 flex p-1 items-center relative`}
              style={{ width: `${user.presence.score || 0}%` }}
            >
              {Number(user.presence.score) > 1 && <span className="p-1">{user.info?.name}</span>}
              <div className="absolute top-1/2 -right-5 -translate-y-1/2 translate-x-1/2">
                <img
                  src={getMyAvatar(user)}
                  alt={`${login?.firstName}'s avatar`}
                  className="w-8 rounded-full border-2 border-gray-300 shadow-sm"
                />
              </div>
            </div>
          );
        })}

        <div
          className={`shadow-md mt-2 ${randomColor()} h-6 flex p-1 items-center relative`}
          style={{ width: `${myPresence.score || 0}%` }}
        >
          {Number(myPresence.score) > 1 && <span className="p-1">You</span>}
          <div className="absolute top-1/2 -right-5 -translate-y-1/2 translate-x-1/2">
            <img
              src={getMyAvatar()}
              alt={`${login?.firstName}'s avatar`}
              className="w-8 rounded-full border-2 border-gray-300 shadow-sm"
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
    </div>
  );
};

export default ProgressBar;
