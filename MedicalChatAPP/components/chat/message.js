import React, { useState, useEffect } from "react";

export const Message = ({ message, index }) => {
  // https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
  const formatTimeAgo = (currentTime, messageTime) => {
    const timeDifference = currentTime - messageTime;
    const timeUnits = [
      { unit: "day", value: 1000 * 60 * 60 * 24 },
      { unit: "hour", value: 1000 * 60 * 60 },
      { unit: "minute", value: 1000 * 60 },
      { unit: "second", value: 1000 },
    ];

    for (const { unit, value } of timeUnits) {
      if (timeDifference >= value) {
        const unitCount = Math.floor(timeDifference / value);
        return `${unitCount} ${unit}${unitCount > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(new Date(), message.time));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeAgo(formatTimeAgo(new Date(), message.time));
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {message.type === "user" ? (
        <div key={index} className="chat chat-end flex-col w-full mt-2 max-w-xs ml-auto justify-end">
          <div className="chat-bubble">{message.text}</div>
          <div className="chat-footer">
            <time className="text-xs opacity-50">{formatTimeAgo(new Date(), message.time)}</time>
          </div>
        </div>
      ) : (
        <div key={index} className="chat chat-start flex-col w-full mt-2 max-w-xs">
          <div className={`chat-bubble ${message.type === "bot" ? "chat-bubble-primary" : "chat-bubble-error"}`}>{message.text}</div>
          <div className="chat-footer">
            <time className="text-xs opacity-50">{formatTimeAgo(new Date(), message.time)}</time>
          </div>
        </div>
      )}
    </>
  );
};
