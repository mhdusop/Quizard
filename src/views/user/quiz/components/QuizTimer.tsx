"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type QuizTimerProps = {
   initialTime: number;
   onTick: (seconds: number) => void;
   onEnd: () => void;
};

export function QuizTimer({ initialTime, onTick, onEnd }: QuizTimerProps) {
   const [seconds, setSeconds] = useState(initialTime);

   useEffect(() => {

      if (seconds <= 0) {
         onEnd();
         return;
      }

      const timer = setInterval(() => {
         setSeconds(prev => {
            const newValue = prev - 1;
            onTick(newValue);
            return newValue;
         });
      }, 1000);

      return () => clearInterval(timer);
   }, [seconds, onTick, onEnd]);

   const formatTime = (totalSeconds: number) => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
   };

   return (
      <div className={`
      flex items-center space-x-2 px-3 py-1.5 rounded-full
      ${seconds <= 30 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"}
      ${seconds <= 10 ? "animate-pulse" : ""}
    `}>
         <Clock className="h-4 w-4" />
         <span className="font-mono font-medium">{formatTime(seconds)}</span>
      </div>
   );
}