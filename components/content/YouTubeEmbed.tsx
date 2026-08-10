"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

/** Official YouTube large play button (68×48). */
function YouTubePlayButton({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 68 48"
      width="68"
      height="48"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="red"
        d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
      />
      <path fill="#fff" d="M45 24 27 14v20" />
    </svg>
  );
}

type YTPlayer = {
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onStateChange?: (event: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: {
    PLAYING: number;
  };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    } else if (window.YT?.Player) {
      resolve();
    }
  });

  return youtubeApiPromise;
}

/**
 * Click-to-load YouTube embed: shows a static thumbnail until the visitor
 * interacts, then loads the iframe API and starts playback.
 */
export function YouTubeEmbed({ videoId, title = "YouTube video", className }: YouTubeEmbedProps) {
  const reactId = useId().replace(/:/g, "");
  const playerElementId = `yt-player-${reactId}`;
  const [activated, setActivated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    if (!activated) return;

    let cancelled = false;

    async function setup() {
      await loadYouTubeAPI();
      if (cancelled || !window.YT?.Player) return;

      playerRef.current?.destroy();
      playerRef.current = new window.YT.Player(playerElementId, {
        videoId,
        width: "100%",
        height: "100%",
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          autoplay: 1,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.PLAYING) {
              setIsPlaying(true);
            }
          },
        },
      });
    }

    void setup();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [activated, playerElementId, videoId]);

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-xl border border-border bg-charcoal shadow-soft [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full",
        className,
      )}
    >
      {activated ? (
        <div id={playerElementId} className="h-full w-full" title={title} />
      ) : null}

      {!isPlaying ? (
        <button
          type="button"
          onClick={() => setActivated(true)}
          disabled={activated}
          className={cn(
            "absolute inset-0 z-10 block h-full w-full transform-none active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron",
            activated ? "pointer-events-none cursor-default" : "cursor-pointer",
          )}
          aria-label={`Play video: ${title}`}
          aria-hidden={activated ? true : undefined}
          tabIndex={activated ? -1 : undefined}
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-black/45" aria-hidden="true" />
          <span className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-3 pt-3 pb-8 text-left sm:px-4 sm:pt-4">
            <span className="line-clamp-2 text-sm font-medium text-white drop-shadow sm:text-base">
              {title}
            </span>
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <YouTubePlayButton className="h-12 w-[68px] drop-shadow-md sm:h-14 sm:w-[79px]" />
          </span>
          <span className="absolute bottom-3 right-3 text-xs font-medium text-white/95 drop-shadow sm:bottom-4 sm:right-4 sm:text-sm">
            Watch on YouTube
          </span>
        </button>
      ) : null}
    </div>
  );
}
