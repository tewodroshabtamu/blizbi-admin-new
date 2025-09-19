import React, { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import EventCard from "./EventCard";

interface EventData {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  provider: string;
  imageUrl?: string;
  price: {
    type: "free" | "paid";
    amount?: number;
  };
}

interface ChatEventCarouselProps {
  events: EventData[];
}

const ChatEventCarousel: React.FC<ChatEventCarouselProps> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  if (!events || events.length === 0) {
    return null;
  }

  if (events.length === 1) {
    // If only one event, show it without carousel controls
    return (
      <div className="w-full max-w-sm">
        <EventCard event={events[0]} showBookmark={true} />
      </div>
    );
  }

  const btnStyle =
    "absolute top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg z-10 transition-all duration-200";

  return (
    <div className="w-full max-w-sm">
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="flex">
            {events.map((event) => (
              <div key={event.id} className="w-full flex-shrink-0">
                <EventCard event={event} showBookmark={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button onClick={prevSlide} className={`${btnStyle} left-2`}>
          <ArrowLeftIcon className="w-4 h-4" />
        </button>

        <button onClick={nextSlide} className={`${btnStyle} right-2`}>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Slider Indicator */}
      <div className="flex justify-center mt-3">
        {events.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`mx-1 h-2 w-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-blizbi-teal w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Event Counter */}
      <div className="text-center mt-2">
        <span className="text-xs text-gray-500">
          {currentIndex + 1} of {events.length} events
        </span>
      </div>
    </div>
  );
};

export default ChatEventCarousel;
