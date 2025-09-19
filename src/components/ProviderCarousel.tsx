import React, { useState, useMemo, useEffect, useRef } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedProviders } from "../api/providers";
import ProviderCard from "./ProviderCard";

export const ProviderCarousel: React.FC = () => {
  const btnStyle =
    "absolute top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: providers,
    isPending,
    error,
  } = useQuery({
    queryKey: ["providers"],
    queryFn: getFeaturedProviders,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const nextSlide = useMemo(
    () => () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === (providers?.length ?? 0) - 1 ? 0 : prevIndex + 1
      );
    },
    [providers?.length]
  );

  const prevSlide = useMemo(
    () => () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? (providers?.length ?? 0) - 1 : prevIndex - 1
      );
    },
    [providers?.length]
  );

  // Auto-slide functionality
  useEffect(() => {
    if (!providers || providers.length <= 1 || isHovered) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [providers, isHovered, nextSlide]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (isPending) {
    return (
      <div className="py-4">
        <div className="relative w-full shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg">
          <div className="flex">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="w-full flex-shrink-0">
                <Skeleton className="w-full h-[300px] rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          {[...Array(3)].map((_, idx) => (
            <span
              key={idx}
              className="mx-1 h-2 w-2 rounded-full bg-gray-300"
              style={{ display: "inline-block" }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <div className="text-center text-gray-500">
          <p>Unable to load providers. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!providers || providers.length === 0) {
    return (
      <div className="py-4">
        <div className="text-center text-gray-500">
          <p>No providers available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div
        className="relative w-full shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-hidden">
          <div
            className="transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            <div className="flex">
              {providers.map((provider) => (
                <div key={provider.id} className="w-full flex-shrink-0">
                  <ProviderCard {...provider} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={prevSlide} className={`${btnStyle} left-4`}>
          <ArrowLeftIcon className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        <button onClick={nextSlide} className={`${btnStyle} right-4`}>
          <ArrowRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Slider Indicator */}
      <div className="flex justify-center mt-4">
        {providers.map((_, idx) => (
          <span
            key={idx}
            className={`mx-1 h-2 w-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-blizbi-teal w-4" : "bg-gray-300"
              }`}
            style={{ display: "inline-block" }}
          />
        ))}
      </div>
    </div>
  );
};
