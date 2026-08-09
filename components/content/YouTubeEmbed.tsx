"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

/** Official YouTube large-play path (68×48) — rounded rect, not an ellipse. */
const YT_PLAY_MASK = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48" width="68" height="48"><path fill="black" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/></svg>`,
);

const OVERLAY_MASK_STYLE = {
  WebkitMaskImage: `linear-gradient(#fff 0 0), url("data:image/svg+xml,${YT_PLAY_MASK}")`,
  maskImage: `linear-gradient(#fff 0 0), url("data:image/svg+xml,${YT_PLAY_MASK}")`,
  WebkitMaskSize: "100% 100%, 68px 48px",
  maskSize: "100% 100%, 68px 48px",
  WebkitMaskPosition: "center, center",
  maskPosition: "center, center",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as const;

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
        <>
          <div id={playerElementId} className="h-full w-full" title={title} />
          {!isPlaying ? (
            <div
              className="pointer-events-none absolute inset-0 z-10 bg-black/50"
              style={OVERLAY_MASK_STYLE}
              aria-hidden="true"
            />
          ) : null}
        </>
      ) : (
        <button
          type="button"
          onClick={() => setActivated(true)}
          className="absolute inset-0 z-10 block h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
          />
          <span
            className="pointer-events-none absolute inset-0 bg-black/50"
            style={OVERLAY_MASK_STYLE}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
