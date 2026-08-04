interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

/** Official YouTube large-play path (68×48) — rounded rect, not an ellipse. */
const YT_PLAY_MASK = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48" width="68" height="48"><path fill="black" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/></svg>`,
);

export function YouTubeEmbed({ videoId, title = "YouTube video", className }: YouTubeEmbedProps) {
  return (
    <div
      className={[
        "relative aspect-video overflow-hidden rounded-xl border border-border bg-charcoal shadow-soft",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="h-full w-full"
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-black/50"
        style={{
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
        }}
        aria-hidden="true"
      />
    </div>
  );
}
